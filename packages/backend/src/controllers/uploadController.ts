import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const uploadImageHandler = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const file = req.file;

    if (!userId || !file) {
      return res.status(400).json({ error: 'Missing userId or file' });
    }

    const fileName = `${Date.now()}_${file.originalname}`;
    const filePath = `user-${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('image-storage')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
        
      });
      

    if (uploadError) {
      console.error('❌ Upload error:', uploadError);
      return res.status(500).json({ error: 'Failed to upload image' });
    }

    const { data: publicUrlData } = supabase.storage
      .from('image-storage')
      .getPublicUrl(filePath);
      

    return res.json({ url: publicUrlData.publicUrl });
  } catch (err: any) {
    console.error('❗ Unexpected error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
