const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./db');
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create client
app.post('/clients', async (req, res) => {
  try {
    const { identification, name, address, phone, email } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });
    const [result] = await pool.query('INSERT INTO clients (identification,name,address,phone,email) VALUES (?,?,?,?,?)', [identification,name,address,phone,email]);
    const [rows] = await pool.query('SELECT * FROM clients WHERE client_id = ?', [result.insertId]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal server error' });
  }
});

// Read all clients
app.get('/clients', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clients');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal server error' });
  }
});

// Read single client
app.get('/clients/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await pool.query('SELECT * FROM clients WHERE client_id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal server error' });
  }
});

// Update client
app.put('/clients/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { identification, name, address, phone, email } = req.body;
    const [result] = await pool.query('UPDATE clients SET identification=?, name=?, address=?, phone=?, email=? WHERE client_id=?', [identification,name,address,phone,email,id]);
    const [rows] = await pool.query('SELECT * FROM clients WHERE client_id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal server error' });
  }
});

// Delete client
app.delete('/clients/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await pool.query('DELETE FROM clients WHERE client_id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal server error' });
  }
});

// Advanced queries endpoints (for Postman testing)
app.get('/reports/total_paid_per_client', async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT c.client_id, c.name, COALESCE(SUM(t.amount),0) AS total_paid FROM clients c LEFT JOIN transactions t ON c.client_id = t.client_id GROUP BY c.client_id, c.name`);
    res.json(rows);
  } catch (err) { console.error(err); res.status(500).json({ error: 'internal server error' }); }
});

app.get('/reports/pending_invoices', async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT i.invoice_id, i.invoice_number, i.amount, i.paid_amount, c.client_id, c.name, t.id AS transaction_id, t.amount AS transaction_amount FROM invoices i LEFT JOIN clients c ON i.client_id = c.client_id LEFT JOIN transactions t ON t.invoice_id = i.invoice_id WHERE i.paid_amount < i.amount`);
    res.json(rows);
  } catch (err) { console.error(err); res.status(500).json({ error: 'internal server error' }); }
});

app.get('/reports/transactions_by_platform/:platform', async (req, res) => {
  try {
    const platform = req.params.platform;
    const [rows] = await pool.query(`SELECT t.*, c.name as client_name, i.invoice_number, p.name as platform_name FROM transactions t LEFT JOIN clients c ON t.client_id = c.client_id LEFT JOIN invoices i ON t.invoice_id = i.invoice_id LEFT JOIN platforms p ON t.platform_id = p.platform_id WHERE p.name = ?`, [platform]);
    res.json(rows);
  } catch (err) { console.error(err); res.status(500).json({ error: 'internal server error' }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on port', PORT));