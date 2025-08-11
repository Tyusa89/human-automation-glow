import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/functions/v1/contact-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        reset();
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again or contact us directly at hello@econestai.com",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <section className="py-20 bg-accent text-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Let's Build Something Amazing Together
            </h2>
            <p className="text-lg text-primary/80 max-w-2xl mx-auto">
              Ready to transform your business with AI? Get in touch and let's discuss your project.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-primary flex items-center">
                  <Send className="mr-2 h-6 w-6" />
                  {isSubmitted ? "Thank You!" : "Send Us a Message"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {isSubmitted ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Send className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-primary mb-4">
                      Thank you for contacting EcoNest AI.
                    </h3>
                    <p className="text-primary/80 leading-relaxed space-y-2">
                      <span className="block">Your message is on its way to our team.</span>
                      <span className="block">We'll reply within 1–2 business days with next steps.</span>
                      <span className="block">In the meantime, feel free to explore our services and see how we can make automation feel human.</span>
                    </p>
                    <Button 
                      onClick={() => setIsSubmitted(false)}
                      variant="outline"
                      className="mt-6 border-primary/20 text-primary hover:bg-primary/5"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-primary font-medium">
                        Name
                      </Label>
                      <Input 
                        id="name" 
                        type="text" 
                        placeholder="Your full name"
                        className="border-primary/20 focus:border-primary/40 bg-white/80"
                        {...register("name")}
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive">{errors.name.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-primary font-medium">
                        Email
                      </Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="your@email.com"
                        className="border-primary/20 focus:border-primary/40 bg-white/80"
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-primary font-medium">
                        Message
                      </Label>
                      <Textarea 
                        id="message" 
                        placeholder="Tell us about your project and how we can help..."
                        rows={5}
                        className="border-primary/20 focus:border-primary/40 bg-white/80 resize-none"
                        {...register("message")}
                      />
                      {errors.message && (
                        <p className="text-sm text-destructive">{errors.message.message}</p>
                      )}
                    </div>
                    
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      size="lg"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Request
                          <Send className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
            
            {/* Direct Contact Info */}
            <div className="space-y-8">
              <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-primary flex items-center">
                    <Mail className="mr-2 h-6 w-6" />
                    Direct Contact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-primary/80 mb-4 leading-relaxed">
                    Prefer to reach out directly? Send us an email and we'll get back to you within 24 hours.
                  </p>
                  <a 
                    href="mailto:hello@econestai.com"
                    className="inline-flex items-center text-xl font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    hello@econestai.com
                    <Mail className="ml-2 h-5 w-5" />
                  </a>
                </CardContent>
              </Card>
              
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg">
                <h3 className="text-xl font-semibold text-primary mb-3">
                  What Happens Next?
                </h3>
                <ul className="space-y-2 text-primary/80">
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    We'll review your project requirements
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Schedule a consultation call within 48 hours
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Provide a custom proposal and timeline
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;