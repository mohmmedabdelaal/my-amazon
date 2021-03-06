import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRoutes from './routes/seedRoutes.js';
import productRoutes from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

mongoose
  .connect(process.env.MONGODB_DATA)
  .then((res) => {
    console.log('Connected to DB');
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// test

app.get('/api/keys/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

app.use('/api/seed', seedRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRoutes);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/frontend/build/index.html'));
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
