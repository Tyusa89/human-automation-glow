import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="w-full bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/5fd0e2db-d0a1-4acb-b206-80402fcc72fd.png" 
            alt="EcoNest AI" 
            className="h-10 w-auto"
          />
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-foreground hover:text-accent transition-colors">
            Features
          </a>
          <a href="#about" className="text-foreground hover:text-accent transition-colors">
            About
          </a>
          <a href="#contact" className="text-foreground hover:text-accent transition-colors">
            Contact
          </a>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-foreground hover:text-accent">
            Sign In
          </Button>
          <Button variant="default">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;