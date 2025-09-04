import { Card, CardContent } from "./Card";
import { countriesData } from "./UI/countriesData";
import WorldMapDisplay from "./WorldMapDisplay";
import CountryList from "./CountryList";
import '../index.css';
import { useEffect } from "react";

const JusticeTechMapComponent = () => {
  useEffect(() => {
      window.scrollTo(0, 0);
  }, []);
  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card className="text-sm text-muted-foreground">
        <CardContent className="p-8">
          <div className="max-w-4xl mx-auto text-center mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-0">
              <span className="text-pink-500">
                JusticeTech Global Map
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-0 mt-2">
              "Explore the worldwide development of JusticeTech tools and innovations. Hover over highlighted regions to discover the cutting-edge solutions being built in each country."
            </p>
          </div>
          {/* הצמדת המפה לכותרת */}
          <div className="flex flex-col items-center w-full max-w-4xl mx-auto mt-0 mb-0">
            <WorldMapDisplay />
          </div>
          <CountryList countries={countriesData} />
          <div className="mt-8 text-center">
            <p className="text-xl text-muted-foreground mb-0 mt-2">
              Explore JusticeTech innovations from around the world
            </p>
            <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JusticeTechMapComponent;