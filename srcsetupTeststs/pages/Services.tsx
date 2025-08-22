import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Settings, Zap, ArrowRight } from "lucide-react";

const ServicesPage = () => {
  const services = [
    {
      icon: Settings,
      title: "Automation",
      description: "Streamline your workflows with intelligent automation solutions that reduce manual work and increase efficiency.",
      features: ["Workflow Automation", "Process Optimization", "Task Scheduling", "Smart Triggers"]
    },
    {
      icon: MessageCircle,
      title: "Custom AI Agents",
      description: "24/7 virtual assistants built for your brand that understand your business and serve your customers.",
      features: ["Brand-Aligned Responses", "Multi-Channel Support", "Learning Capabilities", "Custom Knowledge Base"]
    },
    {
      icon: Zap,
      title: "Integrations",
      description: "Connect all your tools and platforms for seamless data flow and unified operations.",
      features: ["API Integrations", "Data Synchronization", "Cross-Platform Workflows", "Real-time Updates"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background via-accent/5 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Our Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Comprehensive AI solutions designed to transform your business operations and drive growth through intelligent automation.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card 
                  key={index} 
                  className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-accent/20 hover:border-accent/40 bg-card/80 backdrop-blur-sm h-full"
                >
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="h-8 w-8 text-white" strokeWidth={2} />
                    </div>
                    <CardTitle className="text-2xl font-semibold text-foreground group-hover:text-accent transition-colors">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <CardDescription className="text-muted-foreground leading-relaxed mb-6">
                      {service.description}
                    </CardDescription>
                    <ul className="space-y-2 mb-6 flex-1">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-foreground/80">
                          <div className="w-2 h-2 bg-accent rounded-full mr-3" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-accent group-hover:text-accent-foreground transition-colors"
                    >
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let's discuss how our AI solutions can help streamline your operations and drive growth.
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold px-8 py-4 text-lg"
          >
            Get a Demo
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;