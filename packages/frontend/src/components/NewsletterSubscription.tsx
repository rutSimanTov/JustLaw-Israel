
import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "../tempSH/button";
import { supabase } from "../integrations/supabase/client";

const NewsletterSubscription = () => {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsSubmitting(true);

        try {
            const { error } = await supabase
                .from("newsletter_subscriptions")
                .insert({
                    email: email,
                });

            if (error) {
                if (error.code === '23505') { // Unique constraint violation
                    toast.error("This email is already subscribed to our newsletter.");
                } else {
                    toast.error("Failed to subscribe. Please try again.");
                }
            } else {
                toast.success("Successfully subscribed to our newsletter!");
                setEmail("");
            }
        } catch (error) {
            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-card border border-border rounded-3xl p-8">
            <h3 className="text-xl font-bold mb-4">Stay Updated</h3>
            <p className="text-muted-foreground mb-6">
                Subscribe to our newsletter to receive updates on the latest developments in justice technology.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground"
                    required
                />

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-primary/90 text-white w-full py-3 rounded-lg"
                >
                    {isSubmitting ? "Subscribing..." : "Subscribe to Newsletter"}
                </Button>
            </form>
        </div>
    );
};

export default NewsletterSubscription;
