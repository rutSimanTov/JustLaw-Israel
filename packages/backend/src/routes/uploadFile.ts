import { upload, sanitizeInput, encodeToBase64 } from '../middlewares/middlewareUploadFiles';
import { Request, Response, Router } from 'express';
import { databaseService } from '../services/database';
import { ContentItem, ContentMetadata, ContentAnalytics, ContentType, ContentStatus, ContentCategory } from '@base-project/shared';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import { v4 as uuidv4 } from 'uuid';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import authMiddleware from '../middlewares/middlewareUploadFiles'; // ייבוא של המידלוואר לאימות JWT

const router = Router();

// קבועים
const MAX_TITLE_LENGTH = 255; // גבול כותרת
const MAX_DESCRIPTION_LENGTH = 500; // גבול תיאור
const MAX_EXTERNAL_URL_LENGTH = 255; // גבול URL חיצוני
const MAX_TAG_LENGTH = 50; // גבול לתגיות
const MAX_FILE_TYPE_LENGTH = 50; // גבול לסוג קובץ
const MAX_LANGUAGE_LENGTH = 50; // גבול לשפה
const MAX_SOURCE_LENGTH = 255; // גבול למקור

// פונקציה לבדוק אם הקובץ הוא קובץ טקסט
const isTextFile = (mimetype: string): boolean => {
  return mimetype.startsWith('text/') || mimetype === 'application/pdf' || mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || mimetype === 'text/html';
};

// פונקציה לעיבוד תוכן הקובץ
const processFileContent = async (filePath: string, defaultTitle: string): Promise<{ readTime: number; title: string; content: string }> => {
  const fileExtension = filePath.split('.').pop();
  let content = '';
  let title = '';

  try {
    // טיפול בקובצי PDF
    if (fileExtension === 'pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdf(dataBuffer);
      title = pdfData.info?.Title || defaultTitle || filePath.split('/').pop()?.split('.')[0] || 'Untitled';
      content = pdfData.text;
      // טיפול בקובצי DOCX
    } else if (fileExtension === 'docx') {
      const { value, messages } = await mammoth.extractRawText({ path: filePath });
      title = messages.length > 0 ? messages[0].message : defaultTitle || filePath.split('/').pop()?.split('.')[0] || 'Untitled';
      content = value;
      // טיפול בקובצי HTML
    } else if (fileExtension === 'html') {
      content = fs.readFileSync(filePath, 'utf-8');
      title = defaultTitle || 'HTML Document';
      // טיפול בקובצי MP3
    } else if (fileExtension === 'mp3') {
      title = defaultTitle || 'Audio File';
      content = `Audio content cannot be displayed, but is available for play.`;
    } else {
      // טיפול בקובצי טקסט
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const lines = fileContent.split('\n');
      const readTime = Math.floor(fileContent.split(/\s+/).filter(word => word.length > 0).length / 225);
      content = lines.slice(1).join('\n') || fileContent;
      title = lines[0] || defaultTitle || filePath.split('/').pop()?.split('.')[0] || 'Untitled';
    }
  } catch (err) {
    console.error(`שגיאה בעיבוד תוכן הקובץ ${filePath}:`, err);
    content = '';
    title = defaultTitle || 'Untitled';
  }

  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
  const readTime = Math.floor(wordCount / 225);

  return { readTime, title, content };
};

// פונקציה לחתוך מחרוזות
const truncateString = (str: string, maxLength: number) => {
  try {
    return str.length > maxLength ? str.substring(0, maxLength - 3) + '...' : str;
  } catch (err) {
    console.error('שגיאה בחיתוך מחרוזת:', err);
    return str;
  }
};

