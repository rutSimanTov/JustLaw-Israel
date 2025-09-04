import { Request, Response } from 'express';
import * as contentService from '../services/contentService';
import { ContentItem } from '@base-project/shared/src/models/Content';
import { v4 as uuidv4 } from 'uuid';

// get all content
export const getAllContent = async (req: Request, res: Response) => {
  try {
    const contents = await contentService.getAllContent();
    res.status(200).json({ success: true, data: contents });
  } catch (error) {
    console.error('Error in getAllContent:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// קבלת מזהה קטגוריה לפי שם (שימוש פנימי בלבד)


// export const getCategoryIdByName = async (categoryName: string) => { const { data, error } = await contentService.supabase
//         .from('contentcategory')
//         .select('id')
//         .eq('name', categoryName)
//         .single();

//     if (error) {
//         throw new Error(error.message);
//     }

//     if (!data) {
//         throw new Error('Category not found');
//     }

//     return data.id; }
//     // קבלת תוכן לפי קטגוריה (שימוש פנימי בלבד)

// export const getByCategoryId = async (categoryId: string) => {  const { data, error } = await contentService.supabase
//         .from('content')
//         .select('*')
//         .eq('categoryid', categoryId);

//     if (error) {
//         throw new Error(error.message);
//     }

//     return data; }
// קבלת תוכן לפי שם קטגוריה (endpoint ל-API)
export const getByCategoryName = async (req: Request, res: Response) => {
  let categoryNames: string[] = [];
  if (Array.isArray(req.body.categoryNames)) {
    categoryNames = req.body.categoryNames;
  } else if (typeof req.body.categoryNames === 'string') {
    categoryNames = [req.body.categoryNames];
  } else {
    return res.status(400).json({ error: 'יש לספק categoryNames (מערך או מחרוזת)' });
  }
  try {
    const categories = await Promise.all(
      categoryNames.map((name) => contentService.getCategoryIdByName(name))
    );
    const itemsArr = await Promise.all(
      categories.map((catId) => contentService.getByCategoryId(catId))
    );
    const allItems = itemsArr.flat();
    res.json(allItems);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
};



// קבלת תוכן לפי מזהה
export const getContentById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const content = await contentService.getContentById(id);

    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    return res.status(200).json({ success: true, data: content });
  } catch (error) {
    console.error('Error in getContentById:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


// // יצירת תוכן חדש (למנהל)
// export const createContent = async (req: Request, res: Response) => {
//   try {
//     const created = await contentService.createContent(req.body);
//     return res.status(201).json({ success: true, data: created });
//   } catch (error) {
//     console.error('Error in createContent:', error);
//     return res.status(500).json({ success: false, message: 'Failed to create content' });
//   }
// };
// יצירת תוכן חדש (למנהל)
// export const createContent = async (req: Request, res: Response) => {
//   try {
//     const { metadata, ...content } = req.body;

//     const created = await contentService.createContent(content, metadata);

//     res.status(201).json(created);
//   } catch (error) {
//     console.error('Error creating content:', error);
//     res.status(500).json({ error: 'Failed to create content' });
//   }
// };

// add new content
export const createContent = async (req: Request, res: Response) => {
  try {
    const id = uuidv4();
    const { title, description, authorid, metadata, ...rest } = req.body;

    const newContent: ContentItem = {
      id,
      title,
      description,
      authorid,
      ...rest,
    };
    const created = await contentService.createContent(newContent, metadata);

    res.status(201).json(created);
  } catch (error) {
    console.error('Error creating content:', error);
    res.status(500).json({ error: 'Failed to create content', details: error });
  }
};


// עדכון תוכן (למנהל)
export const updateContent = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const updated = await contentService.updateContent(id, req.body);

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error('Error in updateContent:', error);
    return res.status(500).json({ success: false, message: 'Failed to update content' });
  }
};

// delete content
export const deleteContent = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deleted = await contentService.deleteContent(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error in deleteContent:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete content' });
  }
};


// fetch all categories
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await contentService.getAllCategories();

    if (!categories) {
      return res.status(404).json({ success: false, message: 'Categories not found' });
    }

    return res.status(200).json({ success: true,data:categories });
  } catch (error) {
    console.error('Error in getAllCategories:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
};