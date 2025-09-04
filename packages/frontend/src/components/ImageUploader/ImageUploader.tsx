// // frontend/src/components/ImageUploader/ImageUploader.tsx
// import React, { useState } from 'react';
// import { supabase } from '../../services/supabaseClient'; // ודא שזה הנתיב הנכון
// import { Button } from '@mui/material';

// interface Props {
//   userId: string;
//   onUploadComplete?: (path: string) => void;
// }

// const ImageUploader: React.FC<Props> = ({ userId, onUploadComplete }) => {
//   const [uploading, setUploading] = useState(false);
//   const [imageUrl, setImageUrl] = useState<string | null>(null);

//   const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setUploading(true);

//     const fileExt = file.name.split('.').pop();
//     const fileName = `${userId}-${Date.now()}.${fileExt}`;
//     const filePath = `uploads/${fileName}`;

//     const { error } = await supabase.storage
//       .from('your-bucket-name') // שנה לשם הבאקט שלך
//       .upload(filePath, file);

//     setUploading(false);

//     if (error) {
//       alert('שגיאה בהעלאה: ' + error.message);
//     } else {
//       const publicUrl = `https://<your-project-ref>.supabase.co/storage/v1/object/public/your-bucket-name/${filePath}`;
//       setImageUrl(publicUrl);
//       await saveImagePathToDB(userId, filePath);
//       onUploadComplete?.(filePath); // אם רוצים לשמור DB
//     }
//   };

//   const saveImagePathToDB = async (userId: string, path: string) => {
//   try {
//     await fetch(`/api/users/${userId}/image`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ imagePath: path }),
//     });
//   } catch (err) {
//     console.error('שגיאה בשמירה ל-DB', err);
//   }
// };


//   return (
//     <div>
//       <input
//         type="file"
//         accept="image/*"
//         onChange={handleUpload}
//         disabled={uploading}
//       />
//       {uploading && <p>מעלה תמונה...</p>}
//       {imageUrl && <img src={imageUrl} alt="Uploaded" style={{ width: '200px' }} />}
//     </div>
//   );
// };

// export default ImageUploader;



/// profileImageUploader.tsx

// frontend/src/components/ImageUploader/ImageUploader.tsximport React, { useState } from 'react';
// frontend/src/components/ImageUploader/ImageUploader.tsx// src/components/ImageUploader/ImageUploader.tsx



// import React, { useRef, useState } from 'react';
// import { supabase } from '../../services/supabaseClient';
// import { Button, CircularProgress } from '@mui/material';

// interface Props {
//   userId: string;
//   onUploadComplete?: (publicUrl: string) => void;
// }

// export const ImageUploader: React.FC<Props> = ({ userId, onUploadComplete }) => {
//   const [uploading, setUploading] = useState(false);
//   const [imageUrl, setImageUrl] = useState<string | null>(null);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleUpload = async (file: File) => {
//     const filePath = `${userId}/${Date.now()}_${file.name}`;
//     setUploading(true);
//     setErrorMessage(null);

//     const { error: uploadError } = await supabase.storage
//       .from('image-storage')
//       .upload(filePath, file, {
//         cacheControl: '3600',
//         upsert: true,
//       });

//     if (uploadError) {
//       setErrorMessage(uploadError.message);
//       setUploading(false);
//       return;
//     }

//     const { data } = supabase.storage
//       .from('image-storage')
//       .getPublicUrl(filePath);

//     if (!data?.publicUrl) {
//       setErrorMessage('קישור ציבורי לא נוצר');
//       setUploading(false);
//       return;
//     }

//     setImageUrl(data.publicUrl);
//     onUploadComplete?.(data.publicUrl);
//     setUploading(false);
//   };

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) await handleUpload(file);
//   };

//   return (
//     <div>
//       <input
//         type="file"
//         accept="image/*"
//         ref={fileInputRef}
//         onChange={handleFileChange}
//         style={{ display: 'none' }}
//       />

//       <Button
//         variant="contained"
//         onClick={() => fileInputRef.current?.click()}
//         disabled={uploading}
//       >
//         {uploading ? <CircularProgress size={20} /> : 'בחר תמונה'}
//       </Button>

//       {imageUrl && (
//         <div style={{ marginTop: 16 }}>
//           <img src={imageUrl} alt="Uploaded" style={{ maxWidth: 300 }} />
//         </div>
//       )}

//       {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
//     </div>
//   );
// };

// export default ImageUploader;

// frontend/src/components/ImageUploader/ImageUploader.tsx

// frontend/src/components/ImageUploader/ImageUploader.tsx

// frontend/src/components/ImageUploader/ImageUploader.tsx




import React, { useState } from 'react';
import { Button, Typography } from '@mui/material';

interface Props {
  onUploadComplete?: (url: string) => void;
}


const ImageUploader: React.FC<Props> = ({  onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = localStorage.getItem('userId') || '';


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setError(null);

    if (selected) {
      console.log('קובץ נבחר:', selected.name, '-', selected.size, 'bytes');
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selected);
    } else {
      console.log('לא נבחר קובץ');
      setPreviewUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      console.log('אין קובץ להעלאה');
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);

    console.log('מתבצעת העלאה...');

    try {
      const response = await fetch('http://localhost:3001/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      console.log('סטטוס תגובת השרת:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('שגיאה מהשרת:', errorText);
        throw new Error(errorText || 'Upload failed');
      }

      const data = await response.json();
      console.log('תגובה מהשרת:', data);

      if (data.url) {
        console.log('העלאה הצליחה. כתובת התמונה:', data.url);
        onUploadComplete?.(data.url);
      } else {
        throw new Error('No URL returned from server');
      }
    } catch (error: any) {
      console.error('שגיאה ב־try-catch:', error.message);
      setError(error.message || 'Error uploading file');
    } finally {
      setUploading(false);
      console.log('העלאה הסתיימה');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <input type="file" accept="image/*" onChange={handleChange} />
      {previewUrl && (
        <div style={{ margin: '1rem 0' }}>
          <img
            src={previewUrl}
            alt="Preview"
            style={{ maxWidth: '200px', borderRadius: '8px' }}
          />
        </div>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={!file || uploading}
      >
        {uploading ? 'מעלה...' : 'העלה תמונה'}
      </Button>
      {error && (
        <Typography color="error" variant="body2" style={{ marginTop: '0.5rem' }}>
          {error}
        </Typography>
      )}
    </div>
  );
};

export default ImageUploader;
