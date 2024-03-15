import { config } from 'dotenv';
import mysql from 'mysql2/promise';

class Database {
  constructor () {
    config();

    this.pool = mysql.createPool({
      host: process.env.MYSQL_HOST || process.env.MYSQL_HOST_TEST,
      user: process.env.MYSQL_USER || process.env.MYSQL_USER_TEST,
      password: process.env.MYSQL_PASS || process.env.MYSQL_PASS_TEST,
      database: process.env.MYSQL_DB,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }

  async connect () {
    const connection = await this.pool.getConnection().catch(error => {
      console.error('Erro ao conectar ao banco de dados:', error);
      throw error;
    });

    if (connection) {
      console.log('Conectado ao banco de dados');
      connection.release();
    }
  }

  async query (sql, params = []) {
    const connection = await this.pool.getConnection();
    try {
      const [rows] = await connection.execute(sql, params);
      return rows;
    } catch (error) {
      console.error('Erro na consulta SQL:', error);
      throw error;
    } finally {
      connection.release();
    }
  }
}

export default Database;
