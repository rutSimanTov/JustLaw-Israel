import { Link } from "react-router-dom";
import { Button } from "./UI/Button/button";
import { Building, User } from "lucide-react";
import '../index.css'
const MissionSection = () => {
  return (
    <section
      className="py-3 xs:py-6 sm:py-8 md:py-12 px-0.5 xs:px-1.5 sm:px-3 md:px-6 bg-gradient-to-b from-background via-background/90 to-primary/10 rounded-xl shadow-md overflow-x-hidden overflow-y-visible min-h-[60vh] mb-1 xs:mb-3 sm:mb-6 md:mb-10 animate-fade-in scroll-snap-align-start"
      tabIndex={-1}
      style={{scrollPaddingTop:'5rem'}}
    >
      <div className="container mx-auto max-w-5xl px-0 xs:px-1.5 sm:px-3">
        <div className="grid gap-2 xs:gap-4 sm:gap-6 md:gap-10 items-center overflow-x-auto" style={{scrollSnapType:'x mandatory', flexWrap:'wrap'}}>
          {/* Content */}
          <div className="text-center">
            <h2 className="text-balance font-bold mb-1 sm:mb-4 leading-tight break-words scroll-mt-24 xs:scroll-mt-28" style={{fontSize:'clamp(0.95rem,3.5vw,2rem)', wordBreak:'break-word'}}>
              The Global ATJ Treaty
            </h2>
            
            <p className="text-balance text-muted-foreground mb-3 sm:mb-6 max-w-2xl mx-auto leading-relaxed break-all xs:break-words" style={{fontSize:'clamp(0.8rem,1.7vw,1rem)', wordBreak:'break-word'}}>
              Sign up to join JustLaw's ecosystem and commit to contribute in the way that suits you best
            </p>

            <div className="grid xs:grid-cols-1 sm:grid-cols-2 gap-2 xs:gap-3 sm:gap-5 max-w-4xl mx-auto" style={{gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', scrollSnapAlign:'start'}}>
                <div className="bg-background/50 border border-border p-1.5 xs:p-2.5 sm:p-5 rounded-2xl flex flex-col items-center text-center h-full shadow-sm transition-shadow transition-colors duration-300 hover:shadow-lg hover:bg-background/70 overflow-hidden max-w-xs mx-auto min-w-0">
                    <div className="w-10 h-10 xs:w-12 xs:h-12 aspect-square bg-primary/20 rounded-full flex items-center justify-center mb-1.5 xs:mb-3">
                        <Building className="w-6 h-6 xs:w-7 xs:h-7 text-primary" />
                    </div>
                    <h3 className="text-balance font-bold mb-1 xs:mb-2" style={{fontSize:'clamp(0.85rem,1.2vw,1.1rem)', wordBreak:'break-word'}}>For Organizations & Companies</h3>
                    <p className="text-muted-foreground mb-1.5 sm:mb-3 flex-grow text-balance break-all xs:break-words" style={{fontSize:'clamp(0.75rem,0.9vw,0.95rem)', wordBreak:'break-word'}}>
                        Showcase your commitment to corporate social responsibility and help shape the future of justice.
                    </p>
                    <Link to="/treaty_organization" className="w-full">
                        <Button size="lg" aria-label="Sign as an Organization" className="w-full text-xs xs:text-sm py-2 xs:py-2.5 rounded-lg min-h-[36px] focus-visible:ring-2 focus-visible:ring-primary transition-transform duration-200 hover:scale-105" onClick={() => window.scrollTo(0, 0)}>Sign as an Organization</Button>
                    </Link>
                </div>

                <div className="bg-background/50 border border-border p-1.5 xs:p-2.5 sm:p-5 rounded-2xl flex flex-col items-center text-center h-full shadow-sm transition-shadow transition-colors duration-300 hover:shadow-lg hover:bg-background/70 overflow-hidden max-w-xs mx-auto min-w-0">
                    <div className="w-10 h-10 xs:w-12 xs:h-12 aspect-square bg-primary/20 rounded-full flex items-center justify-center mb-1.5 xs:mb-3">
                        <User className="w-6 h-6 xs:w-7 xs:h-7 text-primary" />
                    </div>
                    <h3 className="text-balance font-bold mb-1 xs:mb-2" style={{fontSize:'clamp(0.85rem,1.2vw,1.1rem)', wordBreak:'break-word'}}>For Individuals</h3>
                    <p className="text-muted-foreground mb-1.5 sm:mb-3 flex-grow text-balance break-all xs:break-words" style={{fontSize:'clamp(0.75rem,0.9vw,0.95rem)', wordBreak:'break-word'}}>
                        Lend your voice to the cause. Every signature adds weight to our collective call for change.
                    </p>
                    <Link to="/treaty_individual" className="w-full">
                        <Button size="lg" variant="outline" aria-label="Sign as an Individual" className="w-full text-xs xs:text-sm py-2 xs:py-2.5 rounded-lg min-h-[36px] text-neutral-50 bg-pink-600 hover:bg-pink-500 focus-visible:ring-2 focus-visible:ring-primary transition-transform duration-200 hover:scale-105" onClick={() => window.scrollTo(0, 0)}>Sign as an Individual</Button>
                    </Link>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
