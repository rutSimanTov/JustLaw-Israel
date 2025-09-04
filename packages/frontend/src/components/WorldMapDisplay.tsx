import React from 'react';
import { countriesData } from '../components/UI/countriesData'; // Assuming you have a JSON file with country data

type Hotspot = {
  id_state: string;
  top: string;     // אחוזים או פיקסלים
  left: string;
  name: string;
};

const hotspots: Hotspot[] = [
  // { id_state: "UnitedStates", top: "35%", left: "1%", tooltip: "UnitedStates • DoNotPay • Justi Guide • SixFifty • Courtroom5" },
  // { id_state: "UnitedKingdom", top: "28%", left: "45%", tooltip: "UnitedKingdom • AdviceNow • Monaco Solicitors Grapple • Separate Space" },
  // { id_state: "Israel", top: "42%", left: "74%", tooltip: "Israel • LateTod • Just Law Israel • Flights Refund" },
  // { id_state: "CzechRepublic", top: "30.5%", left: "52%", tooltip: "CzechRepublic • Agi Lawyer" },
  // { id_state: "Singapore", top: "53%", left: "105.5%", tooltip: "Singapore • Video Space" },
  // { id_state: "Australia", top: "70%", left: "98%", tooltip: "Australia • Amica • Justice Connect Pro Bono Portal • Josef Legal" },
  // { id_state: "Kenya", top: "61%", left: "76%", tooltip: "Kenya • eWakili" },
  // { id_state: "India", top: "49%", left: "98%", tooltip: "India • Presolv360" },
  // { id_state: "France", top: "33.5%", left: "56%", tooltip: "France • Demander Justice • Testamento" },
  // { id_state: "Spain", top: "37.5%", left: "42%", tooltip: "Spain • Notario.org • Reclamador • Derecho.com" },
  // { id_state: "Bosnia&Herzegovina", top: "36%", left: "60%", tooltip: "Bosnia&Herzegovina • Amiro" },
  // { id_state: "Canada", top: "30%", left: "3%", tooltip: "Canada • Willful • DivorcePath • CanLII • Clicklaw BC" },

  { id_state: "UnitedStates", top: "35%", left: "1%", name: "United States" },
  { id_state: "UnitedKingdom", top: "28%", left: "45%", name: "United Kingdom" },
  { id_state: "Israel", top: "42%", left: "74%", name: "Israel" },
  { id_state: "CzechRepublic", top: "30.5%", left: "52%", name: "Czech Republic" },
  { id_state: "Singapore", top: "53%", left: "105.5%", name: "Singapore" },
  { id_state: "Australia", top: "70%", left: "98%", name: "Australia" },
  { id_state: "Kenya", top: "61%", left: "76%", name: "Kenya" },
  { id_state: "India", top: "49%", left: "98%", name: "India", },
  { id_state: "France", top: "33.5%", left: "56%", name: "France" },
  { id_state: "Spain", top: "37.5%", left: "42%", name: "Spain" },
  { id_state: "Bosnia&Herzegovina", top: "36%", left: "60%", name: "Bosnia & Herzegovina" },
  { id_state: "Canada", top: "30%", left: "3%", name: "Canada" },
];

const WorldMapDisplay: React.FC = () => {
  return (
    <div className="relative inline-block w-full max-w-2xl">
      <img
        src="/map.png"
        alt="World Map"
        className="block w-full max-w-4xl h-auto object-contain"
        style={{ transform: "scaleX(1.2) scaleY(0.8)" }}
      />
      {hotspots.map((spot) => {
        // מוצא את המדינה המתאימה מתוך countriesData
        const country = countriesData.find(
          (c) => c.name === spot.name
        );
        if (!country) return null;
        return (
          <div
            key={spot.id_state}
            className="absolute group"
            style={{ top: spot.top, left: spot.left }}
          >
            {/* עיגול צהוב בהיר, מאיר, עם מסגרת שחורה דקה */}
            <div
              className="rounded-full transition-all duration-200"
              style={{
                width: "0.38cm",
                height: "0.38cm",
                background: "background:rgba(255, 247, 0, 0.35) 0%",
                border: "1.2px solid rgb(255, 247, 0)",
                // boxShadow: "0 0 24px 10px #fff700, 0 0 2px 1px #fffbe6",
                cursor: "pointer"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = "0 0 32px 16px #fff700, 0 0 4px 2px #fffbe6";
                e.currentTarget.style.transform = "scale(1.6)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = "0 0 24px 10px #fff700, 0 0 2px 1px #fffbe6";
                e.currentTarget.style.transform = "scale(1)";
              }}
            />
            {/* הטולטיפ */}
            <div
              // className=" text-yellow-400 "
              className="absolute top-full left-1/2 -translate-x-1/2 mt-2 group-hover:block bg-gray-900 bg-opacity-95 text-lg font-bold text-yellow-50 mb-1 text-sm px-3 py-2 rounded shadow-lg hidden border border-yellow-400 z-20"
              style={{
                filter: "drop-shadow(0 0 12pxrgb(255, 216, 58))",
                minWidth: "180px",
                maxWidth: "260px",
                fontWeight: 500
              }}
            >
              <div
                className="text-lg font-bold text-yellow-300 mb-1 flex justify-center"
                style={{
                  textShadow: "0 0 16px #ffe066, 0 0 4px #fffbe6, 0 0 2px #fff700",
                }}
              >
                <span className="border border-black rounded px-2 py-1 bg-inherit"
                  style={{
                    textShadow: `
                    -1px -1px 0 #000,  
                     1px -1px 0 #000,  
                    -1px 1px 0 #000,  
                     1px 1px 0 #000 `
                  }}
                >
                  {country.name}
                </span>
              </div>
              {country.tools.map((tool, idx) => (
                <div
                  key={idx}
                  className="text-yellow-100"
                  style={{
                    textShadow: "0 0 10px #ffe066, 0 0 2px #fffbe6, 0 0 1px #fff700"
                  }}
                >
                  {tool.name}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div >
  );
};

export default WorldMapDisplay;