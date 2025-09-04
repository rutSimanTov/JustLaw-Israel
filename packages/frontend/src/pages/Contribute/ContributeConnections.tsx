
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { toast } from "sonner";
// import Header from "../../components/Header";
// import Footer from "../../components/Footer";
// import { Button } from "../../components/UI/Button/button";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "../../components/UI/Forms/forms";
// import { Input } from "../../components/UI/Input/input";
// import { Textarea } from "../../components/UI/textarea";
// import { supabase } from "../../integrations/supabase/client";
// const formSchema = z.object({
//   yourName: z.string().min(2, { message: "Your name must be at least 2 characters." }),
//   yourEmail: z.string().email({ message: "Please enter a valid email address." }),
//   connectionName: z.string().min(2, { message: "Connection's name must be at least 2 characters." }),
//   connectionContact: z.string().min(5, { message: "Please provide contact information." }),
//   reason: z.string().min(10, { message: "Please provide a reason for the connection." }),
// });

// const ContributeConnections = () => {
//     const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       yourName: "",
//       yourEmail: "",
//       connectionName: "",
//       connectionContact: "",
//       reason: "",
//     },
//   });

//   async function onSubmit(values: z.infer<typeof formSchema>) {
//     try {
//       const { error } = await supabase
//         .from("connection_contributions")
//         .insert({
//           your_name: values.yourName,
//           your_email: values.yourEmail,
//           connection_name: values.connectionName,
//           connection_contact: values.connectionContact,
//           reason: values.reason,
//         });

//       if (error) {
//         toast.error("Failed to submit the introduction. Please try again.");
//         console.error("Error submitting connection contribution:", error);
//       } else {
//         toast.success("Thank you for the introduction!", {
//           description: "We appreciate you connecting us and will reach out shortly.",
//         });
//         form.reset();
//       }
//     } catch (error) {
//       toast.error("An unexpected error occurred. Please try again.");
//       console.error("Exception submitting connection contribution:", error);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-background flex flex-col">
//       <Header framed={false} />
//       <main className="flex-1 pt-32 pb-20 px-6 container mx-auto">
//         <div className="text-center mb-12">
//             <h1 className="text-5xl font-bold mb-4 text-white">Contribute Connections</h1>
//             <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
//                 Introduce us to key stakeholders in the legal tech ecosystem. Please provide their details below.
//             </p>
//         </div>
        
//         <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-8">
//             <Form {...form}>
//                 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//                     <div className="grid md:grid-cols-2 gap-6">
//                         <FormField
//                             control={form.control}
//                             name="yourName"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Your Name</FormLabel>
//                                     <FormControl>
//                                         <Input placeholder="Sam Connector" {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                         <FormField
//                             control={form.control}
//                             name="yourEmail"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Your Email</FormLabel>
//                                     <FormControl>
//                                         <Input placeholder="sam.connector@example.com" {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                     </div>
//                     <div className="grid md:grid-cols-2 gap-6">
//                         <FormField
//                             control={form.control}
//                             name="connectionName"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Connection's Name</FormLabel>
//                                     <FormControl>
//                                         <Input placeholder="Dr. Evelyn Reed" {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                         <FormField
//                             control={form.control}
//                             name="connectionContact"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Connection's Contact</FormLabel>
//                                     <FormControl>
//                                         <Input placeholder="Email or LinkedIn profile" {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                     </div>
//                     <FormField
//                         control={form.control}
//                         name="reason"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>Reason for Connection</FormLabel>
//                                 <FormControl>
//                                     <Textarea placeholder="Briefly explain why you think we should connect." {...field} rows={4}/>
//                                 </FormControl>
//                                 <FormDescription>
//                                     Please ensure you have permission from your connection before sharing their details.
//                                 </FormDescription>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />
//                     <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
//                         {form.formState.isSubmitting ? "Submitting..." : "Submit Introduction"}
//                     </Button>
//                 </form>
//             </Form>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default ContributeConnections;

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { toast } from "sonner";
// import Header from "../../components/Header";
// import Footer from "../../components/Footer";
// import { Button } from "../../components/UI/Button/button";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "../../components/UI/Forms/forms";
// import { Input } from "../../components/UI/Input/input";
// import { Textarea } from "../../components/UI/textarea";
// import { supabase } from "../../integrations/supabase/client";
// const formSchema = z.object({
//   yourName: z.string().min(2, { message: "Your name must be at least 2 characters." }),
//   yourEmail: z.string().email({ message: "Please enter a valid email address." }),
//   connectionName: z.string().min(2, { message: "Connection's name must be at least 2 characters." }),
//   connectionContact: z.string().min(5, { message: "Please provide contact information." }),
//   reason: z.string().min(10, { message: "Please provide a reason for the connection." }),
// });

