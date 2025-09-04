import React, { useState } from 'react';
import axios from 'axios';

const SendEmailButton: React.FC = () => {
  const [category, setCategory] = useState('');
  const [text, setText] = useState('');
  // const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [categoryError, setCategoryError] = useState(false);
  const [textError, setTextError] = useState(false);
  const [sentSuccessfully, setSentSuccessfully] = useState(false);

  const handleSendEmail = async () => {
    // setMessage('');
    setError('');
    setCategoryError(false);
    setTextError(false);

    let hasError = false;

    if (!category) {
      setCategoryError(true);
      hasError = true;
    }

    if (!text.trim()) {
      setTextError(true);
      hasError = true;
    }

    if (hasError) return;

    try {
      const response = await axios.post('http://localhost:3001/api/send-report', {
        category,
        text,
      });
      console.log(response)
      // setMessage(response.data.message);
      setText('');
      setCategory('');
      setSentSuccessfully(true);
      console.log('✅ Report sent:', { category, text });
    } catch (err: any) {
      if (err.response) {
        setError(`Server error: ${err.response.data?.error || err.message}`);
        console.error('❌ Server error:', err.response.data?.error || err.message, err.response);
      } else if (err.request) {
        setError('No response from server.');
        console.error('❌ No response from server:', err.request);
      } else {
        setError(`Error: ${err.message}`);
        console.error('❌ Error:', err.message, err);
      }
    }
  };

  return (
    <div style={{
      maxWidth: 480,
      margin: '40px auto',
      background: 'hsl(211.4, 67.8%, 18%)',
      borderRadius: '1.5rem',
      boxShadow: '0 4px 24px #0002',
      padding: '2.5rem 2rem',
      direction: 'ltr',
      color: 'hsl(210, 40%, 98%)',
      fontFamily: 'Oswald, Arial, sans-serif',
    }}>

      {!sentSuccessfully && (
        <h2 style={{
          color: 'hsl(333, 100%, 60%)',
          fontWeight: 700,
          fontSize: '1.5rem',
          marginBottom: '1.5rem',
          textAlign: 'center',
          letterSpacing: '0.5px'
        }}>
          Report Inappropriate Content
        </h2>
      )}

      {!sentSuccessfully ? (
        <>
          <label style={{ fontWeight: 500, fontSize: '1.1rem' }}>
            Content type:
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setCategoryError(false);
              }}
              style={{
                display: 'block',
                width: '100%',
                padding: '0.75rem',
                margin: '0.5rem 0 0.25rem 0',
                borderRadius: '0.75rem',
                border: '1px solid hsl(333, 100%, 60%)',
                background: 'hsl(211.4, 67.8%, 24%)',
                color: 'hsl(210, 40%, 98%)',
                fontSize: '1rem',
                outline: 'none',
                fontFamily: 'inherit',
                transition: 'border 0.2s',
              }}
            >
              <option value="" disabled>Select content type</option>
              <option value="Offensive">Offensive</option>
              <option value="Racist">Racist</option>
              <option value="Violent">Violent</option>
              <option value="Other">Other</option>
            </select>
            {categoryError && (
              <span style={{ color: '#ff6b81', fontSize: '0.9rem' }}>
                * Content type is required
              </span>
            )}
          </label>

          <label style={{ fontWeight: 500, fontSize: '1.1rem', marginTop: '1rem', display: 'block' }}>
            Report details:
            <textarea
              placeholder="Write your report here..."
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setTextError(false);
              }}
              rows={5}
              style={{
                width: '100%',
                padding: '0.75rem',
                margin: '0.5rem 0 0.25rem 0',
                borderRadius: '0.75rem',
                border: '1px solid hsl(333, 100%, 60%)',
                background: 'hsl(211.4, 67.8%, 24%)',
                color: 'hsl(210, 40%, 98%)',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical',
                outline: 'none',
                transition: 'border 0.2s',
              }}
            />
            {textError && (
              <span style={{ color: '#ff6b81', fontSize: '0.9rem' }}>
                * Report message cannot be empty
              </span>
            )}
          </label>
        </>
      ) : (
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          color: 'hsl(333, 100%, 70%)',
          border: '1.5px solid hsl(333, 100%, 60%)',
          borderRadius: '1rem',
          padding: '1.5rem 1.25rem',
          marginTop: '1.5rem',
          fontSize: '1.2rem',
          fontWeight: 600,
          textAlign: 'center',
          boxShadow: '0 3px 10px rgba(219, 39, 119, 0.3)',
          fontFamily: 'Arial, sans-serif',
        }}>
          Your report was sent successfully.<br />
          We will review it as soon as possible.
        </div>
      )}

      {!sentSuccessfully && (
        <button
          onClick={handleSendEmail}
          title="Send a report about inappropriate content"
          style={{
            width: '100%',
            background: 'hsl(333, 100%, 60%)',
            color: 'hsl(210, 40%, 98%)',
            padding: '0.9rem',
            fontSize: '1.15rem',
            fontWeight: 600,
            border: 'none',
            borderRadius: '0.75rem',
            cursor: 'pointer',
            boxShadow: '0 2px 8px #0001',
            letterSpacing: '0.5px',
            transition: 'background 0.2s',
            marginTop: '1rem',
          }}
        >
          Submit
        </button>
      )}

      {error && (
        <p style={{
          color: '#ff6b81',
          background: '#2e1a1a',
          borderRadius: '0.5rem',
          padding: '0.75rem',
          marginTop: '1.5rem',
          textAlign: 'center',
          fontWeight: 500,
        }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default SendEmailButton;
