import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, ShoppingCart, Calendar } from "lucide-react";

const Portfolio = () => {
  const projects = [
    {
      icon: MessageSquare,
      title: "AI Brand Assistant for a Coaching Business",
      description: "Intelligent chatbot that captures leads, answers common questions, and schedules consultations while maintaining the coach's personal brand voice.",
      category: "Coaching & Consulting"
    },
    {
      icon: ShoppingCart,
      title: "Automated Lead Capture for an Etsy Store",
      description: "Smart system that identifies potential customers, captures their preferences, and nurtures them through personalized follow-up sequences.",
      category: "E-commerce"
    },
    {
      icon: Calendar,
      title: "Custom Ritual Planner for Spiritual Entrepreneurs",
      description: "Personalized AI that creates custom spiritual practices, tracks client progress, and provides guided experiences based on individual needs.",
      category: "Wellness & Spirituality"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-accent/5 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Example Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover what's possible with custom AI solutions tailored to your industry
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {projects.map((project, index) => {
            const IconComponent = project.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-accent/20 hover:border-accent/40 bg-card/90 backdrop-blur-sm h-full"
              >
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 mb-4 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="h-6 w-6 text-white" strokeWidth={2} />
                  </div>
                  <div className="text-xs font-medium text-accent mb-2 uppercase tracking-wide">
                    {project.category}
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground group-hover:text-accent transition-colors leading-tight">
                    {project.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {project.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            Ready to see your vision come to life? Let's discuss your project.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;