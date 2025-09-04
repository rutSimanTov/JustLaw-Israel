import { useState, useEffect } from "react";

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/api/faqs")
      .then((res) => res.json())
      .then((data) => {
        setFaqs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section
      className="py-10 sm:py-16 px-2 sm:px-6 bg-gradient-to-b from-background via-background/90 to-primary/10 rounded-xl shadow-md overflow-x-hidden min-h-[60vh] mb-6 xs:mb-10 sm:mb-16 animate-fade-in scroll-snap-align-start"
      tabIndex={-1}
    >
      <div className="container mx-auto max-w-3xl px-0 sm:px-4">
        <div className="text-center mb-8 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-balance break-words">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground text-balance break-words">
            Everything you need to know about JustLaw and our mission to revolutionize legal technology.
          </p>
        </div>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-border rounded-2xl overflow-hidden shadow-sm min-w-0"
              >
                <button
                  className="w-full px-4 sm:px-8 py-4 sm:py-6 text-left flex items-center justify-between hover:bg-muted/50 transition-colors break-words"
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                >
                  <span className="text-base sm:text-lg font-semibold text-balance break-words">{faq.question}</span>
                  <svg
                    className={`w-6 h-6 transition-transform ${
                      openFAQ === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openFAQ === index && (
                  <div className="px-4 sm:px-8 pb-4 sm:pb-6">
                    <p className="text-muted-foreground leading-relaxed text-balance break-words">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FAQSection;
