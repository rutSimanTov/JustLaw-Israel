import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface TagSelectionModalProps {
  isOpen: boolean;
  onConfirm: (selectedTags: string[]) => void;
  onCancel: () => void;
}

interface Tag {
  tag: string;
  usage_count: number;
}

const TagSelectionModal: React.FC<TagSelectionModalProps> = ({
  isOpen,
  onConfirm,
  onCancel
}) => {
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load all tags
  useEffect(() => {
    if (isOpen) {
      fetchAllTags();
    }
  }, [isOpen]);

  // Search tags
  useEffect(() => {
    if (searchQuery.trim()) {
      searchTags(searchQuery);
    } else {
      setFilteredTags(allTags);
    }
  }, [searchQuery, allTags]);

  const fetchAllTags = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/content-auth/tags/all');
      setAllTags(response.data.tags || []);
      setFilteredTags(response.data.tags || []);
    } catch (err) {
      setError('Failed to load tags');
      console.error('Error fetching tags:', err);
    }
    setLoading(false);
  };

  const searchTags = async (query: string) => {
    try {
      const response = await axios.get('/api/content-auth/tags/similar', {
        params: { query }
      });
      setFilteredTags(response.data.similar || []);
    } catch (err) {
      // If search fails, show all tags
      setFilteredTags(allTags);
    }
  };

  const handleTagToggle = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter(t => t !== tagName));
    } else {
      setSelectedTags([...selectedTags, tagName]);
    }
  };

  const handleAddNewTag = () => {
    const newTag = searchQuery.trim();
    if (newTag && !selectedTags.includes(newTag)) {
      setSelectedTags([...selectedTags, newTag]);
      setSearchQuery('');
    }
  };

  const handleConfirm = () => {
    if (selectedTags.length === 0) {
      setError('Please select at least one tag');
      return;
    }
    onConfirm(selectedTags);
  };

  const handleCancel = () => {
    setSelectedTags([]);
    setSearchQuery('');
    setError('');
    onCancel();
  };

  if (!isOpen) return null;

  // Most popular tags (top 5)
  const popularTags = [...allTags]
    .sort((a, b) => b.usage_count - a.usage_count)
    .slice(0, 5);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <h2 style={{ marginBottom: '16px', textAlign: 'center' }}>
          Select Tags for Your Content
        </h2>
        
        {error && (
          <div style={{
            color: 'red',
            backgroundColor: '#fee',
            padding: '8px 12px',
            borderRadius: '4px',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        {/* Search tags */}
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search for tags or type a new one..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              marginBottom: '8px',
              color: '#333'
            }}
          />
          {searchQuery.trim() && !filteredTags.some(t => t.tag === searchQuery.trim()) && (
            <button
              onClick={handleAddNewTag}
              style={{
                padding: '4px 8px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Add "{searchQuery.trim()}" as new tag
            </button>
          )}
        </div>

        {/* Selected tags */}
        {selectedTags.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h4>Selected Tags ({selectedTags.length}):</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {selectedTags.map(tag => (
                <span
                  key={tag}
                  style={{
                    backgroundColor: '#e9ecef',
                    color: '#333',
                    border: '1px solid #007bff',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {tag}
                  <button
                    onClick={() => handleTagToggle(tag)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#333',
                      cursor: 'pointer',
                      fontSize: '16px'
                    }}
                  >×</button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Popular tags */}
        {!searchQuery && popularTags.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h4>Popular Tags:</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {popularTags.map(tag => (
                <button
                  key={tag.tag}
                  onClick={() => handleTagToggle(tag.tag)}
                  style={{
                    backgroundColor: selectedTags.includes(tag.tag) ? '#e9ecef' : '#f8f9fa',
                    color: selectedTags.includes(tag.tag) ? '#333' : '#333',
                    border: selectedTags.includes(tag.tag) ? '2px solid #28a745' : '1px solid #dee2e6',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  {tag.tag} ({tag.usage_count})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* All tags / Search results */}
        <div style={{ marginBottom: '20px' }}>
          <h4>{searchQuery ? 'Search Results:' : 'All Tags:'}</h4>
          {loading ? (
            <p>Loading tags...</p>
          ) : (
            <div style={{
              maxHeight: '200px',
              overflow: 'auto',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              padding: '8px'
            }}>
              {filteredTags.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666' }}>No tags found</p>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {filteredTags.map(tag => (
                    <button
                      key={tag.tag}
                      onClick={() => handleTagToggle(tag.tag)}
                      style={{
                        backgroundColor: selectedTags.includes(tag.tag) ? '#e9ecef' : '#e9ecef',
                        color: selectedTags.includes(tag.tag) ? '#333' : '#333',
                        border: selectedTags.includes(tag.tag) ? '2px solid #28a745' : '1px solid #ced4da',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      {tag.tag} ({tag.usage_count})
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={handleCancel}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          
          <div style={{ color: '#666', fontSize: '14px' }}>
            {selectedTags.length === 0 ? 'Select at least one tag' : `${selectedTags.length} tags selected`}
          </div>
          
          <button
            onClick={handleConfirm}
            disabled={selectedTags.length === 0}
            style={{
              padding: '10px 20px',
              backgroundColor: selectedTags.length === 0 ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: selectedTags.length === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            Continue to Write ({selectedTags.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default TagSelectionModal;
