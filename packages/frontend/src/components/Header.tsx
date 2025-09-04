// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Button } from "../components/UI/Button/button";
// import { useAuth } from "../hooks/useAuth";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/UI/dropdown-menu";
// import { ChevronDown } from "lucide-react";
// const Header = ({
//   framed = true
// }: {
//   framed?: boolean;
// }) => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const navigate = useNavigate();
//   const {
//     user,
//     signOut
//   } = useAuth();
//   const handleJoinMissionClick = () => {
//     navigate('/');
//     setTimeout(() => {
//       const contributionSection = document.querySelector('section:has(#donation-form)');
//       if (contributionSection) {
//         contributionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
//       }
//     }, 100);
//   };
//   const headerClass = framed ? "fixed top-0 left-0 right-0 z-50 bg-background backdrop-blur-md" : "fixed top-0 left-0 right-0 z-50 bg-background";
//   return <header className={headerClass}>
//     <div className="w-full py-4">
//       <div className="max-w-screen-2xl mx-auto px-6">
//         <div className="flex items-center justify-between">
//           {/* Logo */}
//           <Link to="/" className="flex items-center">
//             <div className="w-16 h-16 flex items-center justify-center">
//               <img src="/Logo.png" alt="JustLaw Logo" className="w-full h-full object-contain brightness-0 invert" />
//             </div>
//           </Link>
//           {/* Navigation */}
//           <nav className="hidden md:flex items-center space-x-4">
//             <Link to="/">
//               <Button variant="ghost" className="text-foreground transition-colors">
//                 Home
//               </Button>
//             </Link>
//             <Link to="/about">
//               <Button variant="ghost" className="text-foreground transition-colors">
//                 About
//               </Button>
//             </Link>
//             <Link to='/justicetech-map'>
//               <Button variant="ghost" className="text-foreground transition-colors">
//                 JusticeTech Global Map
//               </Button>
//             </Link>
//             <Link to="/contact">
//               <Button variant="ghost" className="text-foreground transition-colors">
//                 Contact
//               </Button>
//             </Link>
//             <Link to="/treaty">
//               <Button variant="ghost" className="text-foreground transition-colors">
//                 ATJ Treaty
//               </Button>
//             </Link>
//             <Button variant="ghost" className="text-foreground transition-colors" onClick={handleJoinMissionClick}>
//               Join Our Mission
//             </Button>
//           </nav>
//           {/* Auth Buttons */}
//           <div className="hidden md:flex items-center space-x-4">
//             {user ? <>
//               {/* <Link to="/admin">
//                 <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
//                   Admin
//                 </Button>
//               </Link> */}
//               <Button onClick={signOut} variant="outline">
//                 Sign Out
//               </Button>
//             </> : <Link to="/login">
//               <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg">
//                 Sign In
//               </Button>
//             </Link>}
//           </div>
//           {/* Mobile menu button */}
//           {/* <button className="md:hidden text-foreground" onClick={() => setIsMenuOpen(!isMenuOpen)}>
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//             </svg>
//           </button> */}
//         </div>
//       </div>
//     </div>
//     <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
//   </header>;
// };
// export default Header;






/////מפה זה מה שנאוה שינת
// זה לא עבד בקלות הענין של הבדיקות עם Context אז הלכתי על משהו פשוט יותר שאמר לעבוד מעולה
//אבל אם רוצים לשדרג את זה אפשר- יש אפשרות שבה הקוד יהיה כתוב בורה יותר נכונה- אבל זה דורש עוד זמן אז כרגע זה מספיק ככה




// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Button } from "../components/UI/Button/button";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/UI/dropdown-menu";
// import { ChevronDown } from "lucide-react";

// const Header = ({
//   framed = true
// }: {
//   framed?: boolean;
// }) => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [username, setUsername] = useState("Guest");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkAuth = () => {
//       const token = localStorage.getItem("jwtToken");
//       const storedUsername = localStorage.getItem("userName");
//       setIsLoggedIn(!!token);
//       setUsername(storedUsername || "Guest");
//     };

