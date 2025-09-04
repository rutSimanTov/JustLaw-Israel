import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ContentItem } from '@base-project/shared';
import { getAllContent } from '../services/contentServise';
import { Button } from '../components/UI/Button/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/UI/tooltip";
import SendEmailButton from '../components/sendEmailButton';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';

const LoadingDots: React.FC = () => {
  return (
    <div className="flex justify-center items-center gap-3 py-10">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="dot"
          style={{ animationDelay: `${i * 0.3}s` }}
        />
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
};

const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<ContentItem | null>(null);
  const [error, setError] = useState('');
  const [showSendEmailButton, setShowSendEmailButton] = useState(false);

  useEffect(() => {
    if (error) {
      console.error('❌ Error sending report:', error);
    }
  }, [error]);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const all = await getAllContent();
        const found = all.find((item) => item.id === id);
        if (found) {
          setArticle(found);
        } else {
          setError('Article not found');
        }
      } catch {
        setError('Error loading article');
      }
    };

    fetchArticle();
  }, [id]);

  if (error) {
    return <div className="text-center text-destructive py-10">{error}</div>;
  }

  if (!article) {
    return <LoadingDots />;
  }

  return (
    <div className="min-h-screen bg-card/80 text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="mb-6 px-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  className="text-white"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 18l-6-6 6-6" />
                </svg>
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              sideOffset={6}
              className="px-3 py-1 rounded bg-white/10 text-white text-sm border border-white/20 backdrop-blur-sm shadow-md"
            >
              Back
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <h1 className="text-3xl font-bold text-primary break-words">{article.title}</h1>

        {article.publishedat && (
          <p className="text-sm text-gray-400 mb-2">
            Published on: {new Date(article.publishedat).toLocaleDateString()}
          </p>
        )}

        {article.authorid && (
          <p className="text-sm text-gray-400 mb-4">
            Author ID: {article.authorid}
          </p>
        )}

        {article.description && (
          <p className="text-base text-gray-200 mb-6 whitespace-pre-wrap">
            {article.description}
          </p>
        )}

        {article.tags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <span className="text-sm text-gray-300">Tags:</span>
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block bg-primary/20 text-primary px-2 py-1 rounded-md text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Report button with tooltip */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setShowSendEmailButton(true)}
                  className="p-2 rounded-md bg-pink-600 hover:bg-pink-700 text-white transition"
                  aria-label="Report"
                >
                  <ReportProblemOutlinedIcon fontSize="small" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                Report inappropriate content
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {article.content && (
          <div
            className="prose prose-invert max-w-none text-gray-100 mb-10 break-words"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        )}

        <div className="bg-background p-4 rounded-md border border-primary/30 mb-6 text-sm break-words whitespace-pre-wrap space-y-2">
          <h3 className="text-lg font-semibold text-primary mb-2">Additional Info</h3>
          <p><strong className="text-white">Category ID:</strong> {article.categoryid}</p>
          <p><strong className="text-white">Language:</strong> {article.metadata?.language}</p>
        </div>

        {article.attachmenturls && article.attachmenturls.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-primary mb-2">Attachments</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              {article.attachmenturls.map((url, index) => (
                <li key={index}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="underline text-blue-300 hover:text-blue-100">
                    Attachment {index + 1}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {article.externalurl && (
          <a
            href={article.externalurl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 underline text-primary hover:text-primary/80 break-all"
          >
            View External Source
          </a>
        )}

        {/* Report modal */}
        {showSendEmailButton && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
            onClick={() => setShowSendEmailButton(false)}
          >
            <div
              style={{
                background: '#222',
                padding: '2rem',
                borderRadius: '12px',
                minWidth: '320px',
                boxShadow: '0 2px 24px rgba(0,0,0,0.3)',
                position: 'relative',
              }}
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setShowSendEmailButton(false)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                }}
                aria-label="Close"
              >
                ×
              </button>
              <SendEmailButton />
            </div>
          </div>
        )}

        {error && (
          <div style={{ color: 'red', marginTop: '1rem', textAlign: 'center' }}>
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlePage;
