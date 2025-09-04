import { useEffect, useState } from "react";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
import { Button } from "../tempSH/button";
import { Card, CardContent, CardHeader, CardTitle } from "../tempSH/card";
import TeamMemberCard from "../pages/TeamMemberCard";

type TeamMember = {
  name: string;
  title: string;
  linkedinUrl: string;
  image?: string;
};

const barriers = [
  { title: "Lack of Resources", description: "Financial constraints prevent many from seeking legal issues." },
  { title: "Lack of Information", description: "People are often unaware of their rights and legal options." },
  { title: "Lack of Awareness", description: "Many don't recognize their problems as legal issues." },
  { title: "Lack of Social Capital", description: "Limited networks can hinder access to legal support systems." },
  { title: "Bureaucratic Intimidation", description: "Complex and daunting legal processes deter individuals." },
];

const About = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/our-team");
        const data = await response.json();
        setTeamMembers(data.data);
        // console.log(data);
      } catch (error) {
        console.error("Error fetching team members:", error);
      }
    };

    fetchTeams();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* <Header /> */}

      <main className="flex-1 pt-28 px-6 container mx-auto pb-16">
        <section className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-primary mb-4">Our Mission</h2>
          <p className="text-lg text-gray-100 font-semibold">
            Our mission is to democratize justice—making legal issues accessible, understandable, and actionable for everyone, everywhere, by catalyzing a thriving ecosystem of entrepreneurs and funders to develop sustainable, profitable and scaleable JusticeTech tools.
          </p>
        </section>

        {/* Team Section */}
        <section className="my-16">
          <h2 className="text-3xl font-bold text-primary text-center mb-12">Our Team</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <TeamMemberCard key={index} member={member} />
            ))}
          </div>
        </section>

        {/* Barriers Section */}
        <section className="my-16">
          <h2 className="text-3xl font-bold text-primary text-center mb-12">The Five Barriers to Access to Justice</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {barriers.map((barrier, index) => (
              <Card key={index} className="bg-card/80 text-center border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg text-primary h-12 flex items-center justify-center">
                    {barrier.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-300">{barrier.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Tools Section
        <section className="my-16 text-center bg-card/80 p-8 rounded-lg border border-primary/20">
          <h2 className="text-3xl font-bold text-primary mb-4">Our JusticeTech Tools</h2>
          <p className="text-gray-200 mb-6 max-w-2xl mx-auto">
            We actively develop and support innovative technology tools designed to simplify legal processes and empower individuals. Explore our projects to see how we're making a difference.
          </p>
          <a href="https://justlawisrael.com" target="_blank" rel="noopener noreferrer">
            <Button size="lg">Explore Our Tools</Button>
          </a>
        </section> */}
         <div className="max-w-6xl mx-auto mb-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-primary">Our B2C JusticeTech Tools</h2>
        <p className="text-lg text-center text-white mb-12">
          We actively develop and support innovative technology tools designed to simplify legal processes for consumers and expand access to justice worldwide.
        </p>
        <a href="https://justlawisrael.com" target="_blank" rel="noopener noreferrer">
          <Button size="lg">
            Explore Our Tools
          </Button>
        </a>
      </div>
      </main>

      {/* <Footer /> */}
    </div>
  );
};

export default About;
