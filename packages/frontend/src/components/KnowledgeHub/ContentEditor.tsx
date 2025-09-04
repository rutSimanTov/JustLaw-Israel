import React, { useRef, useState } from "react";
import RichTextEditor from "./RichTextEditor";
import TagSelector from "./TagSelector";
import axios from "axios";

const ContentEditor: React.FC = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleSave = async () => {
    // Basic validation
    if (!title.trim()) {
      alert("Title is required");
      return;
    }
    if (!description.trim()) {
      alert("Description is required");
      return;
    }
    if (tags.length === 0) {
      alert("At least one tag is required");
      return;
    }

    const content = "Content from editor"; // placeholder until editor processes
    
    // Send to full endpoint that requires all fields
    const contentData = {
      title,
      description,
      content,
      category: "research_papers", // default
      type: "article", // default
      status: "draft",
      authorId: "temp-author-id", // This should be the logged-in user
      tags,
      metadata: {
        language: "en"
      }
    };

    try {
      await axios.post("/api/content", contentData);
      alert("Content saved successfully!");
      // Reset form
      setTitle("");
      setDescription("");
      setTags([]);
    } catch (err: any) {
      console.error("Error:", err.response?.data);
      alert(`Error saving content: ${err.response?.data?.errors?.join(', ') || 'Unknown error'}`);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "20px" }}>
      <h2>Create New Content</h2>
      
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px" }}>
          Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter content title"
          style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px", color: "#333" }}
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px" }}>
          Description *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter content description"
          style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px", minHeight: "80px", color: "#333" }}
        />
      </div>

      <RichTextEditor />
      <TagSelector selectedTags={tags} setSelectedTags={setTags} />
      <button 
        onClick={handleSave} 
        style={{ 
          marginTop: 16, 
          padding: "12px 24px", 
          backgroundColor: "#007cba", 
          color: "white", 
          border: "none", 
          borderRadius: "4px", 
          cursor: "pointer" 
        }}
        disabled={!title || !description || tags.length === 0}
      >
        Save Content
      </button>
    </div>
  );
};

export default ContentEditor;