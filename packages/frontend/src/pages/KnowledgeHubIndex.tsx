import React from 'react';
import { Link } from 'react-router-dom';

const KnowledgeHubIndex: React.FC = () => {
  console.log('KnowledgeHubIndex component is rendering');
  
  // בדיקת הרשאה לפי הטוקן או האובייקט user ב-localStorage
  let isAdmin = false;
  try {
    // בדיקה לפי jwtToken
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role === 'admin' || payload.role === 'Admin') {
        isAdmin = true;
      }
    }
    // בדיקה לפי user
    if (!isAdmin) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userObj = JSON.parse(userStr);
        if (userObj.role === 'admin' || userObj.role === 'Admin') {
          isAdmin = true;
        }
      }
    }
  } catch {}

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      backgroundColor: '#fff',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#007cba', marginBottom: '20px' }}>Knowledge Hub</h1>
      <p style={{ fontSize: '18px', marginBottom: '30px' }}>
        Welcome to the Knowledge Hub. Here you can create, edit, and manage content with an advanced tagging system.
      </p>

      {/* כפתור ניהול תגיות קטן ומשתלב - מוצג רק לאדמין */}
      {isAdmin && (
        <div style={{ textAlign: 'right', marginBottom: '18px', marginTop: '8px' }}>
          <Link to="/admin/tags">
            <button
              style={{
                padding: '7px 18px',
                background: '#007cba',
                color: '#fff',
                fontWeight: 500,
                fontSize: '15px',
                borderRadius: '6px',
                border: 'none',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                transition: 'background 0.2s',
                marginRight: '0',
                marginTop: '0',
                marginBottom: '0',
                letterSpacing: '0.5px'
              }}
              onMouseOver={e => (e.currentTarget.style.background = '#005fa3')}
              onMouseOut={e => (e.currentTarget.style.background = '#007cba')}
            >
             Tag management
            </button>
          </Link>
        </div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px', 
        marginTop: '30px' 
      }}>
        {/* ...existing code... */}
        {/* Create Content */}
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '20px', 
          textAlign: 'center',
          backgroundColor: '#f9f9f9'
        }}>
          <h3>Create New Content</h3>
          <p>Create new content with tags, title and description</p>
          <Link 
            to="/knowledge-hub/create" 
            style={{ 
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#007cba',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              marginTop: '10px'
            }}
          >
            Create New Content
          </Link>
        </div>

        {/* Rich Text Editor */}
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '20px', 
          textAlign: 'center',
          backgroundColor: '#f9f9f9'
        }}>
          <h3>Rich Text Editor</h3>
          <p>Advanced editor for writing content with formatting options</p>
          <Link 
            to="/knowledge-hub/editor" 
            style={{ 
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              marginTop: '10px'
            }}
          >
            Open Editor
          </Link>
        </div>
        {/* ...existing code... */}
      </div>

      {/* Additional Information */}
      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#e7f3ff', borderRadius: '8px' }}>
        <h3>Tag System Features:</h3>
        <ul style={{ textAlign: 'left' }}>
          <li>Real-time tag creation and search</li>
          <li>Popular tag suggestions</li>
          <li>Advanced tag management for admins</li>
          <li>Duplicate tag merging</li>
          <li>Usage statistics</li>
          <li>Bulk operations on multiple content items</li>
          <li>Tag validation during content creation</li>
        </ul>
      </div>
    </div>
  );
};

export default KnowledgeHubIndex;