import path from 'node:path'

const config = {
  port: Number(process.env.PORT) || 5000,
  env: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  adminPassword: process.env.ADMIN_PASSWORD || '',
  // Built frontend served by this server in production (one link for everything).
  frontendDist: path.resolve(import.meta.dirname, '../../../frontend/dist'),
  dbPath: path.resolve(import.meta.dirname, '../..', process.env.DB_PATH || 'data/app.db'),
}

export default config
