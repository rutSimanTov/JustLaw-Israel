import React, { useState } from "react";
import axios from "axios";

const EmailContactForm: React.FC = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      alert("The sending has been completed but the function needs to be updated with the email account.");
    //   await axios.post("http://localhost:3001/api/contact", formData);
    //   alert("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Email error:", JSON.stringify(err, null, 2));

      alert("Something went wrong.");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center pt-28 pb-10 px-4">
    <div className="w-full max-w-lg bg-card rounded-xl shadow-lg p-10 border border-border">
      <h2 className="mb-8 w-full text-center text-3xl font-bold text-primary">Contact Us</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-base font-medium text-foreground" htmlFor="name">Name</label>
          <input name="name" id="name" required placeholder="Enter your name"
            value={formData.name} onChange={handleChange}
            className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-white mt-1" />
        </div>
        <div>
          <label className="text-base font-medium text-foreground" htmlFor="email">Email</label>
          <input name="email" id="email" type="email" required placeholder="Enter your email"
            value={formData.email} onChange={handleChange}
            className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-white mt-1" />
        </div>
        <div>
          <label className="text-base font-medium text-foreground" htmlFor="message">Message</label>
          <textarea name="message" id="message" required placeholder="Type your message here"
            rows={5} value={formData.message} onChange={handleChange}
            className="flex w-full rounded-md border bg-background px-3 py-2 text-white mt-1" />
        </div>
        <button type="submit"
          className="h-10 px-4 py-2 w-full bg-primary text-white hover:bg-primary/90 rounded-md text-sm font-medium">
          Send
        </button>
      </form>
    </div>
    </div>
  );
};

export default EmailContactForm;
