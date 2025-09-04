// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import {
//   Form,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
//   FormField,
// } from "../components/UI/Forms/forms";
// import { Input } from "../components/UI/Input/input";
// import { Button } from "../components/UI/Button/button";

// // אפשרויות דמה לשדות קטגוריה, סוג וסטטוס
// const categoryOptions = [
//   { id: 1, name: "Research Papers" },
//   { id: 2, name: "Industry News" },
//   { id: 3, name: "Case Studies" },
//   { id: 4, name: "Toolkits & Guides" },
//   { id: 5, name: "Webinars" },
// ];

// const typeOptions = [
//   { id: 1, name: "Article" },
//   { id: 2, name: "Link" },
//   { id: 3, name: "Document" },
//   { id: 4, name: "Video" },
//   { id: 5, name: "Webinar" },
// ];

// const statusOptions = [
//   { id: 1, name: "Draft" },
//   { id: 2, name: "Published" },
//   { id: 3, name: "Archived" },
// ];

// type FormValues = {
//   title: string;
//   description: string;
//   content?: string;
//   categoryid: number;
//   typeid: number;
//   statusid: number;
//   authorid: string;
//   publishedat?: string;
//   externalurl?: string;
//   downloadurl?: string;
//   attachmenturls?: string;
//   thumbnailurl?: string;
//   tags: string;
//   language: string;
//   image?: File; // <-- הוסף שדה זה

// };

// export const AddArticlePage: React.FC = () => {
//   const navigate = useNavigate();
//   const form = useForm<FormValues>({
//     defaultValues: {
//       categoryid: 1,
//       typeid: 1,
//       statusid: 1,
//       language: "en",
//     },
//   });

//   const [loading, setLoading] = useState(false);
//   const [submitError, setSubmitError] = useState<string | null>(null);
//   const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

//   const onSubmit = async (data: FormValues) => {
//     setLoading(true);
//     setSubmitError(null);
//     setSubmitSuccess(null);

//     const newArticle = {
//       ...data,
//       tags: data.tags.split(",").map((t) => t.trim()).filter(Boolean),
//       attachmenturls: data.attachmenturls
//         ? data.attachmenturls.split(",").map((a) => a.trim())
//         : [],
//       publishedat: data.publishedat ? new Date(data.publishedat) : undefined,
//       createdat: new Date(),
//     };

//     try {
//       const response = await fetch("/api/content", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newArticle),
//       });
//       if (!response.ok) throw new Error("Failed to create content");

//       await response.json();
//       setSubmitSuccess("Article saved successfully!");
//       form.reset({
//         categoryid: 1,
//         typeid: 1,
//         statusid: 1,
//         language: "en",
//       });
//     } catch (error: any) {
//       setSubmitError(error.message || "Error saving article");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderSelect = (
//     name: keyof FormValues,
//     label: string,
//     options: { id: number; name: string }[]
//   ) => (
//     <FormField
//       control={form.control}
//       name={name}
//       rules={{ required: `${label} is required` }}
//       render={({ field }) => (
//         <FormItem>
//           <FormLabel>{label}</FormLabel>
//           <FormControl>
//             <select
//               {...field}
//                 value={typeof field.value === "number" || typeof field.value === "string" ? field.value : ""}
//               className="w-full p-2 rounded bg-white/10 text-white border border-input
//                          focus:outline-none focus:ring-2 focus:ring-primary
//                          appearance-none"
//               style={{ color: "white" }}
//             >
//               <option value="" disabled style={{ color: "gray" }}>
//                 Select {label}
//               </option>
//               {options.map((option) => (
//                 <option
//                   key={option.id}
//                   value={option.id}
//                   style={{ color: "black", backgroundColor: "white" }}
//                 >
//                   {option.name}
//                 </option>
//               ))}
//             </select>
//           </FormControl>
//           <FormMessage />
//         </FormItem>
//       )}
//     />
//   );

//   return (
//     <Form {...form}>
//       <form
//         onSubmit={form.handleSubmit(onSubmit)}
//         className="max-w-xl mx-auto p-6 bg-card/80 rounded-lg shadow-md space-y-6 text-white mb-20"
//       >
//         <h1 className="text-2xl font-semibold mb-4">Add New Article</h1>

