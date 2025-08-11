const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { createUser } = require('../models/users');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET || 'secret_local';

// register
router.post('/register', async (req,res) => {
  try{
    const { username, password, name, email, phone } = req.body;
    if(!username || !password) return res.status(400).json({ error: 'username and password required' });
    const hash = await bcrypt.hash(password, 10);
    const id = await createUser({username, password: hash, name, email, phone, role:'user'});
    res.json({ id, username });
  }catch(err){ 
    if(err && err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'username or email already exists' });
    res.status(500).json({ error: err.message });
  }
});

// login
router.post('/login', async (req,res) => {
  try{
    const { username, password } = req.body;
    if(!username || !password) return res.status(400).json({ error: 'username and password required' });
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ? OR email = ?',[username, username]);
    if(!rows.length) return res.status(401).json({ error: 'invalid credentials' });
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if(!ok) return res.status(401).json({ error: 'invalid credentials' });
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: user.id, username: user.username, name: user.name, email: user.email, role: user.role } });
  }catch(err){ res.status(500).json({ error: err.message }); }
});

module.exports = router;
