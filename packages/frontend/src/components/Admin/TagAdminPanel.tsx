import React, { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";

// עיצוב tailwind מודרני
const cardClass = "bg-card text-card-foreground rounded-2xl shadow-xl p-8 max-w-2xl mx-auto mt-8 border border-border";
const sectionTitle = "text-xl font-bold text-primary mb-2 mt-8";
const inputClass = "px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/60 transition w-full max-w-xs mb-2";
const buttonClass = "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2 font-semibold text-sm transition bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed shadow";
const buttonDestructive = "bg-destructive text-destructive-foreground hover:bg-destructive/90";
const buttonSecondary = "bg-secondary text-secondary-foreground hover:bg-secondary/80";
const tagPill = "inline-block bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-semibold mr-2 mb-2 shadow-sm border border-border";
const tagDeleteBtn = `${buttonClass} ${buttonDestructive} ml-2 py-1 px-3 text-xs`;
const mergeBtn = `${buttonClass} ${buttonSecondary}`;
const searchBtn = "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2 font-semibold text-sm transition bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-60 disabled:cursor-not-allowed shadow";
const bulkBox = "bg-background border border-border rounded-xl p-4 mt-4 shadow-sm";
const divider = "h-px bg-border my-6";

// interface TagStats {
//   [tag: string]: number;
// }

interface TagData {
  tag: string;
  usage_count: number;
}

const TagAdminPanel: React.FC = () => {
  const [tags, setTags] = useState<TagData[]>([]);
  // const [stats, setStats] = useState<TagStats>({});
  const [mergeFrom, setMergeFrom] = useState("");
  const [mergeTo, setMergeTo] = useState("");
  const [similarTags, setSimilarTags] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [bulkIds, setBulkIds] = useState<string>("");
  const [bulkTag, setBulkTag] = useState("");
  const [bulkAction, setBulkAction] = useState<"add" | "remove">("add");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  // Uncle: separate state for bulk tagging result
  const [bulkMessage, setBulkMessage] = useState("");
  const [showBulkMessage, setShowBulkMessage] = useState(false);
  const [loading, setLoading] = useState(false); // <-- added loading state

  // --- added: new tag state ---
  const [newTag, setNewTag] = useState("");

  const fetchTags = async () => {
    try {
      const res = await apiClient.get("/api/content-auth/tags/all");
      setTags(res.data.tags || []);
      setMessage("Tags loaded successfully");
    } catch (err: any) {
      console.error("Error fetching tags:", err);
      setMessage("Error loading tags");
      setTags([]);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await apiClient.get("/api/content-auth/tags/stats");
      console.log(res)
      // setStats(res.data.stats || {});
    } catch (err: any) {
      console.error("Error fetching stats:", err);
      // setStats({});
    }
  };

  useEffect(() => {
    fetchTags();
    fetchStats();
  }, []);

  const deleteTag = async (tag: string) => {
    if (!window.confirm(`Are you sure you want to delete the tag "${tag}"?`)) return;
    setLoading(true);
    try {
      await apiClient.delete(`/api/content-auth/tags/${tag}`);
      fetchTags();
      fetchStats();
      showTimedMessage("Tag deleted successfully");
    } catch (err: any) {
      showTimedMessage(getTagErrorMessage(err));
    }
    setLoading(false);
  };

  const mergeTags = async () => {
    if (!mergeFrom || !mergeTo) return;
    setLoading(true);
    try {
      await apiClient.put("/api/content-auth/tags/merge", {
        tagToMerge: mergeFrom,
        tagTarget: mergeTo,
      });
      fetchTags();
      fetchStats();
      showTimedMessage("Tags merged successfully");
    } catch (err: any) {
      showTimedMessage(getTagErrorMessage(err));
    }
    setLoading(false);
  };

  const searchSimilar = async () => {
    if (!search) return;
    console.log('Searching for:', search);
    setLoading(true);
    try {
      const res = await apiClient.get("/api/content-auth/tags/similar", {
        params: { query: search },
      });
      console.log('Search response:', res.data);
      const results = res.data.similar || res.data.data || [];
      setSimilarTags(results);
      setMessage(`Found ${results.length} similar tags`);
    } catch (err: any) {
      console.error('Search error:', err);
      setMessage("Error searching similar tags: " + (err.response?.data?.error || err.message));
      setSimilarTags([]);
    }
    setLoading(false);
  };

  const handleBulk = async () => {
    console.log('🚀 handleBulk called');
    const ids = bulkIds.split(",").map((id) => id.trim()).filter(Boolean);
    console.log('📋 IDs:', ids);
    console.log('🏷️ Tag:', bulkTag);
    console.log('⚡ Action:', bulkAction);
    if (!ids.length || !bulkTag) {
      console.log('❌ Validation failed - missing IDs or tag');
      showBulkTimedMessage("Please enter both Content IDs and Tag name");
      return;
    }
    console.log('🔄 Starting bulk tagging...');
    showBulkTimedMessage("🔄 Processing bulk tagging...");
    setLoading(true);
    try {
      console.log('📡 Making API call...');
      const response = await apiClient.post("/api/content-auth/tags/bulk", {
        ids,
        tag: bulkTag,
        action: bulkAction,
      });
      console.log('✅ API Response:', response.data);
      const updatedCount = response.data.updatedCount || 0;
      const actionText = bulkAction === "add" ? "added to" : "removed from";
      let newMessage = "";
      if (updatedCount > 0) {
        newMessage = `✅ Success! Tag "${bulkTag}" ${actionText} ${updatedCount} content item${updatedCount > 1 ? 's' : ''} (IDs: ${ids.join(', ')})`;
      } else {
        newMessage = `ℹ️ No changes made. Tag "${bulkTag}" was already ${bulkAction === "add" ? "present in" : "absent from"} the specified content items, or the content IDs don't exist.`;
      }
      console.log('📝 Setting new bulk message:', newMessage);
      showBulkTimedMessage(newMessage);
      setBulkIds("");        // Clear IDs field
      setBulkTag("");        // Clear tag field
      setBulkAction("add");  // Reset action to default
      fetchTags();           // Refresh tags list
      fetchStats();          // Refresh statistics
    } catch (err: any) {
      console.error('❌ API Error:', err);
      const errorMessage = err.response?.data?.error || err.message || "Unknown error";
      showBulkTimedMessage(`❌ Error executing bulk tagging: ${errorMessage}`);
    }
    console.log('🏁 handleBulk completed');
    setLoading(false);
  };

  // Uncle: gentle message for bulk, disappears after a few seconds
  const showBulkTimedMessage = (msg: string) => {
    setBulkMessage(msg);
    setShowBulkMessage(true);
    setTimeout(() => setShowBulkMessage(false), 3000);
  };

  // --- Add new tag functionality ---
  const getTagErrorMessage = (err: any) => {
    if (err?.response?.status === 400) {
      const msg = err.response?.data?.error || "Unknown error";
      if (msg.includes("already exists")) return "This tag already exists in the system";
      if (msg.includes("length")) return "Tag name must be 1-30 characters long";
      return msg;
    }
    return err?.message || "Unknown error";
  };

  const addTag = async () => {
    if (!newTag.trim()) return;
    setLoading(true);
    try {
      await apiClient.post("/api/content-auth/tags", { tag: newTag.trim() });
      setNewTag("");
      fetchTags();
      fetchStats();
      showTimedMessage("Tag added successfully");
    } catch (err: any) {
      showTimedMessage(getTagErrorMessage(err));
    }
    setLoading(false);
  };

  // Gentle message that disappears automatically
  const showTimedMessage = (msg: string) => {
    setMessage(msg);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  return (
    <div className={cardClass}>
      <h2 className="text-2xl font-bold text-primary mb-6 text-center">Tag Management (Admin)</h2>

      {/* הודעות */}
      {showMessage && message && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-popover text-popover-foreground border border-border rounded-lg px-6 py-3 shadow-lg text-center text-base font-semibold opacity-95 transition-all">
          {message}
        </div>
      )}
      {loading && (
        <div className="sticky top-2 z-40 text-white px-6 py-3 bg-primary rounded-lg mb-4 text-center font-bold shadow-lg">
          🔄 Loading...
        </div>
      )}

      {/* Add New Tag */}
      <section>
        <h3 className={sectionTitle}>Add New Tag</h3>
        <div className="flex gap-2 items-center mb-2">
          <input
            className={inputClass}
            placeholder="New tag name"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            disabled={loading}
          />
          <button 
            className={buttonClass}
            onClick={addTag} 
            disabled={loading || !newTag.trim()}
          >Add</button>
        </div>
      </section>

      <div className={divider} />

      {/* All Tags */}
      <section>
        <h3 className={sectionTitle}>All Tags</h3>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tagData) => (
            <span key={tagData.tag} className={tagPill}>
              {tagData.tag} <span className="opacity-60 ml-1">({tagData.usage_count})</span>
              <button
                className={tagDeleteBtn}
                onClick={() => deleteTag(tagData.tag)}
                disabled={loading}
                title="Delete tag"
              >✕</button>
            </span>
          ))}
        </div>
      </section>

      <div className={divider} />

      {/* Merge Tags */}
      <section>
        <h3 className={sectionTitle}>Merge Tags</h3>
        <div className="flex flex-col md:flex-row gap-2 items-center mb-2">
          <input
            className={inputClass}
            placeholder="Tag to merge from"
            value={mergeFrom}
            onChange={(e) => setMergeFrom(e.target.value)}
            disabled={loading}
          />
          <span className="text-lg font-bold text-muted-foreground">→</span>
          <input
            className={inputClass}
            placeholder="Target tag"
            value={mergeTo}
            onChange={(e) => setMergeTo(e.target.value)}
            disabled={loading}
          />
          <button 
            className={mergeBtn}
            onClick={mergeTags} 
            disabled={loading || !mergeFrom.trim() || !mergeTo.trim()}
          >Merge</button>
        </div>
      </section>

      <div className={divider} />

      {/* Search Similar Tags */}
      <section>
        <h3 className={sectionTitle}>Search Similar Tags</h3>
        <div className="flex gap-2 items-center mb-2">
          <input
            className={inputClass}
            placeholder="Search tag"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={loading}
          />
          <button 
            className={searchBtn}
            onClick={searchSimilar} 
            disabled={loading || !search.trim()}
          >Search</button>
        </div>
        {similarTags && similarTags.length > 0 && (
          <div className="mt-2">
            <h4 className="font-semibold text-muted-foreground mb-1">Found similar tags:</h4>
            <div className="flex flex-wrap gap-2">
              {similarTags.map((tag) => (
                <span key={tag} className={tagPill}>{tag}</span>
              ))}
            </div>
          </div>
        )}
        {similarTags && similarTags.length === 0 && message && message.includes('Found 0') && (
          <div className="text-accent mt-2">No similar tags found for your search.</div>
        )}
      </section>

      <div className={divider} />

      {/* Bulk Tagging */}
      <section>
        <h3 className={sectionTitle}>Bulk Tagging</h3>
        <div className={bulkBox}>
          <div className="flex flex-col md:flex-row gap-2 mb-2">
            <input
              className={inputClass + " w-64"}
              placeholder="Content IDs (comma separated)"
              value={bulkIds}
              onChange={(e) => setBulkIds(e.target.value)}
              disabled={loading}
            />
            <input
              className={inputClass}
              placeholder="Tag"
              value={bulkTag}
              onChange={(e) => setBulkTag(e.target.value)}
              disabled={loading}
            />
            <select
              className={inputClass + " bg-white text-gray-800 font-semibold"}
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value as "add" | "remove")}
              disabled={loading}
            >
              <option value="add" style={{ background: '#fff', color: '#e11d48', fontWeight: 600 }}>Add</option>
              <option value="remove" style={{ background: '#fff', color: '#2563eb', fontWeight: 600 }}>Remove</option>
            </select>
            <button 
              className={buttonClass}
              style={{ minWidth: 90 }}
              onClick={() => {
                console.log('🖱️ Execute button clicked!');
                handleBulk();
              }} 
              disabled={loading || !bulkIds.trim() || !bulkTag.trim()}
            >לבצע</button>
          </div>
          {/* Uncle: gentle message for Bulk Tagging only when needed */}
          {showBulkMessage && bulkMessage && (
            <div className="mt-2 px-4 py-2 rounded-lg text-center font-semibold transition-all shadow border"
              style={{
                background: bulkMessage.includes("✅") ? "#d4edda" : bulkMessage.includes("ℹ️") ? "#d1ecf1" : "#f8d7da",
                color: bulkMessage.includes("✅") ? "#155724" : bulkMessage.includes("ℹ️") ? "#0c5460" : "#721c24",
                borderColor: bulkMessage.includes("✅") ? "#c3e6cb" : bulkMessage.includes("ℹ️") ? "#bee5eb" : "#f5c6cb",
                opacity: showBulkMessage ? 1 : 0
              }}>
              <strong>Bulk Tagging Result:</strong> {bulkMessage}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TagAdminPanel;