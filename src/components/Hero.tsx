import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  console.log("Hero component rendering");
  return (
    <section className="relative overflow-hidden">
      {/* Soft background vignette */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-emerald-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 -bottom-40 h-96 w-96 rounded-full bg-teal-300/20 blur-3xl" />

      <div className="mx-auto max-w-4xl px-6 py-24 text-center animate-fade-in">
        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight
                       bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-700
                       bg-[length:200%_200%] bg-clip-text text-transparent
                       drop-shadow-sm hover-scale">
          EcoNest AI
        </h1>

        {/* Subheadline */}
        <p className="mt-6 text-lg md:text-2xl text-emerald-900/70 animate-fade-in [animation-delay:150ms]">
          Automation That Feels Human
          <span className="ml-2 inline-block h-[1.2em] w-[2px] align-[-0.1em] bg-emerald-700/50 animate-pulse" />
        </p>

        {/* Underline accent */}
        <div className="mx-auto mt-6 h-[3px] w-28 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 
                        animate-scale-in [animation-delay:250ms]" />

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12 animate-fade-in [animation-delay:400ms]">
          <Link to="/contact">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 
                         text-white font-semibold px-8 py-4 text-lg hover-scale"
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
                className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white 
                           font-semibold px-8 py-4 text-lg hover-scale"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-full">
              <DialogTitle className="sr-only">EcoNest AI Demo Video</DialogTitle>
              <DialogDescription className="sr-only">
                Watch our demo video to see EcoNest AI automation in action
              </DialogDescription>
              <div className="aspect-video w-full">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="EcoNest AI Demo"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};

export default Hero;