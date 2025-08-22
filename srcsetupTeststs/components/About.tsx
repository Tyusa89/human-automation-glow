const About = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            Why EcoNest AI Exists
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
            We believe automation should be as intuitive and human as the people it serves. 
            EcoNest AI designs intelligent systems that save you time, expand your reach, 
            and give you the freedom to focus on what truly matters.
          </p>
          
          {/* Visual accent elements */}
          <div className="flex justify-center items-center space-x-4 mt-12">
            <div className="h-1 w-16 bg-gradient-to-r from-primary to-accent rounded-full"></div>
            <div className="w-3 h-3 bg-accent rounded-full"></div>
            <div className="h-1 w-16 bg-gradient-to-l from-primary to-accent rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;