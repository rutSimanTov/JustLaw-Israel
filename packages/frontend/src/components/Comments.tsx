
import React, { useEffect, useState } from "react";
import { writeComment, updateComment, deleteComment, fetchComments, Comment } from "../services/commentsApi";
// import LikeDislike from "../LikeDislike";
interface ArticleCommentsSectionProps {
  articleId: string;
  userId?: string;
}

const Comments: React.FC<ArticleCommentsSectionProps> = ({ articleId, userId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const [articleTitle, setArticleTitle] = useState<string>("");

  useEffect(() => {
    fetchComments(articleId)
      .then(setComments)
      .catch((err) => setError(err.message));
    // Fetch article title
    fetchArticleTitle(articleId)
      .then(setArticleTitle)
      .catch(() => setArticleTitle(""));
  }, [articleId]);

  const handleUpdateComment = async (e: React.FormEvent, id: number) => {
    e.preventDefault();
    await updateComment(id, userId!, editContent);
    setComments(comments.map(c => c.id === id ? { ...c, content: editContent } : c));
    setEditId(null);
    setEditContent("");
  };

  const handleDeleteComment = async (id: number) => {
    await deleteComment(id, userId!);
    setComments(comments.filter(c => c.id !== id));
  };

  const handleSendComment = async () => {
    if (!userId) {
      setError("Please log in first");
      const confirm = window.confirm("To reply, please log in first. Go to registration page?");
      if (confirm) {
        window.location.href = "/login";
      }
      return;
    }
    if (!isAnonymous && displayName.trim().length < 2) {
      setNameError("Please enter a display name");
      return;
    }
    if (!content.trim()) {
      setNameError("Please enter a comment");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const newComment = await writeComment(content, userId, articleId, isAnonymous, displayName);
      setComments((prev) => [newComment, ...prev]);
      setContent("");
      setDisplayName("");
      setIsAnonymous(false);
      setSuccess("Comment added successfully!");
      setShowNameDialog(false);
      setTimeout(() => setSuccess(null), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-card/80 rounded-xl shadow-md p-4 mt-6 mb-2"
      style={{ maxWidth: 700, margin: "0 auto", direction: "ltr" }}
    >
      {/* Header row with toggle button */}
      <div className="flex items-center gap-2 mb-2">
        <button
          className="flex items-center gap-2 text-primary font-bold text-base px-4 py-2 rounded hover:bg-primary/10 transition group"
          onClick={() => setShowComments((v) => !v)}
          style={{ border: "none", background: "none", cursor: "pointer" }}
        >
          <span className="transition-all group-hover:scale-110">
            {comments.length} Comments for this article   
          </span>
          <span style={{ fontSize: 14, marginRight: 2 }}>
            {showComments ? "▲" : "▼"}
          </span>
        </button>
        {/* <LikeDislike id={`article-${articleId}`} /> */}
      </div>

      {/* Add Comment Dialog - always above everything */}
      {showNameDialog && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 shadow-lg flex flex-col gap-3 w-[380px] relative">
            {/* X button top right */}
            <button
              onClick={() => setShowNameDialog(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-red-500 text-2xl font-bold"
              aria-label="Close comment dialog"
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              ×
            </button>
            <div className="font-bold text-lg mb-2 mt-2">Choose how to display your name in the comment:</div>
            <div className="flex gap-2 mb-2">
              <button
                className={`bg-pink-500 text-white px-3 py-1 rounded ${isAnonymous ? "ring-2 ring-pink-400" : ""}`}
                onClick={() => {
                  setIsAnonymous(true);
                  setDisplayName("Anonymous");
                  setNameError(null);
                }}
              >
                Anonymous
              </button>
              <input
                type="text"
                placeholder="Enter display name"
                className="border rounded px-2 py-1 flex-1"
                value={isAnonymous ? "" : displayName}
                onChange={e => {
                  setIsAnonymous(false);
                  setDisplayName(e.target.value);
                  setNameError(null);
                }}
                disabled={isAnonymous}
                style={{ fontSize: 16, color: "#222", background: "#fff" }}
              />
            </div>
            {/* Comment textarea */}
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Write a comment..."
              className="border rounded px-2 py-2 w-full"
              rows={5}
              style={{
                resize: "vertical",
                fontFamily: "inherit",
                fontSize: 16,
                color: "#222",
                background: "#fff",
                minHeight: 100,
              }}
              disabled={loading}
            />
            {/* Buttons */}
            <div className="flex gap-2 mt-2">
              <button
                className="bg-primary text-white px-4 py-1 rounded"
                onClick={handleSendComment}
                disabled={loading}
              >
                Submit Comment
              </button>
              <button
                className="bg-gray-200 text-gray-700 px-4 py-1 rounded hover:bg-gray-300 transition"
                type="button"
                onClick={() => {
                  setShowNameDialog(false);
                  setDisplayName("");
                  setIsAnonymous(false);
                  setNameError(null);
                  setContent("");
                }}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
            {nameError && <div className="text-red-500 text-sm mt-1">{nameError}</div>}
            {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
            {success && <div className="text-green-600 text-sm mt-1">{success}</div>}
          </div>
        </div>
      )}

      {/* Comments List */}
      {showComments && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-md p-4 relative flex flex-col" style={{ maxWidth: 700, width: "90vw" }}>
            {/* Article title above the comments */}
            <h2 className="text-2xl font-bold text-primary mb-6 text-center">
              {articleTitle}
            </h2>
            {/* כפתור X בצד ימין */}
            <button
              onClick={() => setShowComments(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-red-500 text-2xl font-bold group"
              aria-label="Close comments"
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              ×
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none">
                Close
              </span>
            </button>
            {/* כפתור הוספת תגובה בצד שמאל */}
            <div className="flex justify-start mb-4">
              <button
                className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-2 rounded shadow flex items-center gap-1 transition text-sm"
                onClick={() => {
                  if (!userId) {
                    setShowNameDialog(false);
                    if (window.confirm("You need to register to comment. Go to registration page?")) {
                      window.location.href = "/login";
                    }
                    return;
                  }
                  setShowNameDialog(true);
                }}
                style={{ border: "none" }}
                disabled={false}
                title={userId ? "Add Comment" : "Login required to comment"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <path fill="#fff" d="M12 17q-.425 0-.713-.288T11 16v-3H8q-.425 0-.713-.288T7 12q0-.425.288-.713T8 11h3V8q0-.425.288-.713T12 7q.425 0 .713.288T13 8v3h3q.425 0 .713.288T17 12q0 .425-.288.713T16 13h-3v3q0 .425-.288.713T12 17Z" />
                </svg>
                Add Comment
              </button>
            </div>
            {/* ...רשימת תגובות... */}
            {comments.length === 0 ? (
              <div className="text-muted-foreground text-sm">No comments for this article yet.</div>
            ) : (
              <ul className="space-y-4">
                {comments.map((c) => (
                  <li key={c.id} className="bg-white rounded-lg shadow p-3 flex flex-col" style={{ borderRight: "4px solid #ec4899" }}>
                    <div className="flex items-center gap-2 mb-1 justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary text-sm">{c.display_name}</span>
                        <span className="text-xs text-gray-400">{new Date(c.created_at).toLocaleString()}</span>
                        {c.user_id === userId && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => {
                                setEditId(c.id);
                                setEditContent(c.content);
                              }}
                              className="text-blue-500 text-xs"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteComment(c.id)}
                              className="text-red-500 text-xs"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    {editId === c.id ? (
                      <form onSubmit={e => handleUpdateComment(e, c.id)}>
                        <textarea
                          value={editContent}
                          onChange={e => setEditContent(e.target.value)}
                          className="border rounded p-1 w-full"
                          style={{ color: "#222", background: "#fff" }}
                        />
                        <button type="submit" className="bg-blue-500 text-white px-2 py-1 rounded">Save</button>
                        <button type="button" onClick={() => setEditId(null)} className="bg-gray-200 px-2 py-1 rounded">Cancel</button>
                      </form>
                    ) : (
                      <div className="text-gray-800 text-base mt-2" style={{ whiteSpace: "pre-wrap" }}>{c.content}</div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// דוגמה לפונקציה שמביאה את כותרת המאמר לפי articleId
async function fetchArticleTitle(articleId: string): Promise<string> {
  // החלף לקריאה אמיתית ל-API שלך
  const resp = await fetch(`/api/articles/${articleId}`);
  if (!resp.ok) return "";
  const data = await resp.json();
  return data.title || "";
}

export default Comments;
//for commit
