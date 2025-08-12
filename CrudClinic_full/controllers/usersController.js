import { pool } from '../db/connection.js';

export async function getAllUsers(req, res) {
  try {
    const [rows] = await pool.execute('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
}

export async function getUserById(req, res) {
  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({error: 'Not found'});
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
}

export async function createUser(req, res) {
  try {
    const { name, email, phone } = req.body;
    const [result] = await pool.execute('INSERT INTO users (name,email,phone) VALUES (?,?,?)', [name, email, phone]);
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
}

export async function updateUser(req, res) {
  try {
    const { name, email, phone } = req.body;
    const [result] = await pool.execute('UPDATE users SET name=?, email=?, phone=? WHERE id=?', [name, email, phone, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({error: 'Not found'});
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
}

export async function deleteUser(req, res) {
  try {
    const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({error: 'Not found'});
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({error: err.message});
  }
}
