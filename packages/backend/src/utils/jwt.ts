import jwt from 'jsonwebtoken';

// הגדרת הטיפוס וייצואו כאן!
export interface UserJwtPayload {
  id: string;
  role: 'Admin' | 'User';
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh-secret';

// יצירת access token
export function generateAccessToken(payload: UserJwtPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

// יצירת refresh token
export function generateRefreshToken(payload: UserJwtPayload) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
}

// בדיקת access token
export function verifyAccessToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}

// בדיקת refresh token
export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET);
}

// שליפת טוקן מה-header
export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.split(' ')[1];
}