// const ContributeConnections = () => {
//     const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       yourName: "",
//       yourEmail: "",
//       connectionName: "",
//       connectionContact: "",
//       reason: "",
//     },
//   });

//   async function onSubmit(values: z.infer<typeof formSchema>) {
//     try {
//       const { error } = await supabase
//         .from("connection_contributions")
//         .insert({
//           your_name: values.yourName,
//           your_email: values.yourEmail,
//           connection_name: values.connectionName,
//           connection_contact: values.connectionContact,
//           reason: values.reason,
//         });

//       if (error) {
//         toast.error("Failed to submit the introduction. Please try again.");
//         console.error("Error submitting connection contribution:", error);
//       } else {
//         toast.success("Thank you for the introduction!", {
//           description: "We appreciate you connecting us and will reach out shortly.",
//         });
//         form.reset();
//       }
//     } catch (error) {
//       toast.error("An unexpected error occurred. Please try again.");
//       console.error("Exception submitting connection contribution:", error);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-background flex flex-col">
//       <Header framed={false} />
//       <main className="flex-1 pt-32 pb-20 px-6 container mx-auto">
//         <div className="text-center mb-12">
//             <h1 className="text-5xl font-bold mb-4 text-white">Contribute Connections</h1>
//             <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
//                 Introduce us to key stakeholders in the legal tech ecosystem. Please provide their details below.
//             </p>
//         </div>
        
//         <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-8">
//             <Form {...form}>
//                 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//                     <div className="grid md:grid-cols-2 gap-6">
//                         <FormField
//                             control={form.control}
//                             name="yourName"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Your Name</FormLabel>
//                                     <FormControl>
//                                         <Input placeholder="Sam Connector" {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                         <FormField
//                             control={form.control}
//                             name="yourEmail"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Your Email</FormLabel>
//                                     <FormControl>
//                                         <Input placeholder="sam.connector@example.com" {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                     </div>
//                     <div className="grid md:grid-cols-2 gap-6">
//                         <FormField
//                             control={form.control}
//                             name="connectionName"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Connection's Name</FormLabel>
//                                     <FormControl>
//                                         <Input placeholder="Dr. Evelyn Reed" {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                         <FormField
//                             control={form.control}
//                             name="connectionContact"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Connection's Contact</FormLabel>
//                                     <FormControl>
//                                         <Input placeholder="Email or LinkedIn profile" {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                     </div>
//                     <FormField
//                         control={form.control}
//                         name="reason"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>Reason for Connection</FormLabel>
//                                 <FormControl>
//                                     <Textarea placeholder="Briefly explain why you think we should connect." {...field} rows={4}/>
//                                 </FormControl>
//                                 <FormDescription>
//                                     Please ensure you have permission from your connection before sharing their details.
//                                 </FormDescription>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />
//                     <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
//                         {form.formState.isSubmitting ? "Submitting..." : "Submit Introduction"}
//                     </Button>
//                 </form>
//             </Form>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default ContributeConnections;

export {};