import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import LeadForm from '@/components/LeadForm';

const ContactPage = () => {
  const { toast } = useToast();

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "hello@econestai.com",
      link: "mailto:hello@econestai.com"
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+1 (555) 123-4567",
      link: "tel:+15551234567"
    },
    {
      icon: MapPin,
      title: "Location",
      content: "Remote-First Company",
      link: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background via-accent/5 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Get In Touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to transform your business with AI? Let's discuss how we can help you automate workflows, build custom AI agents, and integrate your systems.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                Start Your AI Journey
              </h2>
              <p className="text-muted-foreground mb-8">
                Fill out the form below and we'll get back to you within 24 hours with a custom proposal for your project.
              </p>
              
              <LeadForm />
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                Contact Information
              </h2>
              <p className="text-muted-foreground mb-8">
                Prefer to reach out directly? Use any of the methods below to connect with our team.
              </p>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon;
                  return (
                    <Card key={index} className="border-accent/20 hover:border-accent/40 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground mb-1">
                              {info.title}
                            </h3>
                            <a 
                              href={info.link}
                              className="text-muted-foreground hover:text-accent transition-colors"
                            >
                              {info.content}
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Office Hours */}
              <Card className="mt-8 border-accent/20">
                <CardHeader>
                  <CardTitle className="text-foreground">Office Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-muted-foreground">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM PST</p>
                    <p>Saturday: 10:00 AM - 2:00 PM PST</p>
                    <p>Sunday: Closed</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;