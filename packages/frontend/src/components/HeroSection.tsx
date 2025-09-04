import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "./UI/Button/button";
const HeroSection = () => {
  const [counts, setCounts] = useState({
    people: 0,
    countries: 0,
    startups: 0,
    funding: 0
  });
  const handleJoinMissionClick = () => {
    const contributionSection = document.querySelector('section:has(#donation-form)');
    if (contributionSection) {
      contributionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  useEffect(() => {
    const targets = { people: 1000000000, countries: 12, startups: 50, funding: 100 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      setCounts({
        people: Math.floor(targets.people * progress),
        countries: Math.floor(targets.countries * progress),
        startups: Math.floor(targets.startups * progress),
        funding: Math.floor(targets.funding * progress)
      });
      if (currentStep >= steps) {
        clearInterval(timer);
        setCounts(targets);
      }
    }, interval);
    return () => clearInterval(timer);
  }, []);
  const formatNumber = (num: number, suffix: string) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(0) + "B" + suffix;
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(0) + "M" + suffix;
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + "K" + suffix;
    }
    return num + suffix;
  };
  return (
     <section className="bg-background text-white pt-0 md:pt-5 px-6 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-pink-500/20 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,20,147,0.1),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(255,20,147,0.1),transparent_50%)] animate-[pulse_4s_ease-in-out_infinite]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-[slide-in-right_8s_ease-in-out_infinite_alternate]"></div>
      </div>

      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 md:mb-12 uppercase leading-tight">
            Build the Future of Justice
          </h1>

          {/* Join JustLaw subtitle - broken into two lines */}
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 md:mb-12 leading-relaxed">
            <span className="block">Join <span className="text-pink-500">JustLaw</span></span>
          </h2>
          <div className="mt-6 md:mt-8">
            <p className="text-lg md:text-xl leading-relaxed mt-8 font-light" style={{ lineHeight: '2.2' }}>
              Transform <span className="text-primary font-bold">justice</span> through <span className="text-primary font-bold">technology</span><span className="text-pink-500">,</span> national cross-sector <span className="text-primary font-bold">collaboration</span><span className="text-pink-500">,</span> and global force for <span className="text-primary font-bold">impact</span>
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            <Link to="/impact">
              <Button size="lg" variant="outline" className="bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 text-lg font-semibold transition-all duration-200">
                Watch Our Impact
              </Button>
            </Link>
            <Button size="lg" onClick={handleJoinMissionClick} className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-primary hover:border-primary/90">
              Join Our Mission
            </Button>
          </div>
        </div>
        {/* Enhanced Stats with Depth */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mt-16 md:mt-20">
          <div className="text-center">
            <div className="border border-pink-500 rounded-xl p-6 h-full flex flex-col justify-between shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-gradient-to-br hover:from-primary/10 hover:to-pink-500/10 backdrop-blur-sm bg-black/20">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{formatNumber(counts.people, "+")}</div>
              <div className="text-gray-300">People Face Legal Problems Annually</div>
            </div>
          </div>
          <div className="text-center">
            <Link to="/justicetech-map" className="block hover:scale-105 transition-transform duration-200 h-full">
              <div className="border border-pink-500 rounded-xl p-6 hover:border-primary/80 transition-all duration-300 h-full flex flex-col justify-between shadow-lg hover:shadow-2xl hover:bg-gradient-to-br hover:from-primary/10 hover:to-pink-500/10 backdrop-blur-sm bg-black/20">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2 hover:text-primary/80 cursor-pointer">{counts.countries}</div>
                <div className="text-gray-300 hover:text-gray-200">Countries Reached</div>
              </div>
            </Link>
          </div>
          <div className="text-center">
            <div className="border border-pink-500 rounded-xl p-6 h-full flex flex-col justify-between shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-gradient-to-br hover:from-primary/10 hover:to-pink-500/10 backdrop-blur-sm bg-black/20">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{counts.startups}+</div>
              <div className="text-gray-300">Local Startups Accelerated</div>
            </div>
          </div>
          <div className="text-center">
            <div className="border border-pink-500 rounded-xl p-6 h-full flex flex-col justify-between shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-gradient-to-br hover:from-primary/10 hover:to-pink-500/10 backdrop-blur-sm bg-black/20">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">${counts.funding}K</div>
              <div className="text-gray-300">Funding Facilitated</div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-24 md:mt-32">
        <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      </div>
    </section>
  );
};
export default HeroSection;
