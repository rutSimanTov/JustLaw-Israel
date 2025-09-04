import ContactInfo from "./ContactInfo";
import DynamicFormPage from "../pages/DynamicFormPage";
import NewsletterSubscription from "./NewsletterSubscription";
const ContactSection = () => {
  return (
    <section
      id="contact"
      className="py-10 sm:py-16 px-2 sm:px-6 bg-gradient-to-b from-background via-background/90 to-primary/10 rounded-xl shadow-md overflow-x-hidden min-h-[60vh] mb-6 xs:mb-10 sm:mb-16 animate-fade-in scroll-snap-align-start"
      tabIndex={-1}
    >
      <div className="container mx-auto max-w-4xl px-0 sm:px-4">
        <div className="text-center mb-8 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-balance break-words">
            Let's <span className="text-primary">Connect</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground text-balance break-words">
            Ready to join the B2C legal technology revolution? Get in touch with our team.
          </p>
        </div>

        <div className="grid xs:grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 min-w-0">
          <div className="min-w-0">
            <DynamicFormPage type="contact" />
          </div>
          <div className="min-w-0">
            <ContactInfo />
          </div>
        </div>
      </div>
      <div className="max-w-md mx-auto">
        <NewsletterSubscription />
      </div>
    </section>
  );
};

export default ContactSection;
