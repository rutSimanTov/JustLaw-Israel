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

const categoryOptions = [
  { id: 1, name: "Research Papers" },
  { id: 2, name: "Industry News" },
  { id: 3, name: "Case Studies" },
  { id: 4, name: "Toolkits & Guides" },
  { id: 5, name: "Webinars" },
];

const typeid = 2; // קובץ או קישור

const statusOptions = [
  { id: 1, name: "Draft" },
  { id: 2, name: "Published" },
  { id: 3, name: "Archived" },
];

type FormValues = {
  title: string;
  description: string;
  categoryid: number;
  statusid: number;
  authorid: string;
  externalurl?: string;
  downloadurl?: string;
  attachmenturls?: FileList;
  thumbnailurl?: string;
  tags: string;
};

export const AddLinkOrDocumentPage: React.FC = () => {
  const form = useForm<FormValues>({
    defaultValues: {
      categoryid: 1,
      statusid: 1,
    },
  });

  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("categoryid", String(data.categoryid));
      formData.append("typeid", String(typeid));
      formData.append("statusid", String(data.statusid));
      formData.append("authorid", data.authorid);
      formData.append("tags", data.tags);
      if (data.externalurl) formData.append("externalurl", data.externalurl);
      if (data.downloadurl) formData.append("downloadurl", data.downloadurl);
      if (data.thumbnailurl) formData.append("thumbnailurl", data.thumbnailurl);
      if (data.attachmenturls && data.attachmenturls.length > 0) {
        Array.from(data.attachmenturls).forEach((file) => {
          formData.append("attachmenturls", file);
        });
      }

      const response = await fetch("/api/content/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload content");

      setSubmitSuccess("Link or document added successfully!");
      form.reset();
    } catch (error: any) {
      setSubmitError(error.message || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

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
                typeof field.value === "string" || typeof field.value === "number"
                  ? field.value
                  : ""
              }
              className="w-full p-2 rounded bg-white/10 text-white border border-input focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
              style={{ color: "white" }}
            >
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
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold mb-4">Add Link / Document</h1>
        </div>

        <FormField
          control={form.control}
          name="title"
          rules={{ required: "Title is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  placeholder="Describe the content"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {renderSelect("categoryid", "Category", categoryOptions)}
        {renderSelect("statusid", "Status", statusOptions)}

        <FormField
          control={form.control}
          name="authorid"
          rules={{ required: "Author ID is required" }}
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

        <FormField
          control={form.control}
          name="externalurl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>External URL (optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="downloadurl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Download URL (optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://.../file.pdf" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="attachmenturls"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload Attachments</FormLabel>
              <FormControl>
                <input
                  type="file"
                  multiple
                  onChange={(e) => field.onChange(e.target.files)}
                  className="text-white"
                />
              </FormControl>
            </FormItem>
          )}
        />

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

        {submitError && (
          <p className="text-destructive font-medium">{submitError}</p>
        )}
        {submitSuccess && (
          <p className="text-green-500 font-medium">{submitSuccess}</p>
        )}

        <Button
          type="submit"
          variant="default"
          size="lg"
          disabled={loading}
          className="w-full"
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  );
};
