import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import generateRoute from './routes/generate.route.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// load the .env.local file
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const PORT = 3000;
const app = express();

app.use(express.json());
app.use('/api', generateRoute);

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
