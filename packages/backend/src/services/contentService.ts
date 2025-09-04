
import { createClient } from '@supabase/supabase-js';
import { ContentItem, ContentCategory, ContentStatus, ContentType, ContentMetadata  } from '@base-project/shared/src/models/Content';
//import {supabase} from './supabaseClient'
import { databaseService } from './database';


const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const TABLE_NAME = 'content';

// מיפוי enums ל־IDs
const categoryMap = {
  research_papers: 1,
  industry_news: 2,
  case_studies: 3,
  toolkits_guides: 4,
  webinars: 5
};

const typeMap = {
  article: 1,
  link: 2,
  document: 3,
  video: 4,
  webinar: 5
};

const statusMap = {
  draft: 1,
  published: 2,
  archived: 3
};

const reverseCategoryMap = Object.fromEntries(Object.entries(categoryMap).map(([k, v]) => [v, k])) as Record<number, ContentCategory>;
const reverseTypeMap = Object.fromEntries(Object.entries(typeMap).map(([k, v]) => [v, k])) as Record<number, ContentType>;
const reverseStatusMap = Object.fromEntries(Object.entries(statusMap).map(([k, v]) => [v, k])) as Record<number, ContentStatus>;

// מיפוי ממבנה DB לאובייקט ContentItem
const mapDbToContentItem = (dbItem: any): ContentItem => ({
  id: dbItem.id,
  title: dbItem.title,
  description: dbItem.description,
  content: dbItem.content,
  categoryid: dbItem.categoryid,
  typeid: dbItem.typeid,
  statusid: dbItem.statusid,
  authorid: dbItem.authorid,
  publishedat: dbItem.publishedat ? new Date(dbItem.publishedat) : undefined,
  externalurl: dbItem.externalurl,
  downloadurl: dbItem.downloadurl,
  attachmenturls: dbItem.attachmenturls,
  thumbnailurl: dbItem.thumbnailurl,
  tags: dbItem.tags,
  metadata: dbItem.metadata,
  createdat: new Date(dbItem.createdat),
  updatedat: dbItem.updatedat ? new Date(dbItem.updatedat) : undefined,
});

// מיפוי מ־ContentItem ל־DB
const mapContentToDb = (content: Omit<ContentItem, 'id' | 'createdat' | 'updatedat'>) => ({
  title: content.title,
  description: content.description,
  content: content.content,
  categoryid: content.categoryid,
  typeid: content.typeid,
  statusid: content.statusid,
  authorid: content.authorid,
  publishedat: content.publishedat || null,
  externalurl: content.externalurl,
  downloadurl: content.downloadurl,
  attachmenturls: content.attachmenturls,
  thumbnailurl: content.thumbnailurl,
  tags: content.tags,
  metadata: content.metadata,
  createdat: new Date(),
  updatedat: new Date(),
});

// 📄 קבלת כל התוכן
export const getAllContent = async (): Promise<ContentItem[]> => {
  const { data, error } = await supabase.from(TABLE_NAME).select('*');
  if (error) throw error;
  return (data || []).map(mapDbToContentItem);
};

// 🔍 לפי מזהה
export const getContentById = async (id: string): Promise<ContentItem | null> => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching content by ID:', error.message);
    return null;
  }

  return mapDbToContentItem(data);
};

// ➕ create content
export const createContent = async (content: ContentItem, metadata?: ContentMetadata): Promise<ContentItem> => {
  console.log('In service, content id:', content.id);
  const createdContent = await databaseService.createContentItem(content);
  if (metadata) {
    console.log('Content in service:', content);
    await databaseService.createContentMetadata({
      ...metadata,
      contentid: createdContent.id,
    });
  }
  return createdContent;
};




// ✏️ עדכון
export const updateContent = async (
  id: string,
  updates: Partial<Omit<ContentItem, 'id' | 'createdat' | 'updatedat'>>
): Promise<ContentItem | null> => {
  const mappedUpdates: any = {
    ...(updates.title && { title: updates.title }),
    ...(updates.description && { description: updates.description }),
    ...(updates.content && { content: updates.content }),
    ...(updates.categoryid && { categoryid: updates.categoryid }),
    ...(updates.typeid && { typeid: updates.typeid }),
    ...(updates.statusid && { statusid: updates.statusid }),
    ...(updates.authorid && { authorid: updates.authorid }),
    ...(updates.publishedat && { publishedat: updates.publishedat }),
    ...(updates.externalurl && { externalurl: updates.externalurl }),
    ...(updates.downloadurl && { downloadurl: updates.downloadurl }),
    ...(updates.attachmenturls && { attachmenturls: updates.attachmenturls }),
    ...(updates.thumbnailurl && { thumbnailurl: updates.thumbnailurl }),
    ...(updates.tags && { tags: updates.tags }),
    ...(updates.metadata && { metadata: updates.metadata }),
    updatedat: new Date(),
  };

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update(mappedUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating content:', error.message);
    return null;
  }

  return mapDbToContentItem(data);
};

