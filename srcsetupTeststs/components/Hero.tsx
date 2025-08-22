import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-accent/5 to-primary/10" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              EcoNest AI
            </span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-muted-foreground font-medium mb-12 leading-relaxed">
            Automation That Feels Human
          </p>
          
          <p className="text-lg md:text-xl text-foreground/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            At EcoNest AI, we design intelligent systems that work the way you do — with efficiency, clarity, and a human touch. From custom AI agents to automated workflows, we help creators, coaches, and businesses save time, reduce stress, and focus on what truly matters.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/contact">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105"
              >
                Get a Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-accent text-accent hover:bg-accent hover:text-white font-semibold px-8 py-4 text-lg transition-all duration-300"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-accent/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-1/4 right-10 w-48 h-48 bg-primary/10 rounded-full blur-xl animate-pulse delay-1000" />
    </section>
  );
};

export default Hero;