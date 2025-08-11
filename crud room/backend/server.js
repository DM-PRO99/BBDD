require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./db');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/rooms', require('./routes/rooms'));

// static frontend (served from frontend/ when running from project root)
app.use('/', express.static(path.join(__dirname, '..', 'frontend')));

// ensure admin user exists
async function ensureAdmin() {
  try {
    const [rows] = await pool.query('SELECT COUNT(*) as c FROM users');
    if(rows && rows[0] && rows[0].c === 0) {
      const defaultUser = 'admin';
      const defaultPass = 'admin123';
      const hash = await bcrypt.hash(defaultPass, 10);
      await pool.query('INSERT INTO users (username,password,name,role) VALUES (?,?,?,?)',[defaultUser,hash,'Administrador','admin']);
      console.log('Admin user created -> username: admin, password: admin123');
    } else {
      console.log('Users already exist, skip admin seed.');
    }
  } catch(err) {
    console.error('Error ensuring admin user:', err.message);
  }
}

const PORT = process.env.PORT || 3000;
ensureAdmin().then(()=>{
  app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
});