//     checkAuth(); // בדיקה ראשונית

//     window.addEventListener("storage", checkAuth); // מאזין לשינויים ב-localStorage

//     // בדיקה מחזורית באותו טאבים (כדי לתפוס שינויים מקומיים)
//     const interval = setInterval(checkAuth, 500);

//     return () => {
//       window.removeEventListener("storage", checkAuth);
//       clearInterval(interval);
//     };
//   }, []);

//   const handleJoinMissionClick = () => {
//     navigate('/');
//     setTimeout(() => {
//       const contributionSection = document.querySelector('section:has(#donation-form)');
//       if (contributionSection) {
//         contributionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
//       }
//     }, 100);
//   };

//   const headerClass = framed ? "fixed top-0 left-0 right-0 z-50 bg-background backdrop-blur-md" : "fixed top-0 left-0 right-0 z-50 bg-background";

//   return <header className={headerClass}>
//     <div className="w-full py-4">
//       <div className="max-w-screen-2xl mx-auto px-6">
//         <div className="flex items-center justify-between">
//           {/* Logo */}
//           <Link to="/" className="flex items-center">
//             <div className="w-16 h-16 flex items-center justify-center">
//               <img src="/Logo.png" alt="JustLaw Logo" className="w-full h-full object-contain brightness-0 invert" />
//             </div>
//           </Link>
//           {/* Navigation */}
//           <nav className="hidden md:flex items-center space-x-4">
//             <Link to="/">
//               <Button variant="ghost" className="text-foreground transition-colors">
//                 Home
//               </Button>
//             </Link>
//             <Link to="/about">
//               <Button variant="ghost" className="text-foreground transition-colors">
//                 About
//               </Button>
//             </Link>
//             <Link to='/justicetech-map'>
//               <Button variant="ghost" className="text-foreground transition-colors">
//                 JusticeTech Global Map
//               </Button>
//             </Link>
//             <Link to="/Form/contactEmail">
//               <Button variant="ghost" className="text-foreground transition-colors">
//                 Contact
//               </Button>
//             </Link>
//             <Link to="/treaty">
//               <Button variant="ghost" className="text-foreground transition-colors">
//                 ATJ Treaty
//               </Button>
//             </Link>
//             <Button variant="ghost" className="text-foreground transition-colors" onClick={handleJoinMissionClick}>
//               Join Our Mission
//             </Button>
//           </nav>
//           {/* Auth Buttons */}
//           <div className="hidden md:flex items-center space-x-4">
//             <span className="text-sm text-muted-foreground">Hello, {username}</span>
//             {isLoggedIn ? (
//               <Button
//                 onClick={() => {
//                   localStorage.removeItem("jwtToken");
//                   localStorage.removeItem("userEmail");
//                   localStorage.removeItem("userId");
//                   localStorage.removeItem("userName");
//                   window.location.href = '/'; // רענון עמוד אחרי יציאה
//                 }}
//                 variant="outline"
//               >
//                 Sign Out
//               </Button>
//             ) : (
//               <Link to="/login">
//                 <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg">
//                   Sign In
//                 </Button>
//               </Link>
//             )}
//           </div>
//           {/* Mobile menu button */}
//           {/* <button className="md:hidden text-foreground" onClick={() => setIsMenuOpen(!isMenuOpen)}>
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//             </svg>
//           </button> */}
//         </div>
//       </div>
//     </div>
//   </header>;
// };

// export default Header;











// // כולל רספונסיביות

// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Button } from "../components/UI/Button/button";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/UI/dropdown-menu";
// import { ChevronDown, Menu } from "lucide-react"; // <-- הוסף את Menu לאייקון המבורגר

