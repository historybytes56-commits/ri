import path from 'node:path'

const config = {
  port: Number(process.env.PORT) || 5000,
  env: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  dbPath: path.resolve(import.meta.dirname, '../..', process.env.DB_PATH || 'data/app.db'),
}

export default config
