import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Footer = () => {
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

  return (
    <footer className="py-16 px-6 border-t border-border">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Description */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-12 h-12 flex items-center justify-center">
                <img src="/Logo.png" alt="JustLaw Logo" className="w-full h-full object-contain brightness-0 invert" />
              </div>
              <span className="text-xl font-bold text-primary">JustLaw</span>
            </div>
            <p className="text-muted-foreground mb-6">
              Revolutionizing access to justice through technology innovation.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
              </div>
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Platform - מוצג רק למשתמשים מחוברים */}
          {isLoggedIn && (
            <div className="flex flex-col text-left">
              <h4 className="font-bold text-primary mb-4">Platform</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><Link to="/accelerator" className="hover:text-foreground transition-colors">Global Accelerator</Link></li>
                <li><Link to="/knowledge-hub" className="hover:text-foreground transition-colors">Knowledge Hub</Link></li>
                <li><Link to="/stakeholders-directory" className="hover:text-foreground transition-colors">Stakeholders Directory</Link></li>
                {/* <li><Link to="/coming-soon" className="hover:text-foreground transition-colors">Apply Now</Link></li> */}
                <li><Link to="/cancel-standing-order" className="hover:text-foreground transition-colors">Canceling a standing order</Link></li>

              </ul>
            </div>
          )}

          {/* Resources */}
          <div className="flex flex-col text-left">
            <h4 className="font-bold text-primary mb-4">Resources</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li><a href="coming-soon" className="hover:text-foreground transition-colors">Research Papers</a></li>
              <li><a href="coming-soon" className="hover:text-foreground transition-colors">Case Studies</a></li>
              <li><a href="coming-soon" className="hover:text-foreground transition-colors">Best Practices</a></li>
              <li><a href="coming-soon" className="hover:text-foreground transition-colors">Industry Reports</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="flex flex-col text-left">
            <h4 className="font-bold text-primary mb-4">Company</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link to="/about" className="hover:text-foreground transition-colors">Our Team</Link></li>
              <li><a href="coming-soon" className="hover:text-foreground transition-colors">Careers</a></li>
              <li><Link to="/Form/contactEmail" className="hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground mb-4 md:mb-0">
              © 2025 JustLaw. All rights reserved.
            </p>
            <div className="flex space-x-6 text-muted-foreground">
              {/* <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a> */}
              <button className="hover:text-foreground transition-colors" onClick={() => {/* handle action */}}>Privacy Policy</button>
              <button className="hover:text-foreground transition-colors" onClick={() => {/* handle action */}}>Terms of Service</button>
              <button className="hover:text-foreground transition-colors" onClick={() => {/* handle action */}}>Cookie Policy</button>


            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;