// נקודת קצה להעלאת קבצים
router.post('/upload', authMiddleware, sanitizeInput, upload.array('files', 5), encodeToBase64, async (req: Request, res: Response) => {
  let files: Express.Multer.File[] = [];
  try {
    files = req.files as Express.Multer.File[];
  } catch (err) {
    console.error('שגיאה בקבלת קבצים מהבקשה:', err);
    return res.status(500).send('שגיאה בקבלת קבצים.');
  }

  if (!files || files.length === 0) {
    console.error('לא הועלו קבצים.');
    return res.status(400).send('No files uploaded.');
  }

  let uploadSuccessful = true;
  const fileNames: string[] = [];
  let userId = '';
  try {
    userId = (req as any).user.id; // הוצאת מזהה המשתמש מהטוקן
  } catch (err) {
    console.error('שגיאה בהוצאת מזהה משתמש מהטוקן:', err);
    return res.status(401).send('שגיאה באימות משתמש.');
  }

  for (const file of files) {
    fileNames.push(file.filename);
    let readTime = 0;
    let title = truncateString(req.body.title || file.originalname.split('.')[0], MAX_TITLE_LENGTH);
    let content = '';
    let videoLength: number | undefined;

    try {
      if (isTextFile(file.mimetype)) {
        const fileReadStats = await processFileContent(file.path, title);
        readTime = fileReadStats.readTime;
        title = truncateString(fileReadStats.title, MAX_TITLE_LENGTH);
        content = fileReadStats.content;
      } else if ((file as any).base64Content) {
        content = (file as any).base64Content;
      } else {
        try {
          content = fs.readFileSync(file.path, 'utf-8');
        } catch (err) {
          console.error(`שגיאה בקריאת קובץ ${file.originalname}:`, err);
          content = '';
        }

        if (file.mimetype.startsWith('video/')) {
          try {
            videoLength = await new Promise((resolve, reject) => {
              ffmpeg.ffprobe(file.path, (err, metadata) => {
                if (err) {
                  console.error('Error getting video metadata:', err);
                  reject(err);
                } else {
                  resolve(metadata.format.duration);
                }
              });
            });
          } catch (err) {
            console.error(`שגיאה בקבלת נתוני וידאו עבור ${file.originalname}:`, err);
            videoLength = undefined;
          }
        }
      }
    } catch (err) {
      console.error(`שגיאה בעיבוד קובץ ${file.originalname}:`, err);
      uploadSuccessful = false;
      continue;
    }

    const CONTENTID_UUID = uuidv4();

    const contentMetadata: ContentMetadata = {
      contentid: CONTENTID_UUID,
      readtime: readTime,
      filesize: file.size,
      filetype: truncateString(file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? 'application/word' : file.mimetype, MAX_FILE_TYPE_LENGTH),
      language: truncateString('english', MAX_LANGUAGE_LENGTH), // ניתן לשנות בהתאם לקלט
      videolength: videoLength,
      webinardate: req.body.webinarDate || undefined,
      source: truncateString(req.body.source || '', MAX_SOURCE_LENGTH),
    };

    const contentItem: ContentItem = {
      id: CONTENTID_UUID,
      title: title,
      description: truncateString(req.body.description || ` ${file.originalname.split('.')[0]}`, MAX_DESCRIPTION_LENGTH),
      content: content,
      categoryid : req.body.categoryid ? parseInt(req.body.categoryid) : 5,
      typeid: req.body.typeid ? parseInt(req.body.typeid) : 3,
      statusid: 1,
      authorid: userId, // הגדרת מזהה המחבר מהטוקן
      createdat: new Date(),
      updatedat: undefined,
      externalurl: truncateString(req.body.externalUrl || '', MAX_EXTERNAL_URL_LENGTH),
      thumbnailurl: truncateString(req.body.thumbnailUrl || '', MAX_EXTERNAL_URL_LENGTH),
      tags: req.body.tags ? (req.body.tags as string[]).map((tag: string) => truncateString(tag, MAX_TAG_LENGTH)) : [],
      metadata: contentMetadata,
      downloadurl: truncateString(req.body.downloadurl || '', MAX_EXTERNAL_URL_LENGTH),
      attachmenturls: req.body.attachmenturls || [],
    };

    let contentId = '';
    try {
      const contentItemResponse = await databaseService.createContentItem(contentItem);
      contentId = contentItemResponse.id;
    } catch (error) {
      console.error(`Failed to create content item for file ${file.originalname}:`, error);
      uploadSuccessful = false;
      continue;
    }

    const contentAnalytics: ContentAnalytics = {
      contentid: CONTENTID_UUID,
      views: 0,
      downloads: 0,
      shares: 0,
      popularityscore: 0,
      createdat: new Date(),
      updatedat: undefined,
    };

    try {
      await databaseService.createContentAnalytics(contentAnalytics);
    } catch (error) {
      console.error(`Failed to create content analytics for file ${file.originalname}:`, error);
      uploadSuccessful = false;
    }

    try {
      await databaseService.createContentMetadata(contentMetadata);
    } catch (error) {
      console.error(`Failed to create content metadata for file ${file.originalname}:`, error);
      uploadSuccessful = false;
    }
  }

  if (uploadSuccessful) {
    res.send(`Files uploaded successfully: ${fileNames.join(', ')}`);
  } else {
    console.error('שגיאה בהעלאת קבצים. חלק מהקבצים לא נשמרו.');
    res.status(500).send('Upload failed.');
  }
});

export default router;