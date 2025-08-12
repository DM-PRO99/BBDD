import fs from 'fs';
import { parse } from 'fast-csv';
import { pool } from '../db/connection.js';

export async function processProductsCsv(filePath) {
  const BATCH_SIZE = 500;
  let insertedRows = 0;
  const stream = fs.createReadStream(filePath);

  return new Promise((resolve, reject) => {
    const rowsBatch = [];
    const csvStream = parse({ headers: true, ignoreEmpty: true })
      .on('error', error => reject(error))
      .on('data', (row) => {
        // expected columns: name,description,price,category
        rowsBatch.push(row);
        if (rowsBatch.length >= BATCH_SIZE) {
          csvStream.pause();
          insertBatch(rowsBatch.splice(0, rowsBatch.length))
            .then(n => { insertedRows += n; csvStream.resume(); })
            .catch(err => reject(err));
        }
      })
      .on('end', async (rowCount) => {
        try {
          if (rowsBatch.length > 0) {
            const n = await insertBatch(rowsBatch.splice(0, rowsBatch.length));
            insertedRows += n;
          }
          fs.unlinkSync(filePath);
          resolve({ insertedRows });
        } catch (err) {
          reject(err);
        }
      });

    stream.pipe(csvStream);

    async function insertBatch(batch) {
      // batch: array of objects {name,description,price,category}
      const conn = await pool.getConnection();
      try {
        await conn.beginTransaction();
        // 1) ensure categories exist and get mapping
        const categories = [...new Set(batch.map(r => (r.category || '').trim()).filter(Boolean))];
        const catMap = {};
        if (categories.length > 0) {
          // insert missing categories
          const [existing] = await conn.query('SELECT id, name FROM categories WHERE name IN (?)', [categories]);
          const existingNames = existing.map(e => e.name);
          const toInsert = categories.filter(c => !existingNames.includes(c));
          if (toInsert.length > 0) {
            const vals = toInsert.map(n => [n]);
            await conn.query('INSERT INTO categories (name) VALUES ?', [vals]);
          }
          const [allCats] = await conn.query('SELECT id, name FROM categories WHERE name IN (?)', [categories]);
          allCats.forEach(c => catMap[c.name] = c.id);
        }
        // 2) prepare bulk insert for products
        const values = batch.map(r => [
          (r.name||'').trim(),
          (r.description||'').trim() || null,
          parseFloat(r.price) || 0.0,
          catMap[(r.category||'').trim()] || null
        ]);
        if (values.length > 0) {
          await conn.query('INSERT INTO products (name, description, price, category_id) VALUES ?', [values]);
        }
        await conn.commit();
        return values.length;
      } catch (err) {
        await conn.rollback();
        throw err;
      } finally {
        conn.release();
      }
    }
  });
}
