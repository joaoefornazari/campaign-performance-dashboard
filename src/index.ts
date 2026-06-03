import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from './database/data-source.js';
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

function readManifest(): Record<string, any> {
  try {
    const manifestPath = path.resolve(__dirname, '../build/.vite/manifest.json');
    const raw = fs.readFileSync(manifestPath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

// Static files from Vite build
app.use('/assets', express.static(path.resolve(__dirname, '../build/assets')));

// Root route renders the main view with Vite assets (if manifest exists)
app.get('/', (_req, res) => {
  res.render('index', { assets: readManifest() });
});

// Login page
app.get('/login', (_req, res) => {
  res.render('login', { assets: readManifest() });
});

// Dashboard page
app.get('/dashboard', (_req, res) => {
  res.render('dashboard', { assets: readManifest() });
});

if (process.env.NODE_ENV !== 'test') {
  AppDataSource.initialize().then(() => {
    const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  });
}

export default app;
