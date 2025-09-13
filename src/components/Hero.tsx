import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import AIAgentDemo from "./AIAgentDemo";

const Hero = () => {
  console.log("Hero component rendering");
  return (
    <section className="relative overflow-hidden">
      {/* Soft background vignette */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 -bottom-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

      <div className="mx-auto max-w-4xl px-6 py-16 md:py-24 text-center animate-fade-in">
        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight
                       bg-gradient-to-r from-primary via-accent to-primary
                       bg-[length:200%_200%] bg-clip-text text-transparent
                       drop-shadow-sm hover-scale">
          EcoNest AI
        </h1>

        {/* Subheadline */}
        <p className="mt-6 text-lg md:text-2xl text-muted-foreground animate-fade-in [animation-delay:150ms]">
          Automation That Feels Human
          <span className="ml-2 inline-block h-[1.2em] w-[2px] align-[-0.1em] bg-primary/50 animate-pulse" />
        </p>

        {/* Underline accent */}
        <div className="mx-auto mt-6 h-[3px] w-28 rounded-full bg-gradient-to-r from-primary to-accent 
                        animate-scale-in [animation-delay:250ms]" />

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12 animate-fade-in [animation-delay:400ms]">
          <Link to="/contact">
            <Button 
              size="lg" 
              variant="default"
              className="font-semibold px-8 py-4 text-lg hover-scale"
            >
              Get a Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 font-semibold px-8 py-4 text-lg hover-scale"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl w-full h-[80vh]">
              <DialogTitle className="sr-only">EcoNest AI Agent Demo</DialogTitle>
              <DialogDescription className="sr-only">
                Experience our interactive AI agent demo to see EcoNest AI automation in action
              </DialogDescription>
              <AIAgentDemo onClose={() => {}} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};

export default Hero;