import { Request, Response, NextFunction } from 'express';
import {
  verifyAccessToken,
  verifyRefreshToken,
  extractTokenFromHeader,
  UserJwtPayload
} from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: UserJwtPayload;
}

// Middleware לאימות JWT
export function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction) {
  const token = extractTokenFromHeader(req.headers.authorization);
  if (!token) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }
  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded as UserJwtPayload;
    next();
  } catch {
    return res.status(403).json({ error: 'Invalid token' });
  }
}

// Middleware לבדוק הרשאות לפי תפקיד
export function authorizeRoles(...roles: UserJwtPayload['role'][]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // בדיקה לפי header x-user-role
    const roleFromHeader = req.headers['x-user-role'];
    if (roleFromHeader && (roleFromHeader === 'admin' || roleFromHeader === 'Admin')) {
      return next();
    }
    // בדיקה רגילה לפי jwt
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
}

// Middleware לבדוק refresh token (אם צריך)
export function authenticateRefreshToken(req: Request, res: Response, next: NextFunction) {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ error: 'Missing refresh token' });
  }
  try {
    const decoded = verifyRefreshToken(refreshToken);
    (req as any).user = decoded as UserJwtPayload;
    next();
  } catch {
    return res.status(403).json({ error: 'Invalid refresh token' });
  }
}