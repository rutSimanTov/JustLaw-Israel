
import React, { useEffect, useState, useRef } from "react";
import * as draftApi from "../../services/draftApi";
import { Editor } from "@tinymce/tinymce-react";
import type { Editor as TinyMCEEditor } from "tinymce";

// פונקציה שמסירה תגיות HTML
function stripHtml(html: string) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

function Draft() {
  const [draft, setDraft] = useState<draftApi.Draft | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [conflict, setConflict] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [drafts, setDrafts] = useState<draftApi.Draft[]>([]);
  const [showRecycleBin, setShowRecycleBin] = useState(false);
  const [emptyDraftWarning, setEmptyDraftWarning] = useState<string | null>(null);


  // סל מחזור כללי
  const [userVersions, setUserVersions] = useState<any[]>([]);
  const [showUserRecycleBin, setShowUserRecycleBin] = useState(false);

  // הודעות הצלחה
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const editorRef = useRef<TinyMCEEditor | null>(null);
  const PLACEHOLDER_TEXT = '';

  // פונקציה להצגת הודעת הצלחה זמנית
  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 2000);
  };

  useEffect(() => {
    if (!draft) return;
    const interval = setInterval(() => {
      localStorage.setItem(
        "draft-autosave",
        JSON.stringify({
          id: draft.id,
          content,
          updated_at: new Date().toISOString(),
        })
      );
    }, 30000);
    return () => clearInterval(interval);
  }, [draft?.id, content, draft]);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    if (!userId) return;
    draftApi.getDraftsByUser(userId).then(setDrafts).catch(() => setDrafts([]));
  }, [userId, draft?.id]);

  const handleSelectDraft = async (draftId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await draftApi.getDraft(draftId);
      setDraft(data);
      setContent(data.content);
      setConflict(null);
    } catch (e: any) {
      setError(e?.error || e?.message || "Failed to load draft");
      setDraft(null);
      setContent("");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    setError(null);

    if (!userId) {
      setError("Please log in first.");
      setLoading(false);
      return;
    }

    try {
      const newDraft = await draftApi.createDraft("", userId);
      setDraft(newDraft);
      setContent(newDraft.content);
      setConflict(null);
      setShowRecycleBin(false);
      const updatedDrafts = await draftApi.getDraftsByUser(userId);
      setDrafts(updatedDrafts);
    } catch (e: any) {
      setError(e?.error || e?.message || "Failed to create draft");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (override = false) => {
    if (!draft) return;
    setLoading(true);
    setError(null);

    if (!stripHtml(content).trim()) {
      setError("Please write your draft.");
      setEmptyDraftWarning("Write down your draft");
      setLoading(false);
      return;
    } else {
      setEmptyDraftWarning(null);
    }

    if (
      !override &&
      draft.id &&
      draft.content && // יש תוכן קודם
      draft.updated_at !== draft.created_at // לא נוצרה זה עתה
    ) {
      const confirm = window.confirm("Are you sure you want to overwrite the existing content?");
      if (!confirm) {
        setLoading(false);
        return;
      }
      override = true;
    }

    try {
      const result = await draftApi.saveDraftWithConflict(
        draft.id,
        content,
        draft.updated_at || "",
        override,
        userId || ""
      );
      setDraft({ ...draft, content, updated_at: result.lastUpdated });
      setConflict(null);
      if (userId) {
        const updatedDrafts = await draftApi.getDraftsByUser(userId);
        setDrafts(updatedDrafts);
      }
      showSuccess("Saved successfully");
    } catch (e: any) {
      setError(e?.error || e?.message || "Failed to update draft");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!draft) return;
    setLoading(true);
    setError(null);
    try {
      await draftApi.deleteDraft(draft.id);
      setDraft(null);
      setContent("");
      setConflict(null);
      if (userId) {
        const updatedDrafts = await draftApi.getDraftsByUser(userId);
        setDrafts(updatedDrafts);
      }
      showSuccess("Deleted successfully");
    } catch (e: any) {
      setError(e?.error || e?.message || "Failed to delete draft");
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    if (!draft) return;
    setLoading(true);
    setError(null);
    try {
      const h = await draftApi.getDraftHistory(draft.id);
      setHistory(h);
      setShowRecycleBin(true);
    } catch (e: any) {
      setError(e?.error || e?.message || "Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (versionId: number) => {
    if (!draft) return;
    setLoading(true);
    setError(null);
    try {
      await draftApi.restoreDraftFromVersion(draft.id, versionId);
      // אין צורך בפתיחת עורך הטקסט מחדש
      setShowRecycleBin(false);
      showSuccess("Restored successfully");
    } catch (e: any) {
      setError(e?.error || e?.message || "Failed to restore version");
    } finally {
      setLoading(false);
    }
  };

  // סל מחזור כללי - שליפת כל הגרסאות
  const loadUserRecycleBin = async () => {
    setLoading(true);
    setError(null);

    if (!userId) {
      setError("Please log in first.");
      setLoading(false);
      return;
    }
    try {
      const versions = await draftApi.getMyVersions();
      setUserVersions(versions);
      setShowUserRecycleBin(true);
    } catch (e: any) {
      setError(e?.error || e?.message || "Failed to load recycle bin");
    } finally {
      setLoading(false);
    }
  };

  // שחזור גרסה כסוג טיוטה חדשה
  const handleRestoreAsNewDraft = async (versionId: number) => {
    setLoading(true);
    setError(null);
    try {
      await draftApi.restoreVersionAsNewDraft(versionId);
      // אל תסגרי את הסל!
      // עדכני את הרשימה - הסירי את הגרסה ששוחזרה
      setUserVersions((prev) => prev.filter((v) => v.id !== versionId));
      if (userId) {
        const updatedDrafts = await draftApi.getDraftsByUser(userId);
        setDrafts(updatedDrafts);
      }
      showSuccess("Restored successfully");
    } catch (e: any) {
      setError(e?.error || e?.message || "Failed to restore as new draft");
    } finally {
      setLoading(false);
    }
  };
  // עיצוב רשימת סל מחזור כמו רשימת הטיוטות, כולל גלילה אופקית
  const recycleListStyle: React.CSSProperties = {
    maxHeight: "15.5rem",
    overflowY: "auto",
    direction: "rtl",
    scrollbarWidth: "thin",
    scrollbarColor: "#a3a3a3 #f3f3f3"
  };


  // כל הקוד שלך ללא שינוי עד לקטעי הרשימות

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-[1000px] min-h-[700px] p-6 border border-[#f0f0f0] rounded-md bg-transparent">
        {/* הודעת הצלחה מעל העורך */}
        {successMessage && (
          <div className="fixed left-1/2 top-24 z-50 -translate-x-1/2 bg-pink-500 text-white px-6 py-3 rounded shadow-lg text-lg font-bold transition-all animate-fade-in">
            {successMessage}
          </div>
        )}
        {/* הצמדת רשימת הטיוטות והעורך זה לצד זה */}
        <div className="flex flex-row gap-6">
          {/* Sidebar - Drafts list (on the left) */}
          <div className="w-[280px] bg-card rounded-lg shadow-md p-4 flex flex-col relative" style={{ minWidth: 220 }}>
            <div className="flex justify-between items-center mb-3">
              <button
                onClick={handleCreate}
                className="bg-primary text-primary-foreground px-3 py-1 rounded hover:bg-primary/90 text-xs shadow"
              >
                + New Draft
              </button>
            </div>
            <ul
              style={recycleListStyle}
              className="pr-1"
            >
              <style>
                {`
              ul::-webkit-scrollbar {
                width: 8px;
                height: 8px;
                background: #f3f3f3;
              }
              ul::-webkit-scrollbar-thumb {
                background: #a3a3a3;
                border-radius: 8px;
              }
              ul {
                scrollbar-width: thin;
                scrollbar-color: #a3a3a3 #f3f3f3;
              }
              ul {
                direction: rtl;
              }
              ul > li {
                direction: ltr;
              }
              ul::-webkit-scrollbar-track {
                background: #f3f3f3;
              }
              ul::-webkit-scrollbar {
                left: 0;
                right: auto;
              }
              `}
              </style>
              {drafts.length === 0 ? (
                <li className="text-center text-muted-foreground py-8 text-base select-none">You have no drafts</li>
              ) : (
                drafts.map((d) => (
                  <li
                    key={d.id}
                    className={`
                    p-2 rounded cursor-pointer mb-1 transition-colors
                    border border-pink-400
                    ${draft?.id === d.id
                        ? "bg-white font-bold text-pink-500"
                        : "hover:bg-pink-50 hover:text-pink-500"}
                  `}
                    onClick={() => handleSelectDraft(d.id)}
                    style={{
                      borderLeft: draft?.id === d.id ? "4px solid #6366f1" : "4px solid transparent",
                      fontWeight: draft?.id === d.id ? 700 : 400,
                      color: draft?.id === d.id ? "#ec4899" : undefined, // pink-500
                      background: draft?.id === d.id ? "#fff" : undefined,
                      transition: "background 0.2s, color 0.2s",
                    }}
                  >
                    {stripHtml(d.content).slice(0, 30) || "Empty draft"}
                  </li>
                ))
              )}
            </ul>
            {/* סל מחזור כללי - נפתח מתחת לכפתור */}
            <div className="relative">
              <button
                onClick={loadUserRecycleBin}
                className="mt-2 px-0 py-0 rounded-xl shadow flex justify-start items-center"
                title="Recycling bin"
                style={{ background: "none", border: "none" }}
              >
                <span className="flex items-center justify-center rounded-xl bg-pink-500 hover:bg-pink-600 transition w-12 h-12">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24">
                    <path fill="#fff" d="M12 8v5l4.28 2.54-.77 1.28L11 14V8h1zm0-6C6.48 2 2 6.48 2 12h2a8 8 0 1 1 8 8v2c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
                  </svg>
                </span>
              </button>
              {showUserRecycleBin && (
                <div
                  className="absolute left-0 right-0 z-20 mt-2 bg-card rounded-lg shadow-lg border p-3"
                  style={{ top: "100%" }}
                >
                  {userVersions.length === 0 && (
                    <div className="text-muted-foreground text-xs mb-2">No deleted/overwritten drafts</div>
                  )}
                  <div className="flex justify-center my-2">
                    <button
                      onClick={() => setShowUserRecycleBin(false)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-white hover:bg-pink-500 text-gray-700 hover:text-white transition text-base shadow"
                      style={{ border: "none", outline: "none", boxShadow: "0 1px 4px #0001" }}
                      title="Close"
                    >
                      X
                    </button>
                  </div>
                  <ul style={recycleListStyle} className="pr-1">
                    <style>
                      {`
                    ul::-webkit-scrollbar {
                      width: 8px;
                      height: 8px;
                      background: #f3f3f3;
                    }
                    ul::-webkit-scrollbar-thumb {
                      background: #a3a3a3;
                      border-radius: 8px;
                    }
                    ul {
                      scrollbar-width: thin;
                      scrollbar-color: #a3a3a3 #f3f3f3;
                    }
                    ul {
                      direction: rtl;
                    }
                    ul > li {
                      direction: ltr;
                    }
                    ul::-webkit-scrollbar-track {
                      background: #f3f3f3;
                    }
                    ul::-webkit-scrollbar {
                      left: 0;
                      right: auto;
                    }
                    `}
                    </style>
                    {userVersions.map((v) => (
                      <li
                        key={v.id}
                        className="p-2 rounded cursor-pointer mb-1 transition-colors flex items-center hover:bg-muted"
                        style={{
                          borderLeft: "4px solid #6366f1",
                          fontWeight: 700,
                          color: "#6366f1",
                          background: "transparent"
                        }}
                      >
                        <span
                          className="text-xs flex-1 text-left"
                          style={{ whiteSpace: "normal", wordBreak: "break-word", direction: "ltr" }}
                        >
                          {stripHtml(v.content)}
                        </span>
                        <button
                          onClick={() => handleRestoreAsNewDraft(v.id)}
                          className="ml-2 p-1 rounded-full bg-white shadow flex items-center group relative"
                          style={{ border: "none" }}
                          title="Restore"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                            <path fill="#f43f5e" d="M17.65 6.35A7.95 7.95 0 0 0 12 4V1l-4 4 4 4V6c3.31 0 6 2.69 6 6 0 1.61-.63 3.09-1.76 4.24l1.42 1.42A7.938 7.938 0 0 0 20 12c0-2.21-.9-4.21-2.35-5.65zM6.35 17.65A7.95 7.95 0 0 0 12 20v3l4-4-4-4v3c-3.31 0-6-2.69-6-6 0-1.61.63-3.09 1.76-4.24l-1.42-1.42A7.938 7.938 0 0 0 4 12c0 2.21.9 4.21 2.35 5.65z" />
                          </svg>
                          <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 transition-opacity">
                            Restore
                          </span>
                        </button>
                        {/* Delete permanently button */}
                        <button
                          onClick={async () => {
                            if (window.confirm("Are you sure you want delete permanently this draft?")) {
                              try {
                                await draftApi.deleteDraftPermanently(v.id);
                                setUserVersions((prev) => prev.filter((ver) => ver.id !== v.id));
                                showSuccess("Deleted permanently");
                              } catch (e: any) {
                                setError(e?.error || e?.message || "Failed to delete permanently");
                              }
                            }
                          }}
                          className="ml-2 p-1 rounded-full bg-white shadow flex items-center group relative"
                          style={{ border: "none" }}
                          title="Delete"
                        >
                          {/* אייקון מחיקה כמו מתחת לעורך */}
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                            <path fill="#ef4444" d="M7 21q-.825 0-1.413-.588T5 19V7H4V5h5V4h6v1h5v2h-1v12q0 .825-.588 1.413T17 21H7Zm10-14H7v12h10V7ZM9 17h2V9H9v8Zm4 0h2V9h-2v8Z" />
                          </svg>
                          <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 transition-opacity">
                            Delete
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          {/* Main - Edit area */}
          <div className="flex-1 bg-card rounded-lg shadow-md p-6 flex flex-col min-w-0">
            {loading && <div className="text-primary mb-2">Loading...</div>}
            {error && <div className="text-destructive mb-2">{error}</div>}
            {draft ? (
              <>
                <div className="rounded border border-muted bg-background mb-4 shadow-sm">
                  <Editor
                    onInit={(_, editor) => {
                      editorRef.current = editor;
                      editor.on('blur', () => {
                        const plainText = editor.getContent({ format: 'text' }).trim();
                        if (!plainText) {
                          editor.setContent(`<p style="color:gray;">${PLACEHOLDER_TEXT}</p>`);
                        }
                      });
                      if (!content) {
                        editor.setContent(`<p style="color:gray;">${PLACEHOLDER_TEXT}</p>`);
                      } else {
                        editor.setContent(content);
                      }
                    }}
                    apiKey="7ev4soi0997irmucipkmkeekowwgph6dxlo3yrhhoonc2ojr"
                    value={content}
                    onEditorChange={(newContent) => setContent(newContent)}
                    init={{
                      height: 350,
                      placeholder: "Write your draft here",
                      convert_urls: false,
                      menubar: true,
                      plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'help', 'wordcount',
                        'emoticons', 'checklist', 'lineheight'
                      ],
                      toolbar: [
                        'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table |',
                        'align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat | code'
                      ],
                      file_picker_types: 'file image media',
                      content_style:
                        'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; background: #f9fafb; }',
                    }}
                  />
                </div>
                {emptyDraftWarning && (
                  <div className="text-destructive text-center mb-2 font-semibold">
                    {emptyDraftWarning}
                  </div>
                )}
                <div className="flex gap-2 mb-4 mt-2 items-center">
                  <button
                    onClick={draft && draft.id ? () => handleUpdate() : handleCreate}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition flex items-center gap-2 shadow"
                    disabled={!stripHtml(content).trim()}
                  >
                    {draft && draft.id ? (
                      <>
                        <span role="img" aria-label="update"></span> save
                      </>
                    ) : (
                      <>
                        <span role="img" aria-label="save">💾</span> שמור
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-destructive/10 hover:bg-destructive/20 rounded px-2 py-1 transition"
                    title="Delete draft"
                  >
                    <span className="flex items-center justify-center rounded-xl bg-pink-500 hover:bg-pink-600 transition w-12 h-12">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24">
                        <path fill="#fff" d="M7 21q-.825 0-1.413-.588T5 19V7H4V5h5V4h6v1h5v2h-1v12q0 .825-.588 1.413T17 21H7Zm10-14H7v12h10V7ZM9 17h2V9H9v8Zm4 0h2V9h-2v8Z" />
                      </svg>
                    </span>
                  </button>
                  <button
                    onClick={loadHistory}
                    disabled={!draft}
                    className="bg-accent text-accent-foreground px-3 py-2 rounded hover:bg-accent/90 text-xs shadow"
                    style={{ marginRight: 8 }}
                  >
                    Previous versions
                  </button>
                </div>
                {conflict && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 mb-4 rounded shadow">
                    <p className="font-semibold mb-2">
                      Conflict detected! Someone else updated the draft:
                    </p>
                    <pre className="overflow-x-auto text-xs bg-yellow-100 p-2 rounded">
                      {JSON.stringify(conflict, null, 2)}
                    </pre>
                    <button
                      onClick={() => handleUpdate(true)}
                      className="bg-primary text-primary-foreground px-3 py-1 rounded hover:bg-primary/90 transition mt-2 shadow"
                    >
                      Force save and override
                    </button>
                  </div>
                )}
                <div className="text-muted-foreground text-sm mt-2">
                  Last updated: {draft.updated_at}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-muted-foreground mb-4 text-lg"></div>
              </div>
            )}
            {/* Recycle Bin (per draft) */}
            {showRecycleBin && (
              <div className="mt-6 bg-background border rounded p-4 shadow">
                <h4 className="font-bold mb-2 text-primary">Recycle Bin (Version History)</h4>
                {history.length === 0 && <div className="text-muted-foreground">No previous versions</div>}
                <ul style={recycleListStyle} className="pr-1">
                  <style>
                    {`
                  ul::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                    background: #f3f3f3;
                  }
                  ul::-webkit-scrollbar-thumb {
                    background: #a3a3a3;
                    border-radius: 8px;
                  }
                  ul {
                    scrollbar-width: thin;
                    scrollbar-color: #a3a3a3 #f3f3f3;
                  }
                  ul {
                    direction: rtl;
                  }
                  ul > li {
                    direction: ltr;
                  }
                  ul::-webkit-scrollbar-track {
                    background: #f3f3f3;
                  }
                  ul::-webkit-scrollbar {
                    left: 0;
                    right: auto;
                  }
                  `}
                  </style>
                  {history.map((h) => (
                    <li
                      key={h.id}
                      className="p-2 rounded cursor-pointer mb-1 transition-colors flex justify-between items-center hover:bg-muted"
                      style={{
                        borderLeft: "4px solid #6366f1",
                        fontWeight: 700,
                        color: "#6366f1",
                        background: "transparent"
                      }}
                    >
                      <span
                        className="text-xs flex-1 text-left"
                        style={{ direction: "ltr", whiteSpace: "normal", wordBreak: "break-word" }}
                      >
                        {stripHtml(h.content)}
                      </span>
                      <button
                        onClick={() => handleRestore(h.id)}
                        className="ml-2 p-1 rounded-full bg-white shadow flex items-center group relative"
                        style={{ border: "none" }}
                        title="Restore"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                          <path fill="#f43f5e" d="M17.65 6.35A7.95 7.95 0 0 0 12 4V1l-4 4 4 4V6c3.31 0 6 2.69 6 6 0 1.61-.63 3.09-1.76 4.24l1.42 1.42A7.938 7.938 0 0 0 20 12c0-2.21-.9-4.21-2.35-5.65zM6.35 17.65A7.95 7.95 0 0 0 12 20v3l4-4-4-4v3c-3.31 0-6-2.69-6-6 0-1.61.63-3.09 1.76-4.24l-1.42-1.42A7.938 7.938 0 0 0 4 12c0 2.21.9 4.21 2.35 5.65z" />
                        </svg>
                        <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 transition-opacity">
                          Restore
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setShowRecycleBin(false)}
                  className="mt-2 text-xs text-accent underline"
                >
                  Close Recycle Bin
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Draft;