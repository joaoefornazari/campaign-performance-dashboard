import express, { Request, Response } from 'express';
import router from './routes/api.js';

const app = express();

// Global middlewares
app.use(express.json());
// Mount API routes
app.use('/api', router);

// Simple health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

export default app;
