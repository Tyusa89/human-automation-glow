import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Zap, Layout, Target } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Bot,
      title: "Custom AI Agents",
      description: "Chatbots and assistants designed for your brand and audience."
    },
    {
      icon: Zap,
      title: "Workflow Automation", 
      description: "Automate repetitive tasks so you can focus on growth."
    },
    {
      icon: Layout,
      title: "Dashboard Integration",
      description: "Link your tools into one clean, client-friendly interface."
    },
    {
      icon: Target,
      title: "AI Strategy Consulting",
      description: "Tailored guidance to align AI with your goals."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-accent/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive AI solutions designed to transform your business operations
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-accent/20 hover:border-accent/40 bg-card/80 backdrop-blur-sm"
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="h-8 w-8 text-white" strokeWidth={2} />
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground group-hover:text-accent transition-colors">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;