import { useEffect, useState } from "react";
import PillarCard from "../pages/PillarCard";

const ThreePillars = () => {
    interface Pillar {
        title: string;
        description: string;
        items: string[];
        icon: string;
        link: string;
    }

    const [pillars, setPillars] = useState<Pillar[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // בדיקה אם המשתמש מחובר
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('jwtToken');
            setIsLoggedIn(!!token);
        };

        checkAuth();
        // מאזין לשינויים ב-localStorage
        window.addEventListener('storage', checkAuth);
        
        return () => {
            window.removeEventListener('storage', checkAuth);
        };
    }, []);

    useEffect(() => {
        const fetchPillars = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/pillars');
                const data = await response.json();
                setPillars(data.data);
                console.log('Fetched images:', data.data);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };
        fetchPillars();
    }, []);

    // אם המשתמש לא מחובר - לא מציגים את הקטע
    if (!isLoggedIn) {
        return null;
    }

    return (
        <section className="py-20 px-6">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Our Three Pillars of <span className="text-primary">Innovation</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                        We accelerate justice-focused technology by connecting startups, funders, and institutions with paths to real-world adoption.
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {pillars.map((p, index) => (
                        <PillarCard
                            key={index}
                            title={p.title}
                            description={p.description}
                            items={p.items}
                            icon={p.icon}
                            link={p.link}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
};

export default ThreePillars;

