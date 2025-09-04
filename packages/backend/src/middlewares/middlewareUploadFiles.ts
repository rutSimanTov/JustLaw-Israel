import { Request, Response, NextFunction } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'; 

dotenv.config(); 

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error('ERROR: JWT_SECRET is not defined in .env file for authMiddleware!');
    process.exit(1);
}

// Middleware 1: פונקציה לשמירה על קבצים והמרתם ל-Base64
interface FileWithBase64 extends Express.Multer.File {
  base64Content?: string;
}

// פונקציה להמרת תוכן הקבצים ל-Base64
const encodeToBase64 = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.files = (req.files as FileWithBase64[]).map(file => {
      try {
        if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/') || file.mimetype === 'audio/mpeg') {
          const fileContent = fs.readFileSync(file.path);
          file.base64Content = `data:${file.mimetype};base64,${fileContent.toString('base64')}`;
        } else if (file.mimetype.startsWith('text/') || file.mimetype.startsWith('application/')) {
          const textContent = fs.readFileSync(file.path, 'utf-8');
          file.base64Content = `data:${file.mimetype};base64,${Buffer.from(textContent, 'utf-8').toString('base64')}`;
        }
      } catch (err) {
        console.error(`שגיאה בקריאת קובץ ${file.originalname}:`, err);
        file.base64Content = undefined;
      }
      return file;
    });
    next();
  } catch (err) {
    console.error('שגיאה בהמרת קובץ ל-Base64:', err);
    return res.status(500).json({ message: 'שגיאה בהמרת קובץ ל-Base64' });
  }
};

// Middleware 2: הגדרת שמירה עבור multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      cb(null, 'uploads/');
    } catch (err) {
      console.error('שגיאה בהגדרת תיקיית העלאה:', err);
      cb(err as Error, '');
    }
  },
  filename: (req, file, cb) => {
    try {
      cb(null, Date.now() + path.extname(file.originalname));
    } catch (err) {
      console.error('שגיאה ביצירת שם קובץ:', err);
      cb(err as Error, '');
    }
  },
});

