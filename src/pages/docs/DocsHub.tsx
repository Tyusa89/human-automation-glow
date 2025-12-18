import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Search,
  FileText,
  Settings,
  MessageCircle,
  Sparkles
} from "lucide-react";

const docSections = [
  {
    title: "Getting Started",
    description: "Learn the basics of EcoNest, navigation, and core concepts.",
    icon: Rocket,
    href: "/docs/getting-started",
    color: "text-emerald-600",
    bgColor: "bg-emerald-100"
  },
  {
    title: "Templates",
    description: "How templates work, when to use them, and how to customize safely.",
    icon: Layers,
    href: "/docs/templates",
    color: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  {
    title: "Integrations",
    description: "Connect tools, APIs, webhooks, and external services.",
    icon: Plug,
    href: "/docs/integrations",
    color: "text-purple-600",
    bgColor: "bg-purple-100"
  },
  {
    title: "Solutions",
    description: "Prebuilt use cases for sales, support, operations, and growth.",
    icon: Lightbulb,
    href: "/docs/solutions",
    color: "text-amber-600",
    bgColor: "bg-amber-100"
  },
  {
    title: "Products",
    description: "Understand EcoNest products, features, and capabilities.",
    icon: Package,
    href: "/docs/products",
    color: "text-rose-600",
    bgColor: "bg-rose-100"
  },
  {
    title: "Owner & Admin",
    description: "Permissions, roles, billing, security, and platform control.",
    icon: Shield,
    href: "/docs/admin",
    color: "text-indigo-600",
    bgColor: "bg-indigo-100"
  }
];

const popularGuides = [
  { title: "How Templates Work", href: "/docs/templates", tag: "Essential" },
  { title: "Deploying Your First Automation", href: "/docs/getting-started", tag: "Beginner" },
  { title: "Connecting Integrations Safely", href: "/docs/integrations", tag: "Setup" },
  { title: "Beginner vs Advanced Templates", href: "/docs/templates#beginner", tag: "Guide" },
  { title: "Managing Roles & Permissions", href: "/docs/admin", tag: "Admin" },
  { title: "Troubleshooting Common Issues", href: "/docs/troubleshooting", tag: "Support" }
];

const roleFilters = [
  { id: "builder", label: "Builder", icon: Users, description: "Build and customize workflows" },
  { id: "admin", label: "Admin", icon: Settings, description: "Manage settings and users" },
  { id: "owner", label: "Owner", icon: Shield, description: "Full platform control" }
];

const roleGuides: Record<string, { title: string; href: string }[]> = {
  builder: [
    { title: "Getting Started with Templates", href: "/docs/templates" },
    { title: "Connecting Your First Integration", href: "/docs/integrations" },
    { title: "Building Custom Workflows", href: "/docs/solutions" }
  ],
  admin: [
    { title: "Managing Team Permissions", href: "/docs/admin" },
    { title: "Integration Security Best Practices", href: "/docs/integrations#api" },
    { title: "Audit Logs & Compliance", href: "/docs/admin" }
  ],
  owner: [
    { title: "Platform Overview & Billing", href: "/docs/admin" },
    { title: "Security & Access Control", href: "/docs/admin" },
    { title: "Scaling Your Organization", href: "/docs/solutions" }
  ]
};

export default function DocsHub() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const filteredSections = docSections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
        
        <div className="container relative mx-auto px-4 py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8">
              <BookOpen className="h-4 w-4" />
              Documentation
            </div>
            
            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
              EcoNest Guides & Documentation
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              Everything you need to build, automate, and scale with EcoNest.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
              <Input
                type="text"
                placeholder="Search guides, templates, integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-6 text-base bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        
        {/* Quick Entry Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {filteredSections.map((section) => (
            <Link key={section.title} to={section.href} className="group">
              <Card className="h-full bg-slate-800/50 border-slate-700/50 hover:border-emerald-500/30 hover:bg-slate-800 transition-all duration-300">
                <CardHeader>
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${section.bgColor} ${section.color} mb-4 group-hover:scale-110 transition-transform`}>
                    <section.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-white flex items-center gap-2 group-hover:text-emerald-400 transition-colors">
                    {section.title}
                    <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </CardTitle>
                  <CardDescription className="text-slate-400">{section.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        {/* Visual Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-20" />

        {/* Popular Guides Section */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="h-6 w-6 text-emerald-400" />
            <h2 className="text-2xl font-bold text-white">Popular Guides</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularGuides.map((guide) => (
              <Link 
                key={guide.title} 
                to={guide.href}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-emerald-500/30 hover:bg-slate-800/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                  <span className="text-slate-300 group-hover:text-white transition-colors">{guide.title}</span>
                </div>
                <Badge variant="secondary" className="bg-slate-700/50 text-slate-400 text-xs">
                  {guide.tag}
                </Badge>
              </Link>
            ))}
          </div>
        </div>

        {/* Visual Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-20" />

        {/* Role-Based Help Section */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <Users className="h-6 w-6 text-emerald-400" />
            <h2 className="text-2xl font-bold text-white">Guides by Role</h2>
          </div>

          {/* Role Pills */}
          <div className="flex flex-wrap gap-3 mb-8">
            {roleFilters.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(selectedRole === role.id ? null : role.id)}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl border transition-all ${
                  selectedRole === role.id
                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                    : "bg-slate-800/30 border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                }`}
              >
                <role.icon className="h-4 w-4" />
                {role.label}
              </button>
            ))}
          </div>

          {/* Role-specific guides */}
          {selectedRole && (
            <Card className="bg-slate-800/30 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white text-lg">
                  Recommended for {roleFilters.find(r => r.id === selectedRole)?.label}s
                </CardTitle>
                <CardDescription className="text-slate-400">
                  {roleFilters.find(r => r.id === selectedRole)?.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {roleGuides[selectedRole].map((guide) => (
                    <li key={guide.title}>
                      <Link 
                        to={guide.href}
                        className="flex items-center gap-3 text-slate-300 hover:text-emerald-400 transition-colors"
                      >
                        <ArrowRight className="h-4 w-4" />
                        {guide.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {!selectedRole && (
            <p className="text-slate-500 text-sm">Select a role above to see recommended guides.</p>
          )}
        </div>

        {/* Visual Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-20" />

        {/* Footer CTA */}
        <div className="text-center max-w-2xl mx-auto">
          <HelpCircle className="h-12 w-12 text-slate-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Still need help?</h2>
          <p className="text-slate-400 mb-8">
            Our team is here to assist you. Reach out through any of these channels.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Link to="/contact">
                <MessageCircle className="mr-2 h-4 w-4" />
                Contact Support
              </Link>
            </Button>
            <Button variant="outline" asChild className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
              <Link to="/docs/troubleshooting">
                <HelpCircle className="mr-2 h-4 w-4" />
                View FAQ
              </Link>
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
