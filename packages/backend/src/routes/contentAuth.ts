import { Router, Response } from 'express';
import { authenticateJWT, authorizeRoles, AuthRequest } from '../middlewares/auth';
import fs from 'fs';
import path from 'path';

const router = Router();

// טיפוס תגית חדש
type Tag = { tag: string; usage_count: number };
type ContentItem = { id: string; title: string; tags: string[] };

// נתיבים לקבצים
const TAGS_PATH = path.join(__dirname, '../../utils/tags.json');
const CONTENT_PATH = path.join(__dirname, '../utils/content.json');

// פונקציות עזר לקריאה וכתיבה של תגיות
function readTags(): Tag[] {
  try {
    if (!fs.existsSync(TAGS_PATH)) {
      console.log('Tags file not found at:', TAGS_PATH);
      return [];
    }
    const raw = fs.readFileSync(TAGS_PATH, 'utf-8');
    const data = JSON.parse(raw);
    console.log('Read tags from file:', data.tags?.length || 0);
    return data.tags || [];
  } catch (error) {
    console.error('Error reading tags:', error);
    return [];
  }
}

function writeTags(tags: Tag[]) {
  try {
    fs.writeFileSync(TAGS_PATH, JSON.stringify({ tags }, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing tags:', error);
    throw error;
  }
}

// פונקציות עזר לקריאה וכתיבה של תכנים
function readContent(): ContentItem[] {
  try {
    if (!fs.existsSync(CONTENT_PATH)) return [];
    const raw = fs.readFileSync(CONTENT_PATH, 'utf-8');
    const data = JSON.parse(raw);
    return data.content || [];
  } catch (error) {
    console.error('Error reading content:', error);
    return [];
  }
}

function writeContent(content: ContentItem[]) {
  try {
    fs.writeFileSync(CONTENT_PATH, JSON.stringify({ content }, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing content:', error);
    throw error;
  }
}

// פונקציות עזר לעדכון usage_count
function incrementTagUsage(tagName: string) {
  let tags = readTags();
  const idx = tags.findIndex(t => t.tag === tagName);
  if (idx !== -1) {
    tags[idx].usage_count += 1;
    writeTags(tags);
  }
}

function decrementTagUsage(tagName: string) {
  let tags = readTags();
  const idx = tags.findIndex(t => t.tag === tagName);
  if (idx !== -1 && tags[idx].usage_count > 0) {
    tags[idx].usage_count -= 1;
    writeTags(tags);
  }
}

// קבלת כל התגיות (Admin בלבד)
router.get('/tags/all', authenticateJWT, authorizeRoles('Admin'), (req, res) => {
  try {
    const tags = readTags();
    console.log('Admin requested all tags:', tags.length);
    res.json({ success: true, tags });
  } catch (error) {
    console.error('Error in /tags/all:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// קבלת כל התגיות עבור משתמשים מחוברים (sorted by popularity)
router.get('/tags/public', authenticateJWT, (req, res) => {
  const tags = readTags();
  // מיון לפי פופולריות (מהכי פופולרי לפחות)
  const sortedTags = [...tags].sort((a, b) => b.usage_count - a.usage_count);
  res.json({ success: true, tags: sortedTags });
});

// חיפוש תגיות דומות (Admin בלבד) - חייב להיות לפני /tags/:tag
router.get('/tags/similar', (req, res) => {
  console.log('SEARCH REQUEST:', req.query.query);
  const query = (req.query.query as string || '').toLowerCase();
  const tags = readTags();
  const similar = tags.filter(tagObj => tagObj.tag.toLowerCase().includes(query));
  const tagNames = similar.map(tagObj => tagObj.tag);
  console.log('FOUND TAGS:', tagNames);
  res.json({ success: true, similar: tagNames });
});

// חיפוש תגיות עבור משתמשים מחוברים
router.get('/tags/search', authenticateJWT, (req, res) => {
  try {
    const query = (req.query.query as string || '').toLowerCase();
    console.log('Search query:', query);
    const tags = readTags();
    const similar = tags.filter(tagObj => tagObj.tag.toLowerCase().includes(query));
    // מיון לפי פופולריות
    const sortedResults = similar.sort((a, b) => b.usage_count - a.usage_count);
    console.log('Search results:', sortedResults.length);
    res.json({ success: true, tags: sortedResults });
  } catch (error) {
    console.error('Error in /tags/search:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// קבלת תגית בודדת (פתוח לכולם)
router.get('/tags/:tag', (req, res) => {
  const tags = readTags();
  const tag = req.params.tag;
  const found = tags.find(t => t.tag === tag);
  if (found) {
    res.json({ success: true, data: [found] });
  } else {
    res.json({ success: true, data: [] });
  }
});

// קבלת תכנים לפי כמה תגיות (AND)
router.get('/tags', (req, res) => {
  const tagsQuery = req.query.tags;
  if (!tagsQuery) return res.status(400).json({ success: false, error: 'tags are required (comma separated)' });

  let tagArr: string[] = [];
  if (typeof tagsQuery === 'string') {
    tagArr = tagsQuery.split(',');
  } else if (Array.isArray(tagsQuery)) {
    tagArr = tagsQuery.map(String);
  }

  const tags = readTags();
  const found = tagArr
    .map((tag: string) => tags.find(t => t.tag === tag))
    .filter(Boolean);
  res.json({ success: true, data: found });
});

// הוספת תגית (Admin בלבד)
router.post('/tags', authenticateJWT, authorizeRoles('Admin'), (req, res) => {
  try {
    const { tag } = req.body;
    console.log('Admin adding tag:', tag);
    if (!tag || typeof tag !== 'string' || tag.length > 50) {
      return res.status(400).json({ success: false, error: 'Tag is required and must be a string up to 50 chars' });
    }
    let tags = readTags();
    if (tags.some(t => t.tag === tag)) {
      return res.status(400).json({ success: false, error: 'Tag already exists' });
    }
    tags.push({ tag, usage_count: 0 });
    writeTags(tags);
    console.log('Tag added successfully:', tag);
    res.json({ success: true, message: 'Tag created', tags });
  } catch (error) {
    console.error('Error in POST /tags:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// הוספת תגית למשתמשים מחוברים
router.post('/tags/create', authenticateJWT, (req, res) => {
  const { tag } = req.body;
  
  // בדיקות validation מחמירות יותר למשתמש רגיל
  if (!tag || typeof tag !== 'string') {
    return res.status(400).json({ success: false, error: 'Tag is required and must be a string' });
  }
  
  const cleanedTag = tag.trim();
  if (cleanedTag.length === 0 || cleanedTag.length > 30) {
    return res.status(400).json({ success: false, error: 'Tag must be 1-30 characters long' });
  }
  
  // בדיקה אם התגית כבר קיימת (case insensitive)
  let tags = readTags();
  const existingTag = tags.find(t => t.tag.toLowerCase() === cleanedTag.toLowerCase());
  if (existingTag) {
    return res.status(400).json({ success: false, error: 'Tag already exists', existingTag: existingTag.tag });
  }
  
  // הוספת התגית החדשה
  tags.push({ tag: cleanedTag, usage_count: 0 });
  writeTags(tags);
  
  res.json({ success: true, message: 'Tag created successfully', tag: cleanedTag });
});

// מחיקת תגית (Admin בלבד)
router.delete('/tags/:tag', authenticateJWT, authorizeRoles('Admin'), (req, res) => {
  const tagToDelete = req.params.tag;
  let tags = readTags();
  tags = tags.filter(t => t.tag !== tagToDelete);
  writeTags(tags);

  // הסר את התגית מכל התכנים
  let content = readContent();
  let changed = false;
  content.forEach(item => {
    if (item.tags.includes(tagToDelete)) {
      item.tags = item.tags.filter(t => t !== tagToDelete);
      changed = true;
    }
  });
  if (changed) writeContent(content);

  res.json({ success: true, message: 'Tag deleted', tags });
});

// מיזוג תגיות (Admin בלבד)
router.put('/tags/merge', authenticateJWT, authorizeRoles('Admin'), (req, res) => {
  try {
    const { tagToMerge, tagTarget } = req.body;
    console.log('Merging tags:', { tagToMerge, tagTarget });
    
    if (!tagToMerge || !tagTarget) {
      return res.status(400).json({ success: false, error: 'Both tagToMerge and tagTarget are required' });
    }
    
    let tags = readTags();
    const mergeIdx = tags.findIndex(t => t.tag === tagToMerge);
    const targetIdx = tags.findIndex(t => t.tag === tagTarget);
    
    if (mergeIdx === -1 || targetIdx === -1) {
      return res.status(400).json({ success: false, error: 'Both tags must exist' });
    }
    
    // העבר את מונה השימוש
    tags[targetIdx].usage_count += tags[mergeIdx].usage_count;
    tags.splice(mergeIdx, 1);
    writeTags(tags);

    // עדכן את כל התכנים: החלף tagToMerge ב-tagTarget
    let content = readContent();
    let changed = false;
    content.forEach(item => {
      if (item.tags.includes(tagToMerge)) {
        item.tags = item.tags.map(t => (t === tagToMerge ? tagTarget : t));
        // הסר כפילויות
        item.tags = [...new Set(item.tags)];
        changed = true;
      }
    });
    if (changed) writeContent(content);

    console.log('Tags merged successfully');
    res.json({ success: true, message: 'Tags merged', tags });
  } catch (error) {
    console.error('Error in PUT /tags/merge:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// סטטיסטיקות שימוש בתגיות (Admin בלבד)
router.get('/tags/stats', authenticateJWT, authorizeRoles('Admin'), (req, res) => {
  const tags = readTags();
  const stats: Record<string, number> = {};
  for (const tagObj of tags) {
    stats[tagObj.tag] = tagObj.usage_count;
  }
  res.json({ success: true, stats });
});

// קבלת 10 התגיות הכי פופולריות (Admin בלבד)
router.get('/tags/popular', authenticateJWT, authorizeRoles('Admin'), (req, res) => {
  const tags = readTags();
  const sorted = [...tags].sort((a, b) => b.usage_count - a.usage_count);
  const popular = sorted.slice(0, 10).map(tagObj => ({ tag: tagObj.tag, count: tagObj.usage_count }));
  res.json({ success: true, popular });
});

// קבלת תגיות לא בשימוש (Admin בלבד)
router.get('/tags/unused', authenticateJWT, authorizeRoles('Admin'), (req, res) => {
  const tags = readTags();
  const unused = tags.filter(tagObj => tagObj.usage_count === 0);
  res.json({ success: true, unused });
});

// קבלת תגיות חדשות (Admin בלבד)
router.get('/tags/new', authenticateJWT, authorizeRoles('Admin'), (req, res) => {
  const tags = readTags();
  res.json({ success: true, newTags: tags });
});

// הוספת תגית לתוכן (עדכון usage_count)
router.post('/content/:id/add-tag', authenticateJWT, (req, res) => {
  const { tag } = req.body;
  const contentId = req.params.id;
  let content = readContent();
  const idx = content.findIndex(item => item.id === contentId);
  if (idx === -1) return res.status(404).json({ success: false, error: 'Content not found' });

  if (!content[idx].tags.includes(tag)) {
    content[idx].tags.push(tag);
    writeContent(content);
    incrementTagUsage(tag);
  }
  res.json({ success: true, content: content[idx] });
});

// הסרת תגית מתוכן (עדכון usage_count)
router.post('/content/:id/remove-tag', authenticateJWT, (req, res) => {
  const { tag } = req.body;
  const contentId = req.params.id;
  let content = readContent();
  const idx = content.findIndex(item => item.id === contentId);
  if (idx === -1) return res.status(404).json({ success: false, error: 'Content not found' });

  if (content[idx].tags.includes(tag)) {
    content[idx].tags = content[idx].tags.filter(t => t !== tag);
    writeContent(content);
    decrementTagUsage(tag);
  }
  res.json({ success: true, content: content[idx] });
});

// סנכרון usage_count של כל התגיות לפי כל התכנים (Admin בלבד)
router.post('/tags/sync-usage', authenticateJWT, authorizeRoles('Admin'), (req, res) => {
  const tags = readTags();
  const content = readContent();
  // אפס את כל המונים
  tags.forEach(tagObj => tagObj.usage_count = 0);
  // עבור כל תוכן, עדכן מונה לכל תגית
  content.forEach(item => {
    item.tags.forEach(tagName => {
      const tagObj = tags.find(t => t.tag === tagName);
      if (tagObj) tagObj.usage_count += 1;
    });
  });
  writeTags(tags);
  res.json({ success: true, tags });
});

// Bulk Tagging - הוספה/הסרה של תגית למספר תכנים בבת אחת (Admin בלבד)
router.post('/tags/bulk', authenticateJWT, authorizeRoles('Admin'), (req, res) => {
  try {
    const { ids, tag, action } = req.body; // ids: string[], tag: string, action: 'add' | 'remove'
    console.log('Bulk tagging:', { ids, tag, action });
    
    if (!Array.isArray(ids) || !tag || !['add', 'remove'].includes(action)) {
      return res.status(400).json({ success: false, error: 'ids (array), tag (string), and action ("add" or "remove") are required' });
    }

    let content = readContent();
    let updatedCount = 0;

    content.forEach(item => {
      if (ids.includes(item.id)) {
        if (action === 'add' && !item.tags.includes(tag)) {
          item.tags.push(tag);
          incrementTagUsage(tag);
          updatedCount++;
        }
        if (action === 'remove' && item.tags.includes(tag)) {
          item.tags = item.tags.filter(t => t !== tag);
          decrementTagUsage(tag);
          updatedCount++;
        }
      }
    });

    writeContent(content);
    console.log('Bulk tagging completed, updated:', updatedCount);
    res.json({ success: true, updatedCount });
  } catch (error) {
    console.error('Error in POST /tags/bulk:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;