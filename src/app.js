import env from 'dotenv';
import express from 'express';
import Database from './database/mysql.js';
import routes from './routes/index.js';

export class App {
  constructor () {
    this.app = express();

    this.config();

    this.db = new Database();

    this.app.get('/', (req, res) => res.json({ message: 'Hello World!' }));

    this.routes();
  }

  config () {
    const accessControl = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header(
        'Access-Control-Allow-Methods',
        'GET,POST,DELETE,OPTIONS,PUT,PATCH'
      );
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };
    env.config();
    this.app.use(express.json());
    this.app.use(accessControl);
  }

  routes () {
    this.app.use(routes);
  }

  async start (PORT) {
    this.db.connect();
    this.app.listen(PORT, () => console.log(`Running on port ${PORT}`));
  }
}
