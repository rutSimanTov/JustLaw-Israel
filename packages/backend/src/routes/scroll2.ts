
import { Router } from "express"; 

const router = Router();
// מערך של מספרים
//This is where the database will be retrieved.
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
let pointer = 0; // מצב המצביע

router.get('/numbers', (req, res) => { // שים לב שהנתיב הוא רק '/numbers'
  const itemsToReturn = numbers.slice(pointer, pointer + 3); // קבלת 2 איברים מהמצביע
  pointer += 3;

  // אם אין עוד איברים להחזיר, מחזירים מערך ריק
  if (itemsToReturn.length === 0) {
    return res.json([]);
  }

  res.json(itemsToReturn); // החזרת האיברים
});

// נקודת קצה לאיפוס המצביע
router.post('/numbers/reset', (req, res) => {
  pointer = 0;
  res.json({ success: true });
});

export default router;

