import { Request, Response } from 'express';
import * as atjService from '../services/atjService';

// יצירת רשומת ATJ (אדם פרטי)
export const createATJ = async (req: Request, res: Response) => {
  try {
    const { name, country } = req.body;
    
    if (!name || !country) {
      return res.status(400).json({ 
        error: 'Name and country are required',
        success: false,
        message: 'Name and country are required fields'
      });
    }

    const result = await atjService.createATJ({ name, country });
    
    res.status(201).json({
      ...result,
      success: true,
      message: 'Registration successful! Thank you for joining the treaty'
    });
  } catch (error: any) {
    console.error('Error creating ATJ:', error);
    res.status(500).json({ 
      error: 'Failed to create ATJ record',
      success: false,
      message: 'Registration error. Please try again later',
      details: error.message 
    });
  }
};

// יצירת רשומת ATJ Organization (ארגון)
export const createATJOrg = async (req: Request, res: Response) => {
  try {
    console.log("📥 Received request body:", req.body); // לוג לבדיקה
    
    const { name, country, representative_name, representative_title } = req.body;
    
    console.log("📝 Extracted fields:", { name, country, representative_name, representative_title }); // לוג לבדיקה
    
    if (!name || !country || !representative_name || !representative_title) {
      console.log("❌ Missing required fields"); // לוג לבדיקה
      return res.status(400).json({ 
        error: 'Organization name, country, representative name and title are required',
        success: false,
        message: 'Organization name, country, representative name and title are required fields'
      });
    }

    const dataToInsert = {
      name,
      country,
      "Representative's_name": representative_name,
      "Representative's_title": representative_title
    };
    
    console.log("🚀 Sending to database:", dataToInsert); // לוג לבדיקה

    const result = await atjService.createATJOrg(dataToInsert);
    
    console.log("✅ Database result:", result); // לוג לבדיקה
    
    res.status(201).json({
      ...result,
      success: true,
      message: 'Organization registration successful! Thank you for joining the treaty'
    });
  } catch (error: any) {
    console.error('❌ Error creating ATJ Organization:', error);
    res.status(500).json({ 
      error: 'Failed to create ATJ Organization record',
      success: false,
      message: 'Organization registration error. Please try again later',
      details: error.message 
    });
  }
};

// קבלת כל רשומות ATJ
export const getAllATJ = async (req: Request, res: Response) => {
  try {
    const result = await atjService.getAllATJ();
    res.json(result);
  } catch (error: any) {
    console.error('Error fetching ATJ records:', error);
    res.status(500).json({ 
      error: 'Failed to fetch ATJ records',
      details: error.message 
    });
  }
};

// קבלת כל רשומות ATJ Organization
export const getAllATJOrg = async (req: Request, res: Response) => {
  try {
    const result = await atjService.getAllATJOrg();
    res.json(result);
  } catch (error: any) {
    console.error('Error fetching ATJ Organization records:', error);
    res.status(500).json({ 
      error: 'Failed to fetch ATJ Organization records',
      details: error.message 
    });
  }
};

// קבלת רשומת ATJ לפי ID
export const getATJById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const result = await atjService.getATJById(id);
    if (!result) {
      return res.status(404).json({ error: 'ATJ record not found' });
    }

    res.json(result);
  } catch (error: any) {
    console.error('Error fetching ATJ record:', error);
    res.status(500).json({ 
      error: 'Failed to fetch ATJ record',
      details: error.message 
    });
  }
};

// קבלת רשומת ATJ Organization לפי ID
export const getATJOrgById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const result = await atjService.getATJOrgById(id);
    if (!result) {
      return res.status(404).json({ error: 'ATJ Organization record not found' });
    }

    res.json(result);
  } catch (error: any) {
    console.error('Error fetching ATJ Organization record:', error);
    res.status(500).json({ 
      error: 'Failed to fetch ATJ Organization record',
      details: error.message 
    });
  }
};

// קבלת כל החתומים מטבלת atj_treaty_signatories
export const getAllSignatories = async (req: Request, res: Response) => {
  try {
    const result = await atjService.getAllSignatories();
    console.log('📊 Signatories found:', result.length);
    res.json(result);
  } catch (error: any) {
    console.error('Error fetching signatories:', error);
    res.status(500).json({ 
      error: 'Failed to fetch signatories',
      details: error.message 
    });
  }
};
