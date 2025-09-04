
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../../components/UI/Button/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/UI/Forms/forms";
import { Input } from "../../components/UI/Input/input";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { supabase } from "../../services/client";
import { useToast } from "../../components/UI/use-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import ComingSoon from "../../components/ComingSoon";

const formSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters."),
  country: z.string().min(2, "Country must be at least 2 characters."),
  representative_name: z.string().min(2, "Representative name must be at least 2 characters."),
  representative_title: z.string().min(2, "Representative title must be at least 2 characters."),
});

const SignTreatyOrganization = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      country: "",
      representative_name: "",
      representative_title: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    // const { error } = await supabase.from("atj_treaty_signatories").insert({
    //   name: values.name,
    //   country: values.country,
    //   type: "organization",
    //   representative_name: values.representative_name,
    //   representative_title: values.representative_title,
    // });
    setIsSubmitting(false);

    // if (error) {
    //   toast({
    //     title: "Error signing treaty",
    //     description: error.message,
    //     variant: "destructive",
    //   });
    // } else {
    //   toast({
    //     title: "Treaty Signed!",
    //     description: "Thank you for your organization's commitment to Access to Justice.",
    //   });
    //   navigate("/atj-treaty");
    // }
  // לבינתיים
      alert(
        "Treaty Signed!\nThank you for your organization's commitment to Access to Justice."
      );
     // navigate("/atj-treaty");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header framed={false} />
      <main className="flex-1 pt-32 pb-20 px-6 container mx-auto">
        <div className="max-w-xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4">
            Sign the ATJ Treaty
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            As an organization, your signature showcases your commitment to corporate social responsibility and helps shape the future of justice.
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Global Legal Innovators" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country of Operation</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. United States" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="representative_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Representative's Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="representative_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Representative's Title</FormLabel>
                    <FormControl>
                      <Input placeholder="CEO" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Signing..." : "Sign the Treaty as an Organization"}
              </Button>
            </form>
          </Form>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default SignTreatyOrganization;
