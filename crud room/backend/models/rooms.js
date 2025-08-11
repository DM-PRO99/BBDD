const pool = require('../db');

async function getRooms(){
  const [rows] = await pool.query('SELECT * FROM rooms');
  return rows;
}

async function createRoom({name,capacity}){
  const [r] = await pool.query('INSERT INTO rooms (name,capacity) VALUES (?,?)',[name,capacity]);
  return r.insertId;
}

async function updateRoom(id,{name,capacity,status}){
  const [r] = await pool.query('UPDATE rooms SET name=?, capacity=?, status=? WHERE id=?',[name,capacity,status||'available',id]);
  return r.affectedRows>0;
}

async function deleteRoom(id){
  const [r] = await pool.query('DELETE FROM rooms WHERE id=?',[id]);
  return r.affectedRows>0;
}

module.exports = { getRooms, createRoom, updateRoom, deleteRoom };
