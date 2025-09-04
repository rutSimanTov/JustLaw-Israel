// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
// } from "./UI/Forms/forms";
// import { Input } from "./UI/Input/input";
// import { Textarea } from "./UI/textarea";
// import { Button } from "./UI/Button/button";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";
// import { supabase } from "../integrations/supabase/client";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import axios from "axios";

// type Field = {
//   name: string;
//   label: string;
//   type: string;
//   placeholder?: string;
//   validation?: any;
// };

// type Props = {
//   fields: Field[];
//   formType: string;
// };

// const DynamicForm: React.FC<Props> = ({ fields, formType }) => {
//   const defaultValues = Object.fromEntries(fields.map(f => [f.name, ""]));
//   const form = useForm({ defaultValues });
//   const navigate = useNavigate();
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const sendEmailNotification = async (
//     data: Record<string, any>,
//     formType: string
//   ) => {
//     const fullName =
//       data.name ||
//       [data.firstName, data.lastName].filter(Boolean).join("  ") ||
//       "NoName";

//     const subject = `Contact from ${formType} ${fullName}`;

//     try {
//       await axios.post("http://localhost:3001/api/contact", {
//         name: subject,
//         email: data.email || "no-reply@example.com",
//         message: JSON.stringify(data, null, 2),
//       });
//     } catch (error) {
//       console.error("❌ Failed to send email:", error);
//     }
//   };

//   // Submit functions (shortened here, no changes except reset)
//   const handleContactSubmit = async (data: Record<string, any>) => {
//     const { error } = await supabase.from("contact_submissions").insert({
//       first_name: data.firstName,
//       last_name: data.lastName,
//       email: data.email,
//       organization: data.organization || null,
//       message: data.message,
//     });

//     if (error) {
//       toast.error("Failed to send message. Please try again.");
//     } else {
//       toast.success("Message sent successfully! We'll get back to you soon.");
//     }
//   };

//   const handleConnectionsSubmit = async (data: Record<string, any>) => {
//     const { error } = await supabase.from("connection_contributions").insert({
//       your_name: data.yourName,
//       your_email: data.yourEmail,
//       connection_name: data.connectionName,
//       connection_contact: data.connectionContact,
//       reason: data.reason,
//     });

//     if (error) {
//       toast.error("Failed to submit the introduction. Please try again.");
//     } else {
//       toast.success("Thank you for the introduction!");
//     }
//   };

//   const handleTimeSubmit = async (data: Record<string, any>) => {
//     const { error } = await supabase.from("time_contributions").insert({
//       name: data.name,
//       email: data.email,
//       expertise: data.expertise,
//       availability: data.availability,
//     });

//     if (error) {
//       toast.error("Failed to submit your offer. Please try again.");
//     } else {
//       toast.success("Thank you for your offer!");
//     }
//   };

//   const handleTreatyIndividualSubmit = async (data: Record<string, any>) => {
//     setIsSubmitting(true);
//     const { error } = await supabase.from("atj_treaty_signatories").insert({
//       name: data.name,
//       country: data.country,
//       type: "individual",
//     });
//     setIsSubmitting(false);

//       try {
//       const response = await axios.post("http://localhost:3001/api/atj/individual", {
//         name: data.name,
//         country: data.country,
//       });
      
//       console.log("✅ Individual response:", response.data);
//       console.log("✅ Individual status:", response.status);
      
//       navigate("/atj-treaty");
//     } catch (e: any) {
//       console.error("Error submitting individual form:", error);
//       alert("Error signing the treaty"); // אלרט שגיאה פשוט
//       const errorMessage = e.response?.data?.message || "Error signing the treaty. Please try again later.";
//       toast.error(errorMessage);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleTreatyOrganizationSubmit = async (data: Record<string, any>) => {
//     console.log("📝 Form data received:", data); // לוג לבדיקה
//     setIsSubmitting(true);
    
//     const requestData = {
//       name: data.name,
//       country: data.country,
//       representative_name: data.representative_name,
//       representative_title: data.representative_title,
//     };
    
//     console.log("🚀 Sending to server:", requestData); // לוג לבדיקה
    
//     try {
//       const response = await axios.post("http://localhost:3001/api/atj/organization", requestData);
      
//       console.log("✅ Server response:", response.data);
//       console.log("✅ Status code:", response.status);
      
//       // אלרט פשוט שתמיד יופיע
//       alert("Organization registration successful! Thank you for joining the treaty"); // אלרט פשוט
      
//       // גם toast
//       toast.success(response.data?.message || "Organization registration successful! Thank you for joining the treaty");
//       console.log("🎉 Success toast shown!");
      
//       navigate("/atj-treaty");
//     } catch (error: any) {
//       console.error("❌ Error submitting organization form:", error);
//       alert("Error registering organization"); // אלרט שגיאה פשוט
//       const errorMessage = error.response?.data?.message || "Error registering organization. Please try again later.";
//       toast.error(errorMessage);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleContactEmailSubmit = async (data: Record<string, any>) => {
//     // data.preventDefault();

//     await axios.post("http://localhost:3001/api/contact", data);
//     alert("Message sent successfully!");
//   };

//   const handleProblemsSubmit = async (data: Record<string, any>) => {
//     const { error } = await supabase.from("problem_contributions").insert({
//       name: data.name,
//       email: data.email,
//       problem_area: data.problemArea,
//       description: data.description,
//     });

//     if (error) {
//       toast.error("Failed to submit the problem.");
//     } else {
//       toast.success("Thank you for highlighting this problem!");
//     }
//   };

//   const handleIdeasSubmit = async (data: Record<string, any>) => {
//     const { error } = await supabase.from("idea_contributions").insert({
//       name: data.name,
//       email: data.email,
//       title: data.title,
//       description: data.description,
//     });

//     if (error) {
//       toast.error("Failed to submit your idea.");
//     } else {
//       toast.success("Thank you for your brilliant idea!");
//     }
//   };

//   const rawFormHandlers: Record<string, (data: Record<string, any>) => Promise<void>> = {
//     time: handleTimeSubmit,
//     problems: handleProblemsSubmit,
//     ideas: handleIdeasSubmit,
//     connections: handleConnectionsSubmit,
//     treaty_individual: handleTreatyIndividualSubmit,
//     treaty_organization: handleTreatyOrganizationSubmit,
//     contact: handleContactSubmit,
//     contactEmail: handleContactEmailSubmit,
//   };

//   // Automatic wrapping - send email after each normal submission
//   const formHandlers: typeof rawFormHandlers = Object.fromEntries(
//     Object.entries(rawFormHandlers).map(([key, handler]) => [
//       key,
//       async (data: Record<string, any>) => {
//         await handler(data); // normal submission (to Supabase etc.)
//         await sendEmailNotification(data, key); // send email
//       },
//     ])
//   );

//   const onSubmitHandler = async (data: Record<string, any>) => {
//     const handler = formHandlers[formType];
//  if (handler) {
//       try {
//         await handler(data);
//         form.reset(); // :white_check_mark: ריקון השדות לאחר שליחה

//       } catch (error) {
//         toast.error("An error occurred while submitting the form.");
//       }
//     } else {
//       toast.error("No submit handler found for this form.");
//     }
//   };

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-6">
//         {fields.map((field) => (
//           <FormField
//             key={field.name}
//             control={form.control}
//             name={field.name}
//             rules={field.validation || { required: "This field is required." }} // ✅ Required if not provided
//             render={({ field: rhfField }) => (
//               <FormItem>
//                 <FormLabel>{field.label}</FormLabel>
//                 <FormControl>
//                   {field.type === "textarea" ? (
//                     <Textarea
//                       placeholder={field.placeholder}
//                       {...rhfField}
//                       rows={6}
//                       className="text-right"
//                     />
//                   ) : (
//                     <Input
//                       type={field.type}
//                       placeholder={field.placeholder}
//                       {...rhfField}
//                       className="text-left"
//                     />
//                   )}
//                 </FormControl>
//                 <FormMessage className="text-sm text-red-500 text-left" />
//               </FormItem>
//             )}
//           />
//         ))}
//         <Button type="submit" className="w-full" disabled={isSubmitting}>
//           {isSubmitting ? "Sending..." : "Send"}
//         </Button>
//       </form>
//     </Form>
//   );
// };

// export default DynamicForm;



import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./UI/Forms/forms";
import { Input } from "./UI/Input/input";
import { Textarea } from "./UI/textarea";
import { Button } from "./UI/Button/button";
import { useForm } from "react-hook-form";
import { supabase } from "../integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useToast } from "./UI/use-toast";

type Field = {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  validation?: any;
};

type Props = {
  fields: Field[];
  formType: string;
};

const DynamicForm: React.FC<Props> = ({ fields, formType }) => {
  const defaultValues = Object.fromEntries(fields.map(f => [f.name, ""]));
  const form = useForm({ defaultValues });
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const sendEmailNotification = async (
    data: Record<string, any>,
    formType: string
  ) => {
    const fullName =
      data.name ||
      [data.firstName, data.lastName].filter(Boolean).join("  ") ||
      "NoName";

    const subject = `Contact from ${formType} ${fullName}`;

    try {
      await axios.post("http://localhost:3001/api/contact", {
        name: subject,
        email: data.email || "no-reply@example.com",
        message: JSON.stringify(data, null, 2),
      });
    } catch (error) {
      console.error("❌ Failed to send email:", error);
    }
  };

  const handleContactSubmit = async (data: Record<string, any>) => {
    const { error } = await supabase.from("contact_submissions").insert({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      organization: data.organization || null,
      message: data.message,
    });

    if (error) {
      toast({
        title: "Failed to send message.",
        description: "Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you soon.",
        variant: "default",
      });
    }
  };

  const handleConnectionsSubmit = async (data: Record<string, any>) => {
    const { error } = await supabase.from("connection_contributions").insert({
      your_name: data.yourName,
      your_email: data.yourEmail,
      connection_name: data.connectionName,
      connection_contact: data.connectionContact,
      reason: data.reason,
    });

    if (error) {
      toast({
        title: "Failed to submit the introduction.",
        description: "Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Thank you for the introduction!",
        description: "Your connection was submitted successfully.",
        variant: "default",
      });
    }
  };

  const handleTimeSubmit = async (data: Record<string, any>) => {
    const { error } = await supabase.from("time_contributions").insert({
      name: data.name,
      email: data.email,
      expertise: data.expertise,
      availability: data.availability,
    });

    if (error) {
      toast({
        title: "Failed to submit your offer.",
        description: "Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Thank you for your offer!",
        description: "Your availability was submitted.",
        variant: "default",
      });
    }
  };

  const handleTreatyIndividualSubmit = async (data: Record<string, any>) => {
    setIsSubmitting(true);
    const { error } = await supabase.from("atj_treaty_signatories").insert({
      name: data.name,
      country: data.country,
      type: "individual",
    });
    setIsSubmitting(false);

    try {
      await axios.post("http://localhost:3001/api/atj/individual", {
        name: data.name,
        country: data.country,
      });

      toast({
        title: "Signed successfully!",
        description: "Thank you for joining the treaty.",
        variant: "default",
      });

      navigate("/atj-treaty");
    } catch (e: any) {
      const errorMessage = e.response?.data?.message || "Error signing the treaty. Please try again later.";
      toast({
        title: "Error signing the treaty",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTreatyOrganizationSubmit = async (data: Record<string, any>) => {
    setIsSubmitting(true);

    const requestData = {
      name: data.name,
      country: data.country,
      representative_name: data.representative_name,
      representative_title: data.representative_title,
    };

    try {
      const response = await axios.post("http://localhost:3001/api/atj/organization", requestData);

      toast({
        title: "Organization registration successful!",
        description: response.data?.message || "Thank you for joining the treaty.",
        variant: "default",
      });

      navigate("/atj-treaty");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error registering organization. Please try again later.";
      toast({
        title: "Error registering organization",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactEmailSubmit = async (data: Record<string, any>) => {
    await axios.post("http://localhost:3001/api/contact", data);
    toast({
      title: "Message sent successfully!",
      description: "We'll get back to you soon.",
      variant: "default",
    });
  };

const handleProblemsSubmit = async (data: Record<string, any>) => {
  const { error } = await supabase.from("problem_contributions").insert({
    name: data.name,
    email: data.email,
    problem_area: data.problemArea,
    description: data.description,
  });

  if (error) {
    toast({
      title: "Failed to submit the problem.",
      description: "Please try again. If the issue persists, contact support.",
      variant: "destructive",
    });
  } else {
    toast({
      title: "Thank you for highlighting this problem!",
      description: "Your report was received and will be reviewed.",
      variant: "default",
    });
  }
};

  const handleIdeasSubmit = async (data: Record<string, any>) => {
    const { error } = await supabase.from("idea_contributions").insert({
      name: data.name,
      email: data.email,
      title: data.title,
      description: data.description,
    });

    if (error) {
      toast({
        title: "Failed to submit your idea.",
        description: "Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Thank you for your brilliant idea!",
        description: "Your idea was received.",
        variant: "default",
      });
    }
  };

  const rawFormHandlers: Record<string, (data: Record<string, any>) => Promise<void>> = {
    time: handleTimeSubmit,
    problems: handleProblemsSubmit,
    ideas: handleIdeasSubmit,
    connections: handleConnectionsSubmit,
    treaty_individual: handleTreatyIndividualSubmit,
    treaty_organization: handleTreatyOrganizationSubmit,
    contact: handleContactSubmit,
    contactEmail: handleContactEmailSubmit,
  };

  const formHandlers: typeof rawFormHandlers = Object.fromEntries(
    Object.entries(rawFormHandlers).map(([key, handler]) => [
      key,
      async (data: Record<string, any>) => {
        await handler(data);
        await sendEmailNotification(data, key);
      },
    ])
  );

  const onSubmitHandler = async (data: Record<string, any>) => {
    const handler = formHandlers[formType];
    if (handler) {
      try {
        await handler(data);
        form.reset();
      } catch (error) {
        toast({
          title: "An error occurred while submitting the form.",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "No handler found for this form.",
        description: "Please contact the site administrator.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-6">
        {fields.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            rules={field.validation || { required: "This field is required." }}
            render={({ field: rhfField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  {field.type === "textarea" ? (
                    <Textarea
                      placeholder={field.placeholder}
                      {...rhfField}
                      rows={6}
                      className="text-right"
                    />
                  ) : (
                    <Input
                      type={field.type}
                      placeholder={field.placeholder}
                      {...rhfField}
                      className="text-left"
                    />
                  )}
                </FormControl>
                <FormMessage className="text-sm text-red-500 text-left" />
              </FormItem>
            )}
          />
        ))}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send"}
        </Button>
      </form>
    </Form>
  );
};

export default DynamicForm;