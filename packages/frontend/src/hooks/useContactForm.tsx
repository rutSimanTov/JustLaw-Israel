
import { useState } from "react";
import { supabase } from "../services/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    organization: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
const navigate=useNavigate();


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // try {
  
      
    //   const { error } = await supabase
    //     .from("contact_submissions")
    //     .insert({
    //       first_name: formData.firstName,
    //       last_name: formData.lastName,
    //       email: formData.email,
    //       organization: formData.organization || null,
    //       message: formData.message,
    //     });

    //   if (error) {
    //     toast.error("Failed to send message. Please try again.");
        
    //   } else {
    //     toast.success("Message sent successfully! We'll get back to you soon.");
    //     setFormData({
    //       firstName: "",
    //       lastName: "",
    //       email: "",
    //       organization: "",
    //       message: "",
    //     });
    //   }
    // } catch (error) {
    //   toast.error("An unexpected error occurred. Please try again.");
    // } finally {
    //   setIsSubmitting(false);
    // }
    //לבינתיים עד שהשרת יעבוד
    alert("Message sent successfully! We'll get back to you soon.");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          organization: "",
          message: "",
        });
        setIsSubmitting(false);
  };

  return {
    formData,
    isSubmitting,
    handleInputChange,
    handleSubmit
  };
};
