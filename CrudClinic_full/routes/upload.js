import express from 'express';
import multer from 'multer';
import { processProductsCsv } from '../services/csvService.js';
const router = express.Router();
const upload = multer({ dest: 'tmp/' });

router.post('/products', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const result = await processProductsCsv(req.file.path);
    res.json({ success: true, inserted: result.insertedRows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, error: err.message });
  }
});

export default router;
