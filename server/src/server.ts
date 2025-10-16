import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import creditRoutes from '../routes/creditRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/creditsea";

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

app.get('/', (req, res) => {
  res.json({
    message: 'CreditSea API Server',
    version: '1.0.0',
    endpoints: {
      upload: 'POST /api/credit/upload',
      reports: 'GET /api/credit/reports',
      report: 'GET /api/credit/reports/:id',
      delete: 'DELETE /api/credit/reports/:id',
      stats: 'GET /api/credit/stats/overview'
    }
  });
});

app.use('/api/credit', creditRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));