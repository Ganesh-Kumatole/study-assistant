import express from 'express';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import generateResRouter from './routes/generate.route.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// load the .env.local file
try {
  const env = readFileSync(resolve(__dirname, '../.env.local'), 'utf8');
  for (const line of env.split('\n')) {
    const [key, ...rest] = line.split('=');
    if (key?.trim() && rest.length)
      process.env[key.trim()] = rest.join('=').trim();
  }
  console.log('[server] .env.local loaded');
} catch {
  console.warn(
    '[server] no .env.local found — make sure GEMINI_API_KEY is set',
  );
}

// initialize the app
const app = express();

// middleware to parse JSON of req body
app.use(express.json());

// All AI-related routes live under /api
app.use('/api', generateResRouter);

app.listen(3000, () =>
  console.log('[server] running on http://localhost:3000'),
);
