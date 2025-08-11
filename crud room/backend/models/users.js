const pool = require('../db');

async function createUser({username, password, name, email, phone, role='user'}){
  const [r] = await pool.query('INSERT INTO users (username,password,name,email,phone,role) VALUES (?,?,?,?,?,?)',
    [username,password,name||null,email||null,phone||null,role]);
  return r.insertId;
}

async function findByUsername(username){
  const [rows] = await pool.query('SELECT * FROM users WHERE username = ? OR email = ?',[username, username]);
  return rows;
}

async function getAllUsers(){
  const [rows] = await pool.query('SELECT id, username, name, email, phone, role FROM users');
  return rows;
}

async function deleteUser(id){
  const [r] = await pool.query('DELETE FROM users WHERE id = ?',[id]);
  return r.affectedRows>0;
}

async function updateUser(id, data){
  const {name, email, phone, role} = data;
  const [r] = await pool.query('UPDATE users SET name=?, email=?, phone=?, role=? WHERE id=?',[name,email,phone,role,id]);
  return r.affectedRows>0;
}

module.exports = { createUser, findByUsername, getAllUsers, deleteUser, updateUser };
