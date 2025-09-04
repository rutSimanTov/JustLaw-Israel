import { Button } from "../components/UI/Button/button";
import { Link } from "react-router-dom";

const ComingSoon = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 pt-32 px-6 container mx-auto flex items-center justify-center">
        <div className="text-center max-w-2xl">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Coming Soon
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              We're working hard to bring you this feature. Stay tuned for updates!
            </p>
          </div>
          
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <Link to="/">
            <Button className="bg-primary hover:bg-primary/90 text-white">
              Back to Home
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default ComingSoon;