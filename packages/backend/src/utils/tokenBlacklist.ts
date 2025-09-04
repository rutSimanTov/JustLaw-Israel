// שימוש ב-Set בזיכרון מתאים רק לפיתוח. לפרודקשן יש להשתמש ב-Redis או DB.

let memoryBlacklist = new Set<string>();

// דוגמה לשימוש ב-Redis (לפרודקשן)
import dotenv from 'dotenv';
dotenv.config();

let useRedis = false;
let redisClient: any = null;

if (process.env.REDIS_URL) {
  useRedis = true;
  // טעינת redis רק אם צריך
  // npm install redis
  // @ts-ignore
  const { createClient } = require('redis');
  redisClient = createClient({ url: process.env.REDIS_URL });
  redisClient.connect().catch(console.error);
}

export async function addToBlacklist(token: string) {
  if (useRedis && redisClient) {
    await redisClient.set(`blacklist:${token}`, '1');
  } else {
    memoryBlacklist.add(token);
  }
}

export async function isBlacklisted(token: string): Promise<boolean> {
  if (useRedis && redisClient) {
    return !!(await redisClient.get(`blacklist:${token}`));
  } else {
    return memoryBlacklist.has(token);
  }
}