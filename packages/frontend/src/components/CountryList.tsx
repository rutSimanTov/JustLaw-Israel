import { CountryData } from "./UI/countriesData";
// import { Separator } from "../temp/ui/separator";

interface CountryListProps {
  countries: CountryData[];
}

const CountryList = ({ countries }: CountryListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {countries.map((country) => (
        <div key={country.name} className="space-y-3">
          <h3 className="font-bold text-lg text-pink-400 pb-2">
            {country.name}
          </h3>
          {/* <Separator className="bg-pink-400" /> */}
          <div className="space-y-2 min-h-[60px]">
            <ul className="space-y-2">
              {country.tools.map((tool, index) => (
                <li key={index} className="space-y-1">
                  <div className="font-medium text-sm">
                    {tool.url ? (
                      <a 
                        href={tool.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-white hover:text-white/80 transition-colors"
                      >
                        • {tool.name}
                      </a>
                    ) : (
                      <span className="text-white">
                        • {tool.name}
                      </span>
                    )}
                  </div>
                  {tool.description && (
                    <div className="text-xs text-white/70 ml-4">
                      {tool.description}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CountryList;