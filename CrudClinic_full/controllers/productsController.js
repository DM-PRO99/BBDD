import { pool } from '../db/connection.js';

// GET /api/products
export async function getAllProducts(req, res) {
  try {
    const [rows] = await pool.execute('SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
}

export async function getProductById(req, res) {
  try {
    const [rows] = await pool.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({error: 'Not found'});
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
}

export async function createProduct(req, res) {
  try {
    const { name, description, price, category_id } = req.body;
    const [result] = await pool.execute('INSERT INTO products (name, description, price, category_id) VALUES (?,?,?,?)', [name, description, price, category_id || null]);
    const [rows] = await pool.execute('SELECT * FROM products WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
}

export async function updateProduct(req, res) {
  try {
    const { name, description, price, category_id } = req.body;
    const [result] = await pool.execute(
      'UPDATE products SET name = ?, description = ?, price = ?, category_id = ? WHERE id = ?',
      [name, description, price, category_id || null, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({error: 'Not found'});
    const [rows] = await pool.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
}

export async function deleteProduct(req, res) {
  try {
    const [result] = await pool.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({error: 'Not found'});
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({error: err.message});
  }
}
