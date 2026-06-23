import dotenv from 'dotenv';

dotenv.config();

const splitOrigins = value => String(value || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

export const env = Object.freeze({
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT || 4000),
  API_BASE_PATH: process.env.API_BASE_PATH || '/api',
  CORS_ORIGINS: splitOrigins(process.env.CORS_ORIGIN || 'http://localhost:4173,http://127.0.0.1:4173'),
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'dev-access-secret',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  COOKIE_NAME: process.env.COOKIE_NAME || 'modeweb_refresh_token',
  COOKIE_SECURE: String(process.env.COOKIE_SECURE || 'false') === 'true',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || '',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || '',
  ADMIN_FULL_NAME: process.env.ADMIN_FULL_NAME || 'Sıla Sarıoğlu Admin'
});
