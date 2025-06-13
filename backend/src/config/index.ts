import dotenv from 'dotenv';
dotenv.config();

/**
 * Lấy biến môi trường, hoặc mặc định nếu không có
 */
export const PORT = process.env.PORT || '5000';

export const FIREBASE_SERVICE_ACCOUNT_PATH =
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json';

export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

export const GEMINI_API_URL = process.env.GEMINI_API_URL || 'https://api.gemini.com/v1/news';
