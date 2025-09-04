import { UUID } from 'crypto';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret';
const payload = { user_id: '1'};
const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
console.log(token);
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) return res.status(401).json({ success: false, error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: UUID; isAdmin: boolean };
    req.user = {
      id: decoded.id,
    };
    next();
  } catch (err) {
    return res.status(403).json({ success: false, error: 'Invalid or expired token' });
  }
}

const middleware = ()=> {
  
}   
export default middleware;