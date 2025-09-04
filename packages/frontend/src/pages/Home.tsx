// Home.tsx
import ContactSection from "../components/ContactSection";
import ContributionSection from "../components/ContributionSection";
import FAQSection from "../components/FAQSection";
import HeroSection from "../components/HeroSection";
import MissionSection from "../components/MissionSection";
import PillarSection from "../components/PillarSection";
import SectionDivider from "../components/SectionDivider";

const Home = () => {
  return (
    <>
 
      <HeroSection />
      <SectionDivider question="What are the foundational pillars of justice transformation?" />
      <PillarSection />
      <SectionDivider question="How can you be part of this global movement?" />
      <MissionSection />
      <SectionDivider question="What different ways can you contribute to the cause?" />
      <ContributionSection />
      <SectionDivider question="What questions do people commonly ask about JustLaw?" />
      <FAQSection />
      <SectionDivider question="Ready to connect and take the next step?" />
      <ContactSection />
    </>
  );
}

export default Home;