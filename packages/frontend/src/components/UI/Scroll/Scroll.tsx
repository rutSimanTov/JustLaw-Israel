
import React, { useState, useEffect, useCallback } from 'react';

const Scroll = () => {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // מאפס את המצביע בשרת ומביא את המספרים הראשונים בכל רענון דף
  useEffect(() => {
    const resetPointerAndFetch = async () => {
      await fetch('http://localhost:3001/api/scroll/numbers/reset', { method: 'POST' });
      setNumbers([]);
      setHasMore(true);
      fetchNumbers();
    };
    resetPointerAndFetch();
    // eslint-disable-next-line
  }, []);

  // פונקציה לטעינת עוד מספרים עם השהיה של שניה
  const fetchNumbers = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      // השהיה של שניה
      await new Promise(resolve => setTimeout(resolve, 500));
      const response = await fetch('http://localhost:3001/api/scroll/numbers');
      const newNumbers = await response.json();
      if (newNumbers.length === 3) {
        setLoading(false);
      }
      if (newNumbers.length === 0) {
        setHasMore(false);

      } else {
        setNumbers(prevNumbers => [...prevNumbers, ...newNumbers]);
      }
    } catch (error) {
      console.log('Error fetching numbers:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore]);

  // מאזין לגלילה
  useEffect(() => {
    const handleScroll = () => {
      if (!hasMore || loading) return;
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
      ) {
        fetchNumbers();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchNumbers, hasMore, loading]);

  return (
    <div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '24px',
        marginTop: '24px'
      }}>
        {numbers.map((number, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',

              padding: '40px',
              margin: '10px',
              backgroundColor: '#f9f9f9',
              // cursor: onClick ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
            }}
          >
            {number}
          </div>
        ))}
      </div>
      {loading && <div style={{ textAlign: 'center', margin: '32px', fontSize: '1.2rem' }}>loading...</div>}
      {!hasMore && <div style={{ textAlign: 'center', margin: '32px', color: '#888' }}>No more articles</div>}
    </div>
  );
};

export default Scroll;
