import { Section } from "@/components/Sections";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <Section title="Contact" eyebrow="We'd love to help">
        <form className="space-y-6 animate-fade-in">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input 
                id="firstName"
                className="transition-all duration-200 hover:shadow-md focus:scale-[1.02]" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input 
                id="lastName"
                className="transition-all duration-200 hover:shadow-md focus:scale-[1.02]" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              type="email" 
              className="transition-all duration-200 hover:shadow-md focus:scale-[1.02]" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input 
              id="company"
              className="transition-all duration-200 hover:shadow-md focus:scale-[1.02]" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">How can we help?</Label>
            <Textarea 
              id="message"
              rows={5} 
              className="transition-all duration-200 hover:shadow-md focus:scale-[1.02]" 
            />
          </div>
          <div className="flex items-center justify-between pt-4">
            <div className="text-xs text-muted-foreground">
              By submitting, you agree to our privacy policy.
            </div>
            <Button className="hover-scale">
              Send message
            </Button>
          </div>
        </form>
      </Section>
    </div>
  );
}