//         {/* Title */}
//         <FormField
//           control={form.control}
//           name="title"
//           rules={{ required: "Title is required" }}
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Title</FormLabel>
//               <FormControl>
//                 <Input placeholder="e.g. Legal Tech Innovations" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Description */}
//         <FormField
//           control={form.control}
//           name="description"
//           rules={{ required: "Description is required" }}
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Description</FormLabel>
//               <FormControl>
//                 <textarea
//                   rows={4}
//                   className="w-full rounded-md bg-white/10 border border-input px-3 py-2 text-white placeholder:text-gray-300 resize-none"
//                   placeholder="Summarize the article content in a few sentences"
//                   {...field}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Content */}
//         <FormField
//           control={form.control}
//           name="content"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Content</FormLabel>
//               <FormControl>
//                 <textarea
//                   rows={6}
//                   className="w-full rounded-md bg-white/10 border border-input px-3 py-2 text-white placeholder:text-gray-300 resize-none"
//                   placeholder="Enter full content"
//                   {...field}
//                 />
//               </FormControl>
//             </FormItem>
//           )}
//         />

//         {/* Category */}
//         {renderSelect("categoryid", "Category", categoryOptions)}

//         {/* Type */}
//         {renderSelect("typeid", "Type", typeOptions)}

//         {/* Status */}
//         {renderSelect("statusid", "Status", statusOptions)}

//         {/* Author ID */}
//         <FormField
//           control={form.control}
//           name="authorid"
//           // rules={{ required: "Author ID is required" }}
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Author ID</FormLabel>
//               <FormControl>
//                 <Input placeholder="Enter author ID" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Published At */}
//         <FormField
//           control={form.control}
//           name="publishedat"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Published At</FormLabel>
//               <FormControl>
//                 <input
//                   type="date"
//                   className="w-full p-2 rounded bg-white/10 text-white border border-input"
//                   {...field}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* External URL */}
//         <FormField
//           control={form.control}
//           name="externalurl"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>External URL</FormLabel>
//               <FormControl>
//                 <Input placeholder="https://example.com" {...field} />
//               </FormControl>
//             </FormItem>
//           )}
//         />

//         {/* Download URL */}
//         <FormField
//           control={form.control}
//           name="downloadurl"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Download URL</FormLabel>
//               <FormControl>
//                 <Input placeholder="https://example.com/file.pdf" {...field} />
//               </FormControl>
//             </FormItem>
//           )}
//         />

//         {/* Attachment URLs (comma separated) */}
//         <FormField
//           control={form.control}
//           name="attachmenturls"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Attachment URLs (comma separated)</FormLabel>
//               <FormControl>
//                 <Input placeholder="https://example.com/file1.pdf, https://example.com/file2.pdf" {...field} />
//               </FormControl>
//             </FormItem>
//           )}
//         />

//         {/* Thumbnail URL */}
//         <FormField
//           control={form.control}
//           name="thumbnailurl"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Thumbnail URL</FormLabel>
//               <FormControl>
//                 <Input placeholder="https://example.com/image.jpg" {...field} />
//               </FormControl>
//             </FormItem>
//           )}
//         />
//         <FormField
//   control={form.control}
//   name="image"
//   render={({ field }) => (
//     <FormItem>
//       <FormLabel>Attach Image</FormLabel>
//       <FormControl>
//         <input
//           type="file"
//           accept="image/png, image/jpeg, image/jpg, image/gif, image/tiff, image/webp, image/bmp"
//           onChange={e => {
//             const file = e.target.files?.[0];
//             // שמור את הקובץ ב-field.value או בסטייט חיצוני (לפי הצורך שלך)
//             field.onChange(file);
//           }}
//         />
//       </FormControl>
//       <FormMessage />
//     </FormItem>
//   )}
// />

//         {/* Tags */}
//         <FormField
//           control={form.control}
//           name="tags"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Tags (comma separated)</FormLabel>
//               <FormControl>
//                 <Input placeholder="AI, Capital Markets, Tech" {...field} />
//               </FormControl>
//             </FormItem>
//           )}
//         />

