import express from 'express';
import dotenv from 'dotenv';
import productsRouter from './routes/products.js';
import usersRouter from './routes/users.js';
import uploadRouter from './routes/upload.js';

dotenv.config();
const app = express();
app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter);
app.use('/api/upload', uploadRouter);

app.get('/', (req, res) => res.send('CRUD Clinic API'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
