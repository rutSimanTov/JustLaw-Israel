
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

interface SectionDividerProps {
  question: string;
  className?: string;
}

const SectionDivider = ({ question, className = "" }: SectionDividerProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.5,
        rootMargin: "0px 0px -10% 0px"
      }
    );

    const element = document.querySelector(`[data-question="${question}"]`);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [question]);

  return (
    <div 
      className={`flex flex-col items-center py-8 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${className}`}
      data-question={question}
    >
      <div className="text-center mb-4">
        <p className="text-lg md:text-xl text-muted-foreground font-medium">
          {question}
        </p>
      </div>
      <div className="animate-bounce">
        <ChevronDown className="w-6 h-6 text-primary" />
      </div>
    </div>
  );
};

export default SectionDivider;
