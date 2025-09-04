
// import Header from "../../components/Header";

// import { Button } from "../../components/UI/Button/button";
// import { Link } from "react-router-dom";
// import { BarChart, Heart, Users } from "lucide-react";

// const ContributeFunding = () => (
//   <div className="min-h-screen bg-background flex flex-col">
//     <Header framed={false} />
//     <main className="flex-1 pt-32 pb-20 px-6 container mx-auto">
//       <div className="text-center">
//         <h1 className="text-5xl font-bold mb-4 text-white">Fuel Our Mission</h1>
//         <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
//           Your financial contribution is a powerful catalyst for change, directly supporting the development and deployment of technologies that make justice accessible to all.
//         </p>
//       </div>

//       <div className="grid md:grid-cols-3 gap-8 mb-16 text-center">
//         <div className="bg-background/50 border border-border p-8 rounded-2xl flex flex-col">
//           <BarChart className="w-12 h-12 text-primary mx-auto mb-4" />
//           <h3 className="text-2xl font-bold mb-2">Scale Impact</h3>
//           <p className="text-muted-foreground flex-grow">Help us expand our reach, supporting more startups and initiatives in the Just-Tech space.</p>
//         </div>
//         <div className="bg-background/50 border border-border p-8 rounded-2xl flex flex-col">
//           <Users className="w-12 h-12 text-primary mx-auto mb-4" />
//           <h3 className="text-2xl font-bold mb-2">Empower Innovators</h3>
//           <p className="text-muted-foreground flex-grow">Your funds provide crucial resources to developers and entrepreneurs building justice solutions.</p>
//         </div>
//         <div className="bg-background/50 border border-border p-8 rounded-2xl flex flex-col">
//           <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
//           <h3 className="text-2xl font-bold mb-2">Sustain Operations</h3>
//           <p className="text-muted-foreground flex-grow">Ensure the long-term viability of JustLaw as a hub for global access to justice.</p>
//         </div>
//       </div>

//       <div className="text-center bg-card border border-border rounded-3xl p-12 max-w-4xl mx-auto">
//         <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
//         <p className="text-muted-foreground mb-8">
//           All donations are processed securely through our homepage. Click the button below to be redirected to the donation form.
//         </p>
//         <Link to="/#donation-form">
//           <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg">
//             Donate Now
//           </Button>
//         </Link>
//       </div>
//     </main>

//   </div>
// );

// export default ContributeFunding;



import { useEffect } from "react"; // הוסף את useEffect
import Header from "../../components/Header";
import { Button } from "../../components/UI/Button/button";
import { Link } from "react-router-dom";
import { BarChart, Heart, Users } from "lucide-react";

const ContributeFunding = () => {
  // השתמש ב-useEffect כדי לגלול לראש העמוד כשהקומפוננטה נטענת
  useEffect(() => {
    // גולל את חלון הדפדפן לנקודה (0,0) - ראש העמוד.
    // ה-[] בסוף מבטיח שהאפקט ירוץ רק פעם אחת לאחר ה-render הראשון.
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header framed={false} />
      <main className="flex-1 pt-32 pb-20 px-6 container mx-auto">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4 text-white">Fuel Our Mission</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            Your financial contribution is a powerful catalyst for change, directly supporting the development and deployment of technologies that make justice accessible to all.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16 text-center">
          <div className="bg-background/50 border border-border p-8 rounded-2xl flex flex-col">
            <BarChart className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Scale Impact</h3>
            <p className="text-muted-foreground flex-grow">Help us expand our reach, supporting more startups and initiatives in the Just-Tech space.</p>
          </div>
          <div className="bg-background/50 border border-border p-8 rounded-2xl flex flex-col">
            <Users className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Empower Innovators</h3>
            <p className="text-muted-foreground flex-grow">Your funds provide crucial resources to developers and entrepreneurs building justice solutions.</p>
          </div>
          <div className="bg-background/50 border border-border p-8 rounded-2xl flex flex-col">
            <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Sustain Operations</h3>
            <p className="text-muted-foreground flex-grow">Ensure the long-term viability of JustLaw as a hub for global access to justice.</p>
          </div>
        </div>

        <div className="text-center bg-card border border-border rounded-3xl p-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-muted-foreground mb-8">
            All donations are processed securely through our homepage. Click the button below to be redirected to the donation form.
          </p>
          <Link to="/#donation-form">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg">
              Donate Now
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default ContributeFunding;