// פונקציה לבדוק סוג קבצים עבור multer
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const filetypes = /pdf|docx|pptx|jpg|jpeg|png|mp4|mov|avi|wmv|flv|mkv|mp3|txt|html|zip|rar|csv|xls|xlsx/;
  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = filetypes.test(file.mimetype);

  // בדיקת סוג קובץ
  if (!mimetype && !filetypes.test(extname)) {
    console.error('סוג קובץ לא מורשה:', file.originalname, file.mimetype);
    return cb(new Error('סוג קובץ לא מורשה'));
  }

  const maxSize = {
    pdf: 10 * 1024 * 1024, // 10MB
    docx: 10 * 1024 * 1024, // 10MB
    pptx: 10 * 1024 * 1024, // 10MB
    image: 5 * 1024 * 1024, // 5MB
    video: 50 * 1024 * 1024, // 50MB
    audio: 20 * 1024 * 1024, // 20MB
    text: 2 * 1024 * 1024, // 2MB
    html: 2 * 1024 * 1024, // 2MB
    archive: 10 * 1024 * 1024, // 10MB
    spreadsheet: 10 * 1024 * 1024 // 10MB
  };

  // בדיקת גודל קובץ
  if (extname.match(/pdf/) && file.size > maxSize.pdf) {
    console.error('קובץ PDF גדול מדי:', file.originalname, file.size);
    return cb(new Error('הקובץ חורג מהמגבלה המקסימלית עבור קבצי PDF (10MB)'));
  } else if (extname.match(/docx/) && file.size > maxSize.docx) {
    console.error('קובץ DOCX גדול מדי:', file.originalname, file.size);
    return cb(new Error('הקובץ חורג מהמגבלה המקסימלית עבור קבצי DOCX (10MB)'));
  } else if (extname.match(/pptx/) && file.size > maxSize.pptx) {
    console.error('קובץ PPTX גדול מדי:', file.originalname, file.size);
    return cb(new Error('הקובץ חורג מהמגבלה המקסימלית עבור קבצי PPTX (10MB)'));
  } else if (extname.match(/jpg|jpeg|png/) && file.size > maxSize.image) {
    console.error('קובץ תמונה גדול מדי:', file.originalname, file.size);
    return cb(new Error('הקובץ חורג מהמגבלה המקסימלית עבור קבצים בתצורת תמונה (5MB)'));
  } else if (extname.match(/mp4|mov|avi|wmv|flv|mkv/) && file.size > maxSize.video) {
    console.error('קובץ וידאו גדול מדי:', file.originalname, file.size);
    return cb(new Error('הקובץ חורג מהמגבלה המקסימלית עבור קבצי וידאו (50MB)'));
  } else if (extname.match(/mp3/) && file.size > maxSize.audio) {
    console.error('קובץ שמע גדול מדי:', file.originalname, file.size);
    return cb(new Error('הקובץ חורג מהמגבלה המקסימלית עבור קבצי שמע (20MB)'));
  } else if (extname.match(/txt/) && file.size > maxSize.text) {
    console.error('קובץ טקסט גדול מדי:', file.originalname, file.size);
    return cb(new Error('הקובץ חורג מהמגבלה המקסימלית עבור קבצי טקסט (2MB)'));
  } else if (extname.match(/html/) && file.size > maxSize.html) {
    console.error('קובץ HTML גדול מדי:', file.originalname, file.size);
    return cb(new Error('הקובץ חורג מהמגבלה המקסימלית עבור קבצי HTML (2MB)'));
  } else if (extname.match(/zip|rar/) && file.size > maxSize.archive) {
    console.error('קובץ ארכיון גדול מדי:', file.originalname, file.size);
    return cb(new Error('הקובץ חורג מהמגבלה המקסימלית עבור קבצי ארכיון (10MB)'));
  } else if (extname.match(/xls|xlsx/) && file.size > maxSize.spreadsheet) {
    console.error('קובץ גיליון אלקטרוני גדול מדי:', file.originalname, file.size);
    return cb(new Error('הקובץ חורג מהמגבלה המקסימלית עבור קבצי גיליון אלקטרוני (10MB)'));
  }

  cb(null, true);
};

// הגדרת multer
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

// Middleware 3: סניטיזציה של הקלט
const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  try {
    const sanitizeString = (str?: string): string => {
      if (typeof str !== 'string') return '';
      return str.replace(/[\u0000-\u001F\u007F-\uFFFF]/g, '');
    };

    req.body.title = sanitizeString(req.body.title);
    req.body.description = sanitizeString(req.body.description);
    req.body.externalUrl = sanitizeString(req.body.externalUrl);
    req.body.thumbnailUrl = sanitizeString(req.body.thumbnailUrl);
    
    if (req.body.tags && Array.isArray(req.body.tags)) {
      req.body.tags = req.body.tags
        .map((tag: string) => sanitizeString(tag))
        .filter((tag: string) => tag.length > 0);
    } else {
      req.body.tags = [];
    }

    next();
  } catch (err) {
    console.error('שגיאה בסניטיזציה של הקלט:', err);
    return res.status(500).json({ message: 'שגיאה בסניטיזציה של הקלט' });
  }
};

// ייצוא הפונקציות של המידלוואר
export { encodeToBase64, sanitizeInput };

// Middleware 4: Authentication Middleware
interface DecodedToken {
    id: string; 
    email: string;
    name?: string;
    iat: number; 
    exp: number; 
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.error('Access Denied: No Token Provided!');
        return res.status(401).json({ message: 'Access Denied: No Token Provided!' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
        (req as any).user = decoded;
        next();
    } catch (error: any) {
        console.error('JWT Verification Error:', error);
        return res.status(403).json({ message: 'Invalid Token!' });
    }
};

export default authMiddleware;