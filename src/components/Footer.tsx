import { Button } from "@/components/ui/button";
import { Linkedin, Twitter, Instagram, Mail } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    {
      icon: Linkedin,
      href: "#",
      label: "LinkedIn"
    },
    {
      icon: Twitter,
      href: "#",
      label: "Twitter"
    },
    {
      icon: Instagram,
      href: "#",
      label: "Instagram"
    },
    {
      icon: Mail,
      href: "mailto:hello@econestai.com",
      label: "Email"
    }
  ];

  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          {/* Logo and Copyright */}
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <img 
              src="/lovable-uploads/5fd0e2db-d0a1-4acb-b206-80402fcc72fd.png" 
              alt="EcoNest AI" 
              className="h-8 w-auto opacity-90"
            />
            <p className="text-sm text-primary-foreground/80 text-center md:text-left">
              © 2025 EcoNest AI. All rights reserved.
            </p>
          </div>
          
          {/* Social Icons */}
          <div className="flex items-center space-x-4">
            {socialLinks.map((social, index) => {
              const IconComponent = social.icon;
              return (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-all duration-300"
                >
                  <a
                    href={social.href}
                    target={social.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={social.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                    aria-label={social.label}
                  >
                    <IconComponent className="h-5 w-5" />
                  </a>
                </Button>
              );
            })}
          </div>
        </div>
        
        {/* Divider */}
        <div className="mt-8 pt-8 border-t border-primary-foreground/20">
          <div className="text-center">
            <p className="text-xs text-primary-foreground/60">
              Automation That Feels Human
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;