// const Header = ({
//   framed = true
// }: {
//   framed?: boolean;
// }) => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false); // זה עדיין שימושי, אבל הפעם עבור ה-DropdownMenu במובייל
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [username, setUsername] = useState("Guest");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkAuth = () => {
//       const token = localStorage.getItem("jwtToken");
//       const storedUsername = localStorage.getItem("userName");
//       setIsLoggedIn(!!token);
//       setUsername(storedUsername || "Guest");
//     };

//     checkAuth(); // בדיקה ראשונית

//     window.addEventListener("storage", checkAuth); // מאזין לשינויים ב-localStorage

//     // בדיקה מחזורית באותו טאבים (כדי לתפוס שינויים מקומיים)
//     const interval = setInterval(checkAuth, 500);

//     return () => {
//       window.removeEventListener("storage", checkAuth);
//       clearInterval(interval);
//     };
//   }, []);

//   const handleJoinMissionClick = () => {
//     navigate('/');
//     setTimeout(() => {
//       const contributionSection = document.querySelector('section:has(#donation-form)');
//       if (contributionSection) {
//         contributionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
//       }
//     }, 100);
//   };

//   const headerClass = framed ? "fixed top-0 left-0 right-0 z-50 bg-background backdrop-blur-md" : "fixed top-0 left-0 right-0 z-50 bg-background";

//   return (
//     <header className={headerClass}>
//       <div className="w-full py-4">
//         <div className="max-w-screen-2xl mx-auto px-6">
//           <div className="flex items-center justify-between">
//             {/* Logo */}
//             <Link to="/" className="flex items-center">
//               <div className="w-16 h-16 flex items-center justify-center">
//                 <img src="/Logo.png" alt="JustLaw Logo" className="w-full h-full object-contain brightness-0 invert" />
//               </div>
//             </Link>
//             {/* Navigation (Desktop) */}
//             <nav className="hidden md:flex items-center space-x-4">
//               <Link to="/">
//                 <Button variant="ghost" className="text-foreground transition-colors">
//                   Home
//                 </Button>
//               </Link>
//               <Link to="/about">
//                 <Button variant="ghost" className="text-foreground transition-colors">
//                   About
//                 </Button>
//               </Link>
//               <Link to='/justicetech-map'>
//                 <Button variant="ghost" className="text-foreground transition-colors">
//                   JusticeTech Global Map
//                 </Button>
//               </Link>
//               <Link to="/Form/contactEmail">
//                 <Button variant="ghost" className="text-foreground transition-colors">
//                   Contact
//                 </Button>
//               </Link>
//               <Link to="/treaty">
//                 <Button variant="ghost" className="text-foreground transition-colors">
//                   ATJ Treaty
//                 </Button>
//               </Link>
//               <Button variant="ghost" className="text-foreground transition-colors" onClick={handleJoinMissionClick}>
//                 Join Our Mission
//               </Button>
//             </nav>

//             {/* Auth Buttons (Desktop) */}
//             <div className="hidden md:flex items-center space-x-4">
//               <span className="text-sm text-muted-foreground">Hello, {username}</span>
//               {isLoggedIn ? (
//                 <Button
//                   onClick={() => {
//                     localStorage.removeItem("jwtToken");
//                     localStorage.removeItem("userEmail");
//                     localStorage.removeItem("userId");
//                     localStorage.removeItem("userName");
//                     window.location.href = '/'; // רענון עמוד אחרי יציאה
//                   }}
//                   variant="outline"
//                 >
//                   Sign Out
//                 </Button>
//               ) : (
//                 <Link to="/login">
//                   <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg">
//                     Sign In
//                   </Button>
//                 </Link>
//               )}
//             </div>

//             {/* Mobile menu button / DropdownMenu */}
//             <div className="md:hidden flex items-center"> {/* זה גלוי רק במובייל */}
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="outline" size="icon" className="h-9 w-9"> {/* כפתור המבורגר */}
//                     <Menu className="h-5 w-5" />
//                     <span className="sr-only">Toggle menu</span>
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-56"> {/* התוכן של תפריט המובייל */}
//                   <DropdownMenuItem asChild>
//                     <Link to="/">Home</Link>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem asChild>
//                     <Link to="/about">About</Link>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem asChild>
//                     <Link to="/justicetech-map">JusticeTech Global Map</Link>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem asChild>
//                     <Link to="/Form/contactEmail">Contact</Link>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem asChild>
//                     <Link to="/treaty">ATJ Treaty</Link>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={handleJoinMissionClick}>
//                     Join Our Mission
//                   </DropdownMenuItem>
//                   {isLoggedIn ? (
//                     <>
//                       <DropdownMenuItem className="opacity-50 cursor-default">
//                         <span>Hello, {username}</span>
//                       </DropdownMenuItem>
//                       <DropdownMenuItem
//                         onClick={() => {
//                           localStorage.removeItem("jwtToken");
//                           localStorage.removeItem("userEmail");
//                           localStorage.removeItem("userId");
//                           localStorage.removeItem("userName");
//                           window.location.href = '/';
//                         }}
//                       >
//                         Sign Out
//                       </DropdownMenuItem>
//                     </>
//                   ) : (
//                     <DropdownMenuItem asChild>
//                       <Link to="/login">Sign In</Link>
//                     </DropdownMenuItem>
//                   )}
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;









// כולל רספונסיביות כוול המצג של המשתמש אם הוא מחובר
// כולל רספונסיביות

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/UI/Button/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/UI/dropdown-menu";
import { Menu } from "lucide-react";
import LanguageSwitcher from '../i18n/LanguageSwitcher';

const Header = ({
  framed = true
}: {
  framed?: boolean;
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("Guest");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("jwtToken");
      const storedUsername = localStorage.getItem("userName");
      setIsLoggedIn(!!token);
      setUsername(storedUsername || "Guest");
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);

    const interval = setInterval(checkAuth, 500);

    return () => {
      window.removeEventListener("storage", checkAuth);
      clearInterval(interval);
    };
  }, []);

  const handleJoinMissionClick = () => {
    navigate('/');
    setTimeout(() => {
      const contributionSection = document.querySelector('section:has(#donation-form)');
      if (contributionSection) {
        contributionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const headerClass = framed ? "fixed top-0 left-0 right-0 z-50 bg-background backdrop-blur-md" : "fixed top-0 left-0 right-0 z-50 bg-background";

  return (
    <header className={headerClass}>
      <div className="w-full py-4">
        <div className="max-w-screen-2xl mx-auto px-6">
          {/* Main Header Flex Container: justify-between for desktop */}
          <div className="flex items-center justify-between">
           
            {/* START: Mobile Left Side - Hamburger Menu & Logo (Grouped, visible only in mobile) */}
            <div className="flex items-center gap-2 md:hidden">
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-36">
                   <LanguageSwitcher/>
                  <DropdownMenuItem asChild><Link to="/">Home</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/about">About</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/justicetech-map">JusticeTech Global Map</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/contactEmail">Contact</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/treaty">ATJ Treaty</Link></DropdownMenuItem>
                  <DropdownMenuItem onClick={handleJoinMissionClick}>Join Our Mission</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link to="/" className="flex items-center">
                <div className="w-16 h-16 flex items-center justify-center">
                  <img src="/Logo.png" alt="JustLaw Logo" className="w-full h-full object-contain brightness-0 invert" />
                </div>
              </Link>
            </div>
            {/* END: Mobile Left Side */}


            {/* START: Desktop Left (Logo) - visible only on md and above */}
            <Link to="/" className="hidden md:flex items-center"> {/* הלוגו של הדסקטופ */}
              <div className="w-16 h-16 flex items-center justify-center">
                <img src="/Logo.png" alt="JustLaw Logo" className="w-full h-full object-contain brightness-0 invert" />
              </div>
            </Link>
            {/* END: Desktop Left (Logo) */}


            {/* START: Desktop Center (Navigation) - visible only on md and above */}
            <nav className="hidden md:flex items-center space-x-4"> {/* הניווט של הדסקטופ במרכז */}
               <LanguageSwitcher/>
              <Link to="/"><Button variant="ghost" className="text-foreground transition-colors">Home</Button></Link>
              <Link to="/about"><Button variant="ghost" className="text-foreground transition-colors">About</Button></Link>
              <Link to='/justicetech-map'><Button variant="ghost" className="text-foreground transition-colors">JusticeTech Global Map</Button></Link>
              <Link to="/contactEmail"><Button variant="ghost" className="text-foreground transition-colors">Contact</Button></Link>
              <Link to="/treaty"><Button variant="ghost" className="text-foreground transition-colors">ATJ Treaty</Button></Link>
              {/* <Link to="/admin/tags"><Button variant="ghost" className="text-foreground transition-colors">Tag Management</Button></Link> */}
              <Button variant="ghost" className="text-foreground transition-colors" onClick={handleJoinMissionClick}>Join Our Mission</Button>
            </nav>
            {/* END: Desktop Center (Navigation) */}


            {/* START: Right Side - Auth/User Info (Always on right, adapts for mobile/desktop) */}
            <div className="flex items-center">
              {isLoggedIn ? (
                <>
                  {/* מבנה למובייל בלבד: כפתור מעל שם משתמש */}
                  <div className="flex flex-col items-end md:hidden">
                    <Button
                      onClick={() => {
                        // שרהלה
                        // ניקוי כל הטיוטות של מילוי פרופיל מה-localStorage
                        Object.keys(localStorage).forEach((key) => {
                          if (key.startsWith("profile_form_draft_")) {
                            localStorage.removeItem(key);
                            localStorage.removeItem(`${key}_last_saved`);
                            localStorage.removeItem(`${key}_backup`);
                            localStorage.removeItem(`${key}_deleted`);
                          }
                        });
                        
                        // מחיקת נתוני משתמש
                        localStorage.removeItem("jwtToken");
                        localStorage.removeItem("userEmail");
                        localStorage.removeItem("userId");
                        localStorage.removeItem("userName");
                        
                        window.location.href = '/';
                      }}
                      variant="outline"
                    >
                      Sign Out
                    </Button>
                    <span className="text-xs text-muted-foreground mt-1">Hello, {username}</span>
                  </div>

                  {/* מבנה לדסקטופ בלבד: שם משתמש ליד כפתור */}
                  <div className="hidden md:flex items-center space-x-4">
                    <span className="text-sm text-muted-foreground">Hello, {username}</span>
                    <Button
                      onClick={() => {
                        // שרהלה
                        // ניקוי כל הטיוטות של מילוי פרופיל מה-localStorage
                        Object.keys(localStorage).forEach((key) => {
                          if (key.startsWith("profile_form_draft_")) {
                            localStorage.removeItem(key);
                            localStorage.removeItem(`${key}_last_saved`);
                            localStorage.removeItem(`${key}_backup`);
                            localStorage.removeItem(`${key}_deleted`);
                          }
                        });
                        
                        // מחיקת נתוני משתמש
                        localStorage.removeItem("jwtToken");
                        localStorage.removeItem("userEmail");
                        localStorage.removeItem("userId");
                        localStorage.removeItem("userName");
                        
                        window.location.href = '/';
                      }}
                      variant="outline"
                    >
                      Sign Out
                    </Button>
                  </div>
                </>
              ) : (
                // אם לא מחובר: הצג כפתור התחברות בלבד
                <Link to="/login">
                  <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
            {/* END: Right Side - Auth/User Info */}

          </div> {/* End of flex items-center justify-between */}
        </div>
      </div>
    </header>
  );
};

export default Header;