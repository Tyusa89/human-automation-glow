import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BookOpen, 
  Layers, 
  Plug, 
  Lightbulb, 
  Package, 
  Shield, 
  Users, 
  HelpCircle,
  ArrowRight,
  Rocket,
  FileText
} from "lucide-react";

const docSections = [
  {
    title: "Getting Started",
    description: "New to EcoNest? Start here to learn the basics and get up and running quickly.",
    icon: Rocket,
    href: "/docs/getting-started",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50"
  },
  {
    title: "Templates",
    description: "Learn how to browse, deploy, and customize production-ready templates.",
    icon: Layers,
    href: "/docs/templates",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    subLinks: [
      { label: "How Templates Work", href: "/docs/templates" },
      { label: "Beginner Templates", href: "/docs/templates#beginner" },
      { label: "Advanced Templates", href: "/docs/templates#advanced" }
    ]
  },
  {
    title: "Integrations",
    description: "Connect EcoNest to your favorite tools and services.",
    icon: Plug,
    href: "/docs/integrations",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    subLinks: [
      { label: "Connecting Tools", href: "/docs/integrations#connecting" },
      { label: "API & Webhooks", href: "/docs/integrations#api" }
    ]
  },
  {
    title: "Solutions",
    description: "Pre-built solutions for Sales, Support, and Operations teams.",
    icon: Lightbulb,
    href: "/docs/solutions",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    subLinks: [
      { label: "Sales", href: "/docs/solutions#sales" },
      { label: "Support", href: "/docs/solutions#support" },
      { label: "Operations", href: "/docs/solutions#operations" }
    ]
  },
  {
    title: "Products",
    description: "Deep dive into EcoNest's core product features and capabilities.",
    icon: Package,
    href: "/docs/products",
    color: "text-rose-600",
    bgColor: "bg-rose-50"
  },
  {
    title: "Roles & Permissions",
    description: "Understand user roles, access controls, and permission management.",
    icon: Shield,
    href: "/docs/roles",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50"
  },
  {
    title: "Owner & Admin Guide",
    description: "Advanced configuration and management for workspace owners and admins.",
    icon: Users,
    href: "/docs/admin",
    color: "text-teal-600",
    bgColor: "bg-teal-50"
  },
  {
    title: "Troubleshooting",
    description: "Common issues, FAQs, and how to get help when you need it.",
    icon: HelpCircle,
    href: "/docs/troubleshooting",
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  }
];

export default function DocsHub() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-50 via-background to-background border-b">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-6">
              <BookOpen className="h-4 w-4" />
              Documentation
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              EcoNest Guides & Documentation
            </h1>
            <p className="text-lg text-muted-foreground">
              Everything you need to understand, deploy, and scale with EcoNest. 
              One place for all your learning needs.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link 
            to="/docs/templates" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <FileText className="h-4 w-4" />
            Templates Guide
          </Link>
          <Link 
            to="/docs/getting-started" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
          >
            <Rocket className="h-4 w-4" />
            Quick Start
          </Link>
          <Link 
            to="/docs/troubleshooting" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
          >
            <HelpCircle className="h-4 w-4" />
            Get Help
          </Link>
        </div>

        {/* Documentation Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docSections.map((section) => (
            <Link key={section.title} to={section.href} className="group">
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-primary/30">
                <CardHeader>
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${section.bgColor} ${section.color} mb-4`}>
                    <section.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
                    {section.title}
                    <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                {section.subLinks && (
                  <CardContent className="pt-0">
                    <ul className="space-y-1 text-sm">
                      {section.subLinks.map((link) => (
                        <li key={link.label} className="text-muted-foreground hover:text-foreground">
                          → {link.label}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                )}
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h2>
          <p className="text-muted-foreground mb-6">
            Our support team is here to help. Reach out and we'll get you sorted.
          </p>
          <Link 
            to="/contact" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Contact Support
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
