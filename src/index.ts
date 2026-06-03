import 'reflect-metadata';
import express from 'express';
import router from './routes/api.js';

const app = express();

// Global middlewares
app.use(express.json());
// Mount API routes
app.use('/api', router);

// Set Pug as the view engine
import path from 'path';
import fs from 'fs';

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Root route renders the main view with Vite assets (if manifest exists)
app.get('/', (_req, res) => {
  let manifest: Record<string, any> = {};
  try {
    const manifestPath = path.resolve(__dirname, '../build/manifest.json');
    const raw = fs.readFileSync(manifestPath, 'utf-8');
    manifest = JSON.parse(raw);
  } catch (e) {
    // ignore if manifest not present (dev mode)
  }
  res.render('index', { assets: manifest });
});


const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

export default app;
