import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

router.get('/', (req, res) => {
  const filePath = path.join(__dirname, '../../data/FormsFields.json');
  try {
   
    
    const data = fs.readFileSync(filePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('שגיאה בטעינת contributionForms:', error); // לוג שגיאה
    res.status(500).json({ error: 'טעינת טפסים נכשלה' });
  }
});

export default router;