//         {/* Language */}
//         <FormField
//           control={form.control}
//           name="language"
//           rules={{ required: "Language is required" }}
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Language</FormLabel>
//               <FormControl>
//                 <Input placeholder="en / he" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Error / Success Messages */}
//         {submitError && (
//           <p className="text-destructive font-medium">{submitError}</p>
//         )}
//         {submitSuccess && (
//           <p className="text-green-500 font-medium">{submitSuccess}</p>
//         )}

//         {/* Submit */}
//         <Button
//           type="submit"
//           variant="default"
//           size="lg"
//           disabled={loading}
//           className="w-full"
//         >
//           {loading ? "Saving..." : "Save Article"}
//         </Button>
//       </form>
//     </Form>
//   );
// };

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "../components/UI/Forms/forms";
import { Input } from "../components/UI/Input/input";
import { Button } from "../components/UI/Button/button";
import { uploadContent } from "../services/uploadService"; // ודא שזה הנתיב הנכון
import RichTextEditor from "./KnowledgeHub/RichTextEditor";

const categoryOptions = [
  { id: 1, name: "Research Papers" },
  { id: 2, name: "Industry News" },
  { id: 3, name: "Case Studies" },
  { id: 4, name: "Toolkits & Guides" },
  { id: 5, name: "Webinars" },
];

const typeOptions = [
  { id: 1, name: "Article" },
  { id: 2, name: "Link" },
  { id: 3, name: "Document" },
  { id: 4, name: "Video" },
  { id: 5, name: "Webinar" },
];

const statusOptions = [
  { id: 1, name: "Draft" },
  { id: 2, name: "Published" },
  { id: 3, name: "Archived" },
];

type FormValues = {
  title: string;
  description: string;
  content?: string;
  categoryid: number;
  typeid: number;
  statusid: number;
  authorid: string;
  publishedat?: string;
  externalurl?: string;
  downloadurl?: string;
  attachmenturls?: string;
  thumbnailurl?: string;
  tags: string;
  language: string;
  image?: File; // קובץ תמונה או מסמך
};

