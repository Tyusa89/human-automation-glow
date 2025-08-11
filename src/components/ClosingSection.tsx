import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const ClosingSection = () => {
  return (
    <section className="py-20 px-4 bg-accent">
      <div className="container mx-auto text-center max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-accent-foreground">
          Ready to bring your ideas to life?
        </h2>
        
        <p className="text-lg md:text-xl mb-8 leading-relaxed text-accent-foreground/80">
          Let's build automation that feels human, designed just for you. Whether you're starting small or scaling big, EcoNest AI is here to make your vision work smarter.
        </p>
        
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105"
        >
          Start Your AI Project
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  );
};

export default ClosingSection;