import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ContentItem } from '@base-project/shared';
import { getAllContent, updateContent } from '../services/contentServise';
import { Button } from '../components/UI/Button/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components/UI/tooltip';

const LoadingDots: React.FC = () => (
  <div className="flex justify-center items-center gap-3 py-10">
    {[0, 1, 2].map((i) => (
      <span key={i} className="dot" style={{ animationDelay: `${i * 0.3}s` }} />
    ))}
    <style>{`
      .dot {
        width: 12px;
        height: 12px;
        background-color: white;
        border-radius: 50%;
        transform: scale(1);
        animation: pulseScale 1.2s infinite ease-in-out;
      }
      @keyframes pulseScale {
        0%, 100% {
          transform: scale(0.8);
          opacity: 0.3;
        }
        50% {
          transform: scale(1.8);
          opacity: 1;
        }
      }
    `}</style>
  </div>
);

const EditArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ContentItem | null>(null);
  const [error, setError] = useState('');
  const [confirmSave, setConfirmSave] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const all = await getAllContent();
        const found = all.find((item) => item.id === id);
        if (found) {
          setFormData({
            ...found,
            tags: Array.isArray(found.tags) ? found.tags : [],
            attachmenturls: Array.isArray(found.attachmenturls) ? found.attachmenturls : [],
            metadata: found.metadata || {},
          });
        } else {
          setError('Article not found');
        }
      } catch {
        setError('Error loading article');
      }
    };

    fetchArticle();
  }, [id]);

  // const handleChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   if (!formData) return;
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // };

  const handleSubmit = async () => {
    if (!formData) return;
    setSaving(true);
    const result = await updateContent(formData.id, formData);
    setSaving(false);
    if (result) {
      navigate(`/article/${formData.id}`);
    } else {
      alert('Update failed');
    }
  };

  if (error) return <div className="text-center text-destructive py-10">{error}</div>;
  if (!formData) return <LoadingDots />;

  return (
    <div className="min-h-screen bg-card/80 text-white px-6 py-10">
      {confirmSave && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-card border border-white/20 rounded-lg p-6 shadow-lg max-w-md w-full text-white space-y-4">
            <h2 className="text-xl font-bold">Save Changes</h2>
            <p>Are you sure you want to save the changes to this article?</p>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setConfirmSave(false)}>Cancel</Button>
              <Button variant="default" onClick={handleSubmit} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 px-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} className="text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 18l-6-6 6-6" />
                </svg>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={6} className="px-3 py-1 rounded bg-white/10 text-white text-sm border border-white/20 backdrop-blur-sm shadow-md">
              Back
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <h1 className="text-3xl font-bold text-primary mb-4">Edit Content</h1>

        {[
          { label: 'Title', name: 'title', placeholder: 'Enter title', type: 'input' },
          { label: 'Description', name: 'description', placeholder: 'Enter description', type: 'textarea' },
          { label: 'Content', name: 'content', placeholder: 'Enter full content', type: 'textarea' },
          { label: 'Author ID', name: 'authorid', placeholder: 'Enter author ID', type: 'input' },
          { label: 'External URL', name: 'externalurl', placeholder: 'Enter external URL', type: 'input' },
          { label: 'Language (metadata)', name: 'metadata.language', placeholder: 'e.g. en / he', type: 'input' },
        ].map((field) => (
          <label key={field.name} className="block font-medium text-white">
            {field.label}:
            {field.type === 'textarea' ? (
              <textarea
                name={field.name}
                value={field.name === 'metadata.language'
                  ? formData.metadata?.language || ''
                  : (formData as any)[field.name] || ''}
                onChange={(e) =>
                  field.name === 'metadata.language'
                    ? setFormData({
                        ...formData,
                        metadata: { ...formData.metadata, language: e.target.value },
                      })
                    : setFormData({ ...formData, [field.name]: e.target.value })
                }
                placeholder={field.placeholder}
                className="w-full p-2 mt-1 rounded bg-white/10 text-white placeholder-white/50"
                rows={field.name === 'content' ? 6 : 3}
              />
            ) : (
              <input
                type="text"
                name={field.name}
                value={field.name === 'metadata.language'
                  ? formData.metadata?.language || ''
                  : (formData as any)[field.name] || ''}
                onChange={(e) =>
                  field.name === 'metadata.language'
                    ? setFormData({
                        ...formData,
                        metadata: { ...formData.metadata, language: e.target.value },
                      })
                    : setFormData({ ...formData, [field.name]: e.target.value })
                }
                placeholder={field.placeholder}
                className="w-full p-2 mt-1 rounded bg-white/10 text-white placeholder-white/50"
              />
            )}
          </label>
        ))}

        <label className="block font-medium text-white">
          Published At:
          <input
            type="date"
            name="publishedat"
            value={formData.publishedat ? new Date(formData.publishedat).toISOString().split('T')[0] : ''}
            onChange={(e) => setFormData({ ...formData, publishedat: new Date(e.target.value) })}
            className="w-full p-2 mt-1 rounded bg-white/10 text-white placeholder-white/50"
          />
        </label>

        <label className="block font-medium text-white">
          Tags (comma-separated):
          <input
            name="tags"
            value={Array.isArray(formData.tags) ? formData.tags.join(', ') : ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
              })
            }
            placeholder="e.g. technology, design, UX"
            className="w-full p-2 mt-1 rounded bg-white/10 text-white placeholder-white/50"
          />
        </label>

        <Button onClick={() => setConfirmSave(true)} className="mt-6">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default EditArticlePage;
