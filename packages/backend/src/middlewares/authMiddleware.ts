import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error('ERROR: JWT_SECRET is not defined in .env file for authMiddleware!');
    process.exit(1);
}

interface DecodedToken {
    id: string;
    email: string;
    name?: string;
    iat: number;
    exp: number;
}

const authMiddleware = (req: Request, res: Response, next: NextFunction): Response | void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided!' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
        (req as any).user = decoded;
        next();
    } catch (error: any) {
        console.error('JWT Verification Error:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token Expired.' });
        }
        return res.status(403).json({ message: 'Invalid Token!' });
    }
};


export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if ( (req as any).user?.role === 'admin') return next();
    return res.status(403).json({ error: 'Admin access required' });
};

export const isStaff = (req: Request, res: Response, next: NextFunction) => {
    if ( (req as any).user?.role === 'staff' ||  (req as any).user?.role === 'admin') return next();
    return res.status(403).json({ error: 'Staff access required' });
};

export const isUser = (req: Request, res: Response, next: NextFunction) => {
    if ( (req as any).user?.role === 'participant') return next();
    return res.status(403).json({ error: 'Participant access required' });
};


export default authMiddleware;