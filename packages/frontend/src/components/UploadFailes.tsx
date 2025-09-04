import React, { useRef, useState } from 'react';

const spinnerStyle: React.CSSProperties = {
  border: '4px solid #f3f3f3',
  borderTop: '4px solid #D5006D',
  borderRadius: '50%',
  width: '32px',
  height: '32px',
  animation: 'spin 1s linear infinite'
};

const spinnerKeyframes = `
@keyframes spin {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
}
`;

const containerStyle: React.CSSProperties = {
  maxWidth: 600,
  margin: '40px auto',
  background: '#fff',
  borderRadius: 16,
  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  padding: 32,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

const labelStyle: React.CSSProperties = {
  fontWeight: 500,
  marginBottom: 6,
  color: '#333',
  alignSelf: 'flex-start'
};

const inputStyle: React.CSSProperties = {
  marginBottom: 18,
  width: '100%',
  color: 'black',
  border: '1px solid #e0e0e0',
  borderRadius: 6,
  padding: '8px 12px',
  fontSize: 15,
  background: '#fafafa',
  outline: 'none'
};

const errorStyle: React.CSSProperties = {
  color: 'red',
  fontSize: 12,
  marginTop: -10,
  marginBottom: 10,
  alignSelf: 'flex-start'
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  background: '#fafafa'
};

const buttonStyle: React.CSSProperties = {
  cursor: 'pointer',
  backgroundColor: '#D5006D',
  color: 'white',
  padding: '12px 0',
  borderRadius: '6px',
  border: 'none',
  fontWeight: 600,
  width: '100%',
  margin: '0 0 10px 0',
  fontSize: 16,
  transition: 'background 0.2s'
};

const FileUploadButton = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categoryid, setCategory] = useState<number | ''>('');
  const [typeid, setType] = useState<number | ''>('');
  const [categoryText, setCategoryText] = useState('');
  const [typeText, setTypeText] = useState('');
  const [description, setDescription] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [attachmentUrls, setAttachmentUrls] = useState('');
  const [tags, setTags] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleButtonClick = () => {
    try {
      fileInputRef.current?.click();
    } catch (err) {
      console.error('שגיאה בפתיחת חלון בחירת קובץ:', err);
      setErrors((prev) => ({ ...prev, file: 'שגיאה בפתיחת חלון בחירת קובץ.' }));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (file) {
        setSelectedFile(file);
        setErrors((prev) => ({ ...prev, file: '' }));
      }
    } catch (err) {
      console.error('שגיאה בבחירת קובץ:', err);
      setErrors((prev) => ({ ...prev, file: 'שגיאה בבחירת קובץ.' }));
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      const value = e.target.value === '' ? '' : Number(e.target.value);
      setCategory(value);
      const selectedOption = e.target.selectedOptions[0];
      setCategoryText(selectedOption ? selectedOption.text : '');
      setErrors((prev) => ({ ...prev, category: '' }));
    } catch (err) {
      console.error('שגיאה בבחירת קטגוריה:', err);
      setErrors((prev) => ({ ...prev, category: 'שגיאה בבחירת קטגוריה.' }));
    }
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      const value = e.target.value === '' ? '' : Number(e.target.value);
      setType(value);
      const selectedOption = e.target.selectedOptions[0];
      setTypeText(selectedOption ? selectedOption.text : '');
      setErrors((prev) => ({ ...prev, type: '' }));
    } catch (err) {
      console.error('שגיאה בבחירת סוג:', err);
      setErrors((prev) => ({ ...prev, type: 'שגיאה בבחירת סוג.' }));
    }
  };

  const handleUpload = async () => {
    let hasError = false;
    const newErrors: { [key: string]: string } = {};

    if (!selectedFile) {
      newErrors.file = 'Please select a file.';
      hasError = true;
    }

    if (!categoryid) {
      newErrors.category = 'Please select a category.';
      hasError = true;
    }

    if (!typeid) {
      newErrors.type = 'Please select a type.';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert('You are not logged in. Please log in to upload a file.');
      console.error('שגיאה: אין טוקן JWT ב-localStorage.');
      return;
    }

    const formData = new FormData();
    try {
      formData.append("files", selectedFile as Blob);
      formData.append("categoryid", String(categoryid));
      formData.append("typeid", String(typeid));
      formData.append("categoryText", categoryText);
      formData.append("typeText", typeText);
      formData.append("description", description);
      formData.append("downloadurl", downloadUrl);
      formData.append("attachmenturls", attachmentUrls);
      formData.append("tags", tags);
      formData.append("externalUrl", externalUrl);
    } catch (err) {
      console.error('שגיאה בבניית נתוני הטופס:', err);
      alert('שגיאה בבניית נתוני הטופס.');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/upload/upload', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        console.error('שגיאה בתגובה מהרשת:', response.status, response.statusText);
        throw new Error('Network response was not ok');
      }
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('שגיאה בהעלאת קובץ:', error);
      alert('Error uploading file.');
    } finally {
      setLoading(false);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div style={containerStyle}>
      <style>{spinnerKeyframes}</style>
      <h2 style={{ color: '#D5006D', marginBottom: 24, fontWeight: 700 }}>Upload a File</h2>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <div style={{ width: '100%' }}>
        <label style={labelStyle}>Category</label>
        <select
          value={categoryid}
          onChange={handleCategoryChange}
          style={selectStyle}
        >
          <option value="">Select category</option>
          <option value={1}>Webinars</option>
          <option value={2}>Toolkits & Guides</option>
          <option value={3}>Case Studies</option>
          <option value={4}>Industry News</option>
          <option value={5}>Research Papers</option>
        </select>
        {errors.category && <div style={errorStyle}>{errors.category}</div>}

        <label style={labelStyle}>Type</label>
        <select
          value={typeid}
          onChange={handleTypeChange}
          style={selectStyle}
        >
          <option value="">Select type</option>
          <option value={1}>Article</option>
          <option value={2}>Link</option>
          <option value={3}>Document</option>
          <option value={4}>Video</option>
          <option value={5}>Webinar</option>
        </select>
        {errors.type && <div style={errorStyle}>{errors.type}</div>}

        <label style={labelStyle}>Description</label>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={inputStyle}
        />
        <label style={labelStyle}>Download URL</label>
        <input
          type="text"
          placeholder="Download URL"
          value={downloadUrl}
          onChange={(e) => setDownloadUrl(e.target.value)}
          style={inputStyle}
        />
        <label style={labelStyle}>Attachment URLs (comma separated)</label>
        <input
          type="text"
          placeholder="Attachment URLs"
          value={attachmentUrls}
          onChange={(e) => setAttachmentUrls(e.target.value)}
          style={inputStyle}
        />
        <label style={labelStyle}>Tags (comma separated)</label>
        <input
          type="text"
          placeholder="Tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          style={inputStyle}
        />
        <label style={labelStyle}>External URL</label>
        <input
          type="text"
          placeholder="External URL"
          value={externalUrl}
          onChange={(e) => setExternalUrl(e.target.value)}
          style={inputStyle}
        />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '10px', width: '100%' }}>
          <button
            onClick={handleButtonClick}
            style={buttonStyle}
            disabled={loading}
          >
            {selectedFile ? selectedFile.name : 'Choose File'}
          </button>
          {loading ? (
            <div style={spinnerStyle}></div>
          ) : (
            <button
              onClick={handleUpload}
              style={buttonStyle}
              disabled={loading}
            >
              Upload File
            </button>
          )}
          {errors.file && <div style={errorStyle}>{errors.file}</div>}
        </div>
      </div>
    </div>
  );
};

export default FileUploadButton;