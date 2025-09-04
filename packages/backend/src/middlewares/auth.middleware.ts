// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Assuming Bearer token

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(
        token,
        process.env.JWT_SECRET as string,
        (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
          (req as any)  .user = decoded;
            next();
        }
    );
};
