const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAllUsers, deleteUser, updateUser } = require('../models/users');

router.get('/', auth, async (req,res) => {
  try{
    const rows = await getAllUsers();
    res.json(rows);
  }catch(err){ res.status(500).json({ error: err.message }); }
});

router.delete('/:id', auth, async (req,res) => {
  try{
    const ok = await deleteUser(req.params.id);
    res.json({ ok });
  }catch(err){ res.status(500).json({ error: err.message }); }
});

router.put('/:id', auth, async (req,res) => {
  try{
    const ok = await updateUser(req.params.id, req.body);
    res.json({ ok });
  }catch(err){ res.status(500).json({ error: err.message }); }
});

module.exports = router;