// ❌ delete
export const deleteContent = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting content:', error.message);
    return false;
  }

  return true;
};

// קבלת תוכן לפי קטגוריה
export const getByCategoryId = async (categoryId: string): Promise<ContentItem[]> => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('categoryid', categoryId);

  if (error) throw new Error(error.message);

  return (data || []).map(mapDbToContentItem);
};

// קבלת מזהה קטגוריה לפי שם
export const getCategoryIdByName = async (categoryName: string): Promise<string> => {
  const { data, error } = await supabase
    .from('contentcategory')
    .select('id')
    .eq('name', categoryName)
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Category not found');
  return data.id;
};

//get all categories
export const getAllCategories = async (): Promise<ContentCategory[]> => {
  const { data, error } = await supabase
    .from('contentcategory')
    .select('*');

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Failed to fetch categories');
  return data;
};
// // import { supabase } from './database';
// import {supabase} from './supabaseClient'
// import fs from 'fs';
// import path from 'path';

// // נתיב לקובץ התגיות
// const TAGS_PATH = path.join(__dirname, '../../utils/tags.json');

// // טיפוסים
// type Tag = { tag: string; usage_count: number };

// // פונקציות עזר לניהול תגיות
// function readTags(): Tag[] {
//   if (!fs.existsSync(TAGS_PATH)) return [];
//   const raw = fs.readFileSync(TAGS_PATH, 'utf-8');
//   const data = JSON.parse(raw);
//   return data.tags || [];
// }

// function writeTags(tags: Tag[]) {
//   fs.writeFileSync(TAGS_PATH, JSON.stringify({ tags }, null, 2), 'utf-8');
// }

// // עדכון usage_count של תגית בודדת
// function incrementTagUsage(tagName: string) {
//   let tags = readTags();
//   const idx = tags.findIndex(t => t.tag === tagName);
//   if (idx !== -1) {
//     tags[idx].usage_count += 1;
//     writeTags(tags);
//   } else {
//     // אם התגית לא קיימת, צור אותה
//     tags.push({ tag: tagName, usage_count: 1 });
//     writeTags(tags);
//   }
// }

// function decrementTagUsage(tagName: string) {
//   let tags = readTags();
//   const idx = tags.findIndex(t => t.tag === tagName);
//   if (idx !== -1 && tags[idx].usage_count > 0) {
//     tags[idx].usage_count -= 1;
//     writeTags(tags);
//   }
// }

// // עדכון usage_count למספר תגיות (עבור יצירת/עדכון תוכן)
// function updateTagsUsage(newTags: string[], oldTags: string[] = []) {
//   // הסר מונים עבור תגיות ישנות
//   oldTags.forEach(tag => decrementTagUsage(tag));
//   // הוסף מונים עבור תגיות חדשות
//   newTags.forEach(tag => incrementTagUsage(tag));
// }

// export const contentService = {
//   getAll: async () => {
//     const { data } = await supabase.from('content_items').select('*');
//     return data;
//   },
  
//   getById: async (id: string) => {
//     const { data } = await supabase.from('content_items').select('*').eq('id', id).single();
//     return data;
//   },

//   create: async (item: any) => {
//     const { data, error } = await supabase.from('content_items').insert([item]).select().single();
//     if (error) throw error;
    
//     // עדכן usage_count עבור התגיות החדשות
//     if (item.tags && Array.isArray(item.tags)) {
//       updateTagsUsage(item.tags);
//     }
    
//     return data;
//   },

//   update: async (id: string, updates: any) => {
//     // קבל את התוכן הישן כדי לדעת איזה תגיות להסיר
//     const oldContent = await supabase.from('content_items').select('tags').eq('id', id).single();
    
//     const { data, error } = await supabase.from('content_items').update(updates).eq('id', id).select().single();
//     if (error) throw error;
    
//     // עדכן usage_count עבור שינוי בתגיות
//     if (updates.tags && Array.isArray(updates.tags)) {
//       const oldTags = oldContent.data?.tags || [];
//       updateTagsUsage(updates.tags, oldTags);
//     }
    
//     return data;
//   },

//   delete: async (id: string) => {
//     // קבל את התגיות לפני המחיקה כדי לעדכן מונים
//     const content = await supabase.from('content_items').select('tags').eq('id', id).single();
    
//     const { error } = await supabase.from('content_items').delete().eq('id', id);
    
//     if (!error && content.data?.tags) {
//       // הפחת מונים עבור כל התגיות של התוכן שנמחק
//       updateTagsUsage([], content.data.tags);
//     }
    
//     return !error;
//   },

//   // פונקציות נוספות לניהול תגיות
//   incrementTagUsage,
//   decrementTagUsage,
//   updateTagsUsage
// };