export const AddArticlePage: React.FC = () => {
  const form = useForm<FormValues>({
    defaultValues: {
      categoryid: 1,
      typeid: 1,
      statusid: 1,
      language: "en",
    },
  });

  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // שמירה של קובץ שנבחר
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const formData = new FormData();

      // שדות רגילים
      formData.append("title", data.title);
      formData.append("description", data.description);
      if (data.content) formData.append("content", data.content);
      formData.append("categoryid", String(data.categoryid));
      formData.append("typeid", String(data.typeid));
      formData.append("statusid", String(data.statusid));
      formData.append("authorid", data.authorid || "");
      if (data.publishedat) formData.append("publishedat", data.publishedat);
      if (data.externalurl) formData.append("externalUrl", data.externalurl);
      if (data.downloadurl) formData.append("downloadurl", data.downloadurl);
      if (data.attachmenturls) formData.append("attachmenturls", data.attachmenturls);
      if (data.thumbnailurl) formData.append("thumbnailurl", data.thumbnailurl);
      formData.append("language", data.language);

      // tags ו-attachmenturls כטקסט (אם צריך מערך, תשלחי כל אחד בנפרד)
      if (data.tags) formData.append("tags", data.tags);

      // קובץ (תמונה/מסמך) בשם files (כמו שה-backend דורש)
      if (selectedFile) {
        formData.append("files", selectedFile);
      }

      await uploadContent(formData);

      setSubmitSuccess("Article saved and file uploaded successfully!");
      form.reset({
        categoryid: 1,
        typeid: 1,
        statusid: 1,
        language: "en",
      });
      setSelectedFile(null);
    } catch (error: any) {
      setSubmitError(error.message || "Error saving article");
    } finally {
      setLoading(false);
    }
  };

  // עוטף את שדה הקובץ כדי לשמור אותו בסטייט
 const renderFileInput = () => (
  <FormField
    control={form.control}
    name="image"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Attach File</FormLabel>
        <br />
        <FormControl>
          <label
            htmlFor="file-upload"
            className="inline-block px-4 py-2 bg-white/10 border border-input rounded cursor-pointer text-white hover:bg-white/20 transition"
            style={{ fontWeight: 500 }}
          >
            Upload file
            <input
              id="file-upload"
              type="file"
              accept="*"
              style={{ display: "none" }}
              onChange={e => {
                const file = e.target.files?.[0];
                setSelectedFile(file || null);
                field.onChange(file);
              }}
            />
          </label>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

  const renderSelect = (
    name: keyof FormValues,
    label: string,
    options: { id: number; name: string }[]
  ) => (
    <FormField
      control={form.control}
      name={name}
      rules={{ required: `${label} is required` }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <select
              {...field}
              value={
                typeof field.value === "number" || typeof field.value === "string"
                  ? field.value
                  : ""
              }
              className="w-full p-2 rounded bg-white/10 text-white border border-input
                         focus:outline-none focus:ring-2 focus:ring-primary
                         appearance-none"
              style={{ color: "white" }}
            >
              <option value="" disabled style={{ color: "gray" }}>
                Select {label}
              </option>
              {options.map((option) => (
                <option
                  key={option.id}
                  value={option.id}
                  style={{ color: "black", backgroundColor: "white" }}
                >
                  {option.name}
                </option>
              ))}
            </select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-xl mx-auto p-6 bg-card/80 rounded-lg shadow-md space-y-6 text-white mb-20"
      >
        <h1 className="text-2xl font-semibold mb-4">Add New Article</h1>

        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          rules={{ required: "Title is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Legal Tech Innovations" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          rules={{ required: "Description is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <textarea
                  rows={4}
                  className="w-full rounded-md bg-white/10 border border-input px-3 py-2 text-white placeholder:text-gray-300 resize-none"
                  placeholder="Summarize the article content in a few sentences"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Content */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                {/* <textarea
                  rows={6}
                  className="w-full rounded-md bg-white/10 border border-input px-3 py-2 text-white placeholder:text-gray-300 resize-none"
                  placeholder="Enter full content"
                  {...field}
                /> */}
                <RichTextEditor></RichTextEditor>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Category */}
        {renderSelect("categoryid", "Category", categoryOptions)}

        {/* Type */}
        {renderSelect("typeid", "Type", typeOptions)}

        {/* Status */}
        {renderSelect("statusid", "Status", statusOptions)}

        {/* Author ID */}
        <FormField
          control={form.control}
          name="authorid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter author ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Published At */}
        <FormField
          control={form.control}
          name="publishedat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Published At</FormLabel>
              <FormControl>
                <input
                  type="date"
                  className="w-full p-2 rounded bg-white/10 text-white border border-input"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* External URL */}
        <FormField
          control={form.control}
          name="externalurl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>External URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Download URL */}
        <FormField
          control={form.control}
          name="downloadurl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Download URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/file.pdf" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Attachment URLs (comma separated) */}
        <FormField
          control={form.control}
          name="attachmenturls"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Attachment URLs (comma separated)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/file1.pdf, https://example.com/file2.pdf" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Thumbnail URL */}
        <FormField
          control={form.control}
          name="thumbnailurl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thumbnail URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* File Upload */}
        {renderFileInput()}

        {/* Tags */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (comma separated)</FormLabel>
              <FormControl>
                <Input placeholder="AI, Capital Markets, Tech" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Language */}
        <FormField
          control={form.control}
          name="language"
          rules={{ required: "Language is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <FormControl>
                <Input placeholder="en / he" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Error / Success Messages */}
        {submitError && (
          <p className="text-destructive font-medium">{submitError}</p>
        )}
        {submitSuccess && (
          <p className="text-green-500 font-medium">{submitSuccess}</p>
        )}

        {/* Submit */}
        <Button
          type="submit"
          variant="default"
          size="lg"
          disabled={loading}
          className="w-full"
        >
          {loading ? "Saving..." : "Save Article"}
        </Button>
      </form>
    </Form>
  );
};