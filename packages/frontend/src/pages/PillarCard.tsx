// components/FeatureCard.tsx
import { Link } from "react-router-dom";
import { Button } from "../tempSH/button";

type FeatureCardProps = {
  title: string;
  description: string;
  items: string[];
  icon: string;
  link: string;
};

export default function PillarCard({ title, description, items, icon, link }: FeatureCardProps) {
  return (
    <div className="text-center p-8">
      <div
        className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6"
        dangerouslySetInnerHTML={{ __html: icon }}
      />
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>
      <ul className="text-left space-y-3 mb-8">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center">
            <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
            {item}
          </li>
        ))}
      </ul>
      <Link to={link}>
           <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 h-10 px-4 bg-primary hover:bg-primary/90 text-white w-full py-3 rounded-lg">
           Learn More →
           </Button>
        </Link>
    </div>
        
  );
}

 
