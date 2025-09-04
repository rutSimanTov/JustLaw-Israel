
import { Button } from "../components/UI/Button/button";
import { useContactForm } from "../hooks/useContactForm";
const ContactForm = () => {
  const {
    formData,
    isSubmitting,
    handleInputChange,
    handleSubmit
  } = useContactForm();
  return <div className="bg-card border border-border rounded-3xl p-8">
      <p className="text-muted-foreground mb-8">
        We'd love to hear from you. Send us a message and we'll respond as soon as possible.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <input type="text" name="firstName" placeholder="First name" value={formData.firstName} onChange={handleInputChange} className="px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground" required />
          <input type="text" name="lastName" placeholder="Last name" value={formData.lastName} onChange={handleInputChange} className="px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground" required />
        </div>

        <input type="email" name="email" placeholder="Email address" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground" required />

        <input type="text" name="organization" placeholder="Organization" value={formData.organization} onChange={handleInputChange} className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground" />

        <textarea name="message" placeholder="Your message" value={formData.message} onChange={handleInputChange} rows={6} className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground resize-none" required />

        <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-white w-full py-3 rounded-lg">
          {isSubmitting ? "Sending..." : "Send Message →"}
        </Button>
      </form>
    </div>;
};
export default ContactForm;
