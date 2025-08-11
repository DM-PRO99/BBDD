import express, { json } from 'express';
import pkg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(json());


// Configuración de PostgreSQL con datos reales
const db = new Pool({
  host: 'aws-0-us-east-1.pooler.supabase.com',
  user: 'postgres.mokqhkjybvmhpkjlqhcj',
  password: process.env.POSTGRES_PASSWORD,
  database: 'postgres',
  port: 6543,
  ssl: { rejectUnauthorized: false } 
});

// Obtener todos los usuarios
app.get('/users', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Agregar usuario
app.post('/users', async (req, res) => {
  const { name, email, password } = req.body;
  console.log(`Datos recibidos: ${JSON.stringify(req.body)}`);
  try {
    await db.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email, password]);
    res.json({ message: 'Usuario agregado' });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Obtener usuarios por nombre
app.get('/users/name/:nombre', async (req, res) => {
  const { nombre } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM users WHERE name ILIKE $1', [`%${nombre}%`]);
    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Obtener un usuario por ID
app.get('/user/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json(err);
  }
});


// Contar usuarios
app.get('/count', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT COUNT(*) AS numUsers FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
});







// Eliminar usuario
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM usuarios WHERE id = $1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json(err);
  }
});

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));