import { config } from 'dotenv';
import { App } from './app.js';

config();

const PORT = process.env.PORT ?? 3000;

new App().start(PORT);
