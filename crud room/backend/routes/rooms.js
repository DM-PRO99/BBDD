const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getRooms, createRoom, updateRoom, deleteRoom } = require('../models/rooms');

router.get('/', auth, async (req,res)=>{
  try{
    const rows = await getRooms();
    res.json(rows);
  }catch(err){ res.status(500).json({ error: err.message }); }
});

router.post('/', auth, async (req,res)=>{
  try{
    const id = await createRoom(req.body);
    res.json({ id });
  }catch(err){ res.status(500).json({ error: err.message }); }
});

router.put('/:id', auth, async (req,res)=>{
  try{
    const ok = await updateRoom(req.params.id, req.body);
    res.json({ ok });
  }catch(err){ res.status(500).json({ error: err.message }); }
});

router.delete('/:id', auth, async (req,res)=>{
  try{
    const ok = await deleteRoom(req.params.id);
    res.json({ ok });
  }catch(err){ res.status(500).json({ error: err.message }); }
});

module.exports = router;
