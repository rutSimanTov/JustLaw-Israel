import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import type { Editor as TinyMCEEditor } from 'tinymce';
import { Pencil } from 'lucide-react'; // ודא שהאייקון מיובא אם אתה משתמש בו

// interface BlobInfo {
//   blob(): Blob;
//   filename(): string;
//   base64(): string;
// }
// interface FilePickerMeta {
//   filetype: 'file' | 'image' | 'media';
//   fieldname: string;
// }

const RichTextEditor = () => {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const PLACEHOLDER_TEXT = 'Write your content here...';

  const handleSave = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      console.log('Saved content:', content);
    }
  };

  return (
    <div className="space-y-4">
      {!isEditorOpen && (
        <button
          className="w-full rounded-md bg-white/10 border border-input px-12 py-3 text-white placeholder:text-gray-300 resize-none flex justify-center items-center gap-2"
          style={{ maxWidth: '600px', margin: '0 auto' }}
          onClick={() => setIsEditorOpen(true)}
        >
          <Pencil size={16} />
          Edit Content
        </button>
      )}

      {isEditorOpen && (
        <div className="bg-white border border-gray-300 rounded-xl shadow p-4 w-full max-w-3xl mx-auto">

          <Editor
            onInit={(_, editor) => {
              editorRef.current = editor;

              editor.on('focus', () => {
                const plainText = editor.getContent({ format: 'text' }).trim();
                if (plainText === PLACEHOLDER_TEXT) {
                  editor.setContent('');
                }
              });

              editor.on('blur', () => {
                const plainText = editor.getContent({ format: 'text' }).trim();
                if (!plainText) {
                  editor.setContent(`<p style="color:gray;">${PLACEHOLDER_TEXT}</p>`);
                }
              });

              editor.setContent(`<p style="color:gray;">${PLACEHOLDER_TEXT}</p>`);
            }}
            
            apiKey= {process.env.REACT_APP_TEXT_EDITOR_API_KEY}
          initialValue="<p>Write your content here...</p>"
          init={{
            height: 500,
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
              'align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat | code | fullscreen'
            ],
            file_picker_types: 'file image media',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          }}
          />
          <button onClick={handleSave} style={{ marginTop: '10px' }}>
            Save Content
          </button>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
