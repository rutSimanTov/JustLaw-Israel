import React, { useEffect, useState } from "react";
import axios from "axios";

interface TagSelectorProps {
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
}

// --- Design system classes (matching admin panel) ---
const inputClass = "px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/60 transition w-full max-w-xs mb-2";
const buttonClass = "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-semibold text-sm transition bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed shadow";
const tagPill = "inline-block bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-semibold mr-2 mb-2 shadow-sm border border-border";
const tagDeleteBtn = "ml-2 text-xs text-destructive hover:text-destructive-foreground focus:outline-none";

const TagSelector: React.FC<TagSelectorProps> = ({ selectedTags, setSelectedTags }) => {
  const [allTags, setAllTags] = useState<string[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    axios.get("/api/content-auth/tags/public")
      .then((res: any) => setAllTags(res.data.tags.map((t: any) => typeof t === "string" ? t : t.tag)))
      .catch(() => setAllTags([]));
  }, []);

  const handleAddTag = () => {
    const tag = input.trim();
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
      setInput("");
    }
  };

  return (
    <div className="my-4">
      <label className="block font-bold text-foreground mb-1">Tags:</label>
      <div className="flex gap-2 items-center mb-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          list="tags-list"
          placeholder="Add a tag..."
          className={inputClass}
        />
        <datalist id="tags-list">
          {allTags.map(tag => <option key={tag} value={tag} />)}
        </datalist>
        <button type="button" onClick={handleAddTag} className={buttonClass}>
          Add Tag
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {selectedTags.map(tag => (
          <span key={tag} className={tagPill}>
            {tag}
            <button
              type="button"
              onClick={() => setSelectedTags(selectedTags.filter(t => t !== tag))}
              className={tagDeleteBtn}
              aria-label={`Remove tag ${tag}`}
            >✕</button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagSelector;