

import { useNavigate } from "react-router-dom"; // ייבוא useNavigate
import { useState, useEffect } from "react";
// ייתכן שלא תצטרך את הייבוא הבא אם אתה לא משתמש בהם בתוך הקומפוננטה הזו
// import { toast } from "sonner";
// import { supabase } from "../tempSH/integrations/supabase/client";

// וודא שנתיבי הייבוא נכונים עבור Button ו-ContributionCard
import { Button } from "./UI/Button/button"; // עדכן נתיב אם הוא שונה אצלך
import ContributionCard from "./ContributionCard"; // עדכן נתיב אם הוא שונה אצלך


type ContributionItem = {
    title: string;
    description: string;
    icon: string;
    link: string;
    buttonText: string;
};

const ContributionSection = () => {
    const [items, setItems] = useState<ContributionItem[]>([]);
    const navigate = useNavigate(); // אתחול useNavigate

    // פונקציה לטיפול בלחיצה על סכום מוגדר מראש
    // היא תנווט לדף התרומה עם הסכום כפרמטר URL
    const handlePresetClick = (presetAmount: string) => {
        navigate(`/donation-page?amount=${presetAmount}`);
    };

    // פונקציה לטיפול בלחיצה על כפתור "Custom"
    // היא תנווט לדף התרומה ללא סכום מוגדר מראש, כך שהמשתמש יוכל להזין סכום משלו
    const handleCustomDonation = () => {
        navigate('/donation-page'); // ניתוב לדף התרומה ללא סכום ספציפי ב-URL
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // וודא שנקודת הקצה הזו קיימת בשרת הבאקאנד שלך
                const res = await fetch("http://localhost:3001/api/contribution");
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data = await res.json();
                setItems(data.data);
            } catch (err) {
                console.error("API error:", err);
                // אופציונלי: הצג טוסט שגיאה אם טעינת הנתונים נכשלה
                // toast.error("Failed to load contribution items.");
            }
        };
        fetchData();
    }, []);

    return (
        <section
            className="py-6 xs:py-8 sm:py-10 md:py-12 px-1 xs:px-2 sm:px-3 md:px-4 bg-gradient-to-b from-background via-background/90 to-primary/10 rounded-xl shadow-md overflow-x-hidden min-h-[60vh] mb-4 xs:mb-8 sm:mb-12 animate-fade-in scroll-snap-align-start"
            tabIndex={-1}
            style={{ scrollPaddingTop: '5rem', wordBreak: 'break-word' }}
        >
            <div className="container mx-auto max-w-full px-0 xs:px-1 sm:px-2">
                <div className="text-center mb-6 sm:mb-10">
                    <h2 className="text-balance break-words font-bold mb-3 sm:mb-5 text-xl xs:text-2xl sm:text-3xl md:text-4xl" style={{ fontSize: 'clamp(1.2rem, 3vw, 2.2rem)' }}>
                        Join Our <span className="text-primary">Mission</span>
                    </h2>
                    <p className="text-balance break-words text-muted-foreground max-w-xs xs:max-w-md sm:max-w-2xl mx-auto text-sm xs:text-base sm:text-lg" style={{ fontSize: 'clamp(0.8rem, 2vw, 1.1rem)' }}>
                        There are many ways to contribute to our vision of democratizing access to justice. Every contribution makes a difference.
                    </p>
                </div>

                {/* קלפי התרומה הראשיים (אם רלוונטיים) */}                       
                <div className="grid grid-cols-2 gap-8">
                {items.slice(0, 2).map((item, idx) => (
                    <ContributionCard key={idx} {...item} />
                ))}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-10 mt-8">
                {items.slice(2).map((item, idx) => (
                    <ContributionCard key={idx + 2} {...item} />
                        ))}
                    </div>
                </div>

            {/* בלוק כרטיס התרומה המבוקש */}
            <div id="donation-form" className="max-w-2xl mx-auto bg-card border border-border rounded-3xl p-8">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-primary mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        <h3 className="text-2xl font-bold">Fund the <span className="text-pink-500">Future</span> of Justice</h3>
                    </div>
                    <p className="text-muted-foreground">
                        Your support helps us accelerate justice technology solutions worldwide
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <Button
                        variant="outline"
                        onClick={() => handlePresetClick('2500')}
                        className="border-primary text-primary hover:bg-primary hover:text-white py-3"
                    >
                        £2,500
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => handlePresetClick('5000')}
                        className="border-primary text-primary hover:bg-primary hover:text-white py-3"
                    >
                        £5,000
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleCustomDonation}
                        className="border-primary text-primary hover:bg-primary hover:text-white py-3"
                    >
                        Custom
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default ContributionSection;