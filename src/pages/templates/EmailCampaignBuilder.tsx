import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail,
  Users,
  BarChart3,
  Settings,
  Plus,
  Send,
  Eye,
  Edit,
  Trash2,
  Copy,
  Play,
  Pause,
  Target,
  Filter,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  Type,
  Palette,
  Layout,
  MousePointer,
  Zap,
  Database,
  Globe,
  Smartphone
} from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  subject: string;
  status: "draft" | "scheduled" | "sending" | "sent" | "paused";
  type: "regular" | "ab_test";
  audience: string;
  sendDate?: Date;
  stats?: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
  };
  abTest?: {
    variantA: { subject: string; content: string };
    variantB: { subject: string; content: string };
    testMetric: "open_rate" | "click_rate";
    splitPercentage: number;
  };
}

interface Segment {
  id: string;
  name: string;
  description: string;
  criteria: string[];
  contactCount: number;
  color: string;
}

interface Contact {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  tags: string[];
  status: "subscribed" | "unsubscribed" | "bounced";
  segments: string[];
  lastActivity?: Date;
}

export default function EmailCampaignBuilder() {
  const { toast } = useToast();
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [emailContent, setEmailContent] = useState("");
  const [emailSubject, setEmailSubject] = useState("");

  const [campaigns] = useState<Campaign[]>([
    {
      id: "1",
      name: "Welcome Series - Week 1",
      subject: "Welcome to EcoNest! 🌱",
      status: "sent",
      type: "regular",
      audience: "new_subscribers",
      sendDate: new Date("2024-01-10T10:00:00"),
      stats: {
        sent: 1250,
        delivered: 1235,
        opened: 487,
        clicked: 98,
        bounced: 15,
        unsubscribed: 3
      }
    },
    {
      id: "2",
      name: "Product Launch A/B Test",
      subject: "🚀 Introducing Our Latest Innovation",
      status: "sending",
      type: "ab_test",
      audience: "all_subscribers",
      sendDate: new Date("2024-01-15T14:00:00"),
      stats: {
        sent: 2340,
        delivered: 2298,
        opened: 0,
        clicked: 0,
        bounced: 42,
        unsubscribed: 0
      },
      abTest: {
        variantA: { subject: "🚀 Introducing Our Latest Innovation", content: "Variant A content" },
        variantB: { subject: "New Product Alert: Game-Changing Technology", content: "Variant B content" },
        testMetric: "open_rate",
        splitPercentage: 50
      }
    },
    {
      id: "3",
      name: "Monthly Newsletter",
      subject: "January 2024 Updates & Insights",
      status: "scheduled",
      type: "regular",
      audience: "active_subscribers",
      sendDate: new Date("2024-01-20T09:00:00")
    }
  ]);

  const [segments] = useState<Segment[]>([
    {
      id: "1",
      name: "New Subscribers",
      description: "Users who subscribed in the last 30 days",
      criteria: ["signup_date <= 30 days", "email_verified = true"],
      contactCount: 342,
      color: "bg-green-500"
    },
    {
      id: "2",
      name: "Active Customers",
      description: "Users with purchases in the last 90 days",
      criteria: ["last_purchase <= 90 days", "total_orders > 0"],
      contactCount: 1567,
      color: "bg-blue-500"
    },
    {
      id: "3",
      name: "High Value",
      description: "Customers with LTV > $500",
      criteria: ["lifetime_value > 500", "status = active"],
      contactCount: 234,
      color: "bg-purple-500"
    }
  ]);

  const [contacts] = useState<Contact[]>([
    {
      id: "1",
      email: "sarah@example.com",
      firstName: "Sarah",
      lastName: "Johnson",
      tags: ["premium", "early_adopter"],
      status: "subscribed",
      segments: ["2", "3"],
      lastActivity: new Date("2024-01-12")
    },
    {
      id: "2",
      email: "mike@example.com",
      firstName: "Mike",
      lastName: "Chen",
      tags: ["trial"],
      status: "subscribed",
      segments: ["1"],
      lastActivity: new Date("2024-01-14")
    }
  ]);

  const getStatusColor = (status: Campaign["status"]) => {
    switch (status) {
      case "sent": return "text-green-500";
      case "sending": return "text-blue-500";
      case "scheduled": return "text-yellow-500";
      case "draft": return "text-gray-500";
      case "paused": return "text-orange-500";
    }
  };

  const getStatusIcon = (status: Campaign["status"]) => {
    switch (status) {
      case "sent": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "sending": return <Play className="w-4 h-4 text-blue-500" />;
      case "scheduled": return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "draft": return <Edit className="w-4 h-4 text-gray-500" />;
      case "paused": return <Pause className="w-4 h-4 text-orange-500" />;
    }
  };

  const handleCreateCampaign = () => {
    setIsCreatingCampaign(true);
    setTimeout(() => {
      toast({
        title: "Campaign Created",
        description: "Your email campaign has been created successfully",
      });
      setIsCreatingCampaign(false);
    }, 1000);
  };

  const calculateOpenRate = (campaign: Campaign) => {
    if (!campaign.stats || campaign.stats.sent === 0) return 0;
    return Math.round((campaign.stats.opened / campaign.stats.sent) * 100);
  };

  const calculateClickRate = (campaign: Campaign) => {
    if (!campaign.stats || campaign.stats.opened === 0) return 0;
    return Math.round((campaign.stats.clicked / campaign.stats.opened) * 100);
  };

  const totalStats = campaigns.reduce((acc, campaign) => {
    if (campaign.stats) {
      acc.sent += campaign.stats.sent;
      acc.delivered += campaign.stats.delivered;
      acc.opened += campaign.stats.opened;
      acc.clicked += campaign.stats.clicked;
    }
    return acc;
  }, { sent: 0, delivered: 0, opened: 0, clicked: 0 });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              MARKETING
            </Badge>
            <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-red-500/30">
              ADVANCED
            </Badge>
          </div>
          <h1 className="text-4xl font-bold mb-2">Email Campaign Builder</h1>
          <p className="text-slate-400 text-lg">
            Create and send personalized email campaigns with A/B testing.
          </p>
          <div className="flex gap-2 mt-4">
            <Badge variant="secondary" className="bg-green-500 text-white">
              📝 Drag & drop editor
            </Badge>
            <Badge variant="secondary" className="bg-blue-500 text-white">
              🧪 A/B testing
            </Badge>
            <Badge variant="secondary" className="bg-purple-500 text-white">
              🎯 Segmentation
            </Badge>
            <Badge variant="secondary" className="bg-orange-500 text-white">
              📧 Email provider (SendGrid/Mailgun/Postmark)
            </Badge>
            <Badge variant="secondary" className="bg-cyan-500 text-white">
              👥 Contacts DB/CRM
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
            <TabsTrigger value="campaigns" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="editor" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="audience" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Audience
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Email Campaigns</h2>
              <Button onClick={handleCreateCampaign} disabled={isCreatingCampaign} className="bg-purple-600 hover:bg-purple-700">
                {isCreatingCampaign ? "Creating..." : "Create Campaign"}
                <Plus className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Total Sent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalStats.sent.toLocaleString()}</div>
                  <p className="text-xs text-green-400">+12% from last month</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Open Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {totalStats.sent > 0 ? Math.round((totalStats.opened / totalStats.sent) * 100) : 0}%
                  </div>
                  <p className="text-xs text-green-400">+3% from last month</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Click Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {totalStats.opened > 0 ? Math.round((totalStats.clicked / totalStats.opened) * 100) : 0}%
                  </div>
                  <p className="text-xs text-red-400">-1% from last month</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Delivered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {totalStats.sent > 0 ? Math.round((totalStats.delivered / totalStats.sent) * 100) : 0}%
                  </div>
                  <p className="text-xs text-green-400">98.5% delivery rate</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(campaign.status)}
                        <div>
                          <h3 className="font-semibold text-lg">{campaign.name}</h3>
                          <p className="text-slate-400">{campaign.subject}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {campaign.type === "ab_test" && (
                          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
                            A/B Test
                          </Badge>
                        )}
                        <Badge variant="secondary" className={getStatusColor(campaign.status)}>
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </Badge>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {campaign.stats && (
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                        <div>
                          <div className="text-slate-400">Sent</div>
                          <div className="font-bold">{campaign.stats.sent.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-slate-400">Delivered</div>
                          <div className="font-bold">{campaign.stats.delivered.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-slate-400">Opened</div>
                          <div className="font-bold">
                            {campaign.stats.opened.toLocaleString()} ({calculateOpenRate(campaign)}%)
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-400">Clicked</div>
                          <div className="font-bold">
                            {campaign.stats.clicked.toLocaleString()} ({calculateClickRate(campaign)}%)
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-400">Bounced</div>
                          <div className="font-bold">{campaign.stats.bounced.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-slate-400">Unsubscribed</div>
                          <div className="font-bold">{campaign.stats.unsubscribed.toLocaleString()}</div>
                        </div>
                      </div>
                    )}

                    {campaign.abTest && (
                      <div className="mt-4 p-3 bg-slate-700/50 rounded-lg">
                        <div className="text-sm font-medium mb-2">A/B Test Configuration</div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-slate-400">Variant A</div>
                            <div>{campaign.abTest.variantA.subject}</div>
                          </div>
                          <div>
                            <div className="text-slate-400">Variant B</div>
                            <div>{campaign.abTest.variantB.subject}</div>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-slate-400">
                          Testing: {campaign.abTest.testMetric.replace('_', ' ')} • Split: {campaign.abTest.splitPercentage}%
                        </div>
                      </div>
                    )}

                    {campaign.sendDate && (
                      <div className="mt-4 text-sm text-slate-400">
                        {campaign.status === "scheduled" ? "Scheduled for" : "Sent on"}: {campaign.sendDate.toLocaleString()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="editor" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Email Editor</CardTitle>
                <CardDescription>Drag & drop email template builder</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Toolbar */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Elements</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Type className="w-4 h-4" />
                        Text
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        Image
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <MousePointer className="w-4 h-4" />
                        Button
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Layout className="w-4 h-4" />
                        Section
                      </Button>
                    </div>
                    
                    <h3 className="font-semibold mt-6">Templates</h3>
                    <div className="space-y-2">
                      <div className="p-3 bg-slate-700/50 rounded-lg cursor-pointer hover:bg-slate-700">
                        <div className="text-sm font-medium">Newsletter</div>
                        <div className="text-xs text-slate-400">Classic newsletter layout</div>
                      </div>
                      <div className="p-3 bg-slate-700/50 rounded-lg cursor-pointer hover:bg-slate-700">
                        <div className="text-sm font-medium">Product Launch</div>
                        <div className="text-xs text-slate-400">Announcement template</div>
                      </div>
                      <div className="p-3 bg-slate-700/50 rounded-lg cursor-pointer hover:bg-slate-700">
                        <div className="text-sm font-medium">Welcome</div>
                        <div className="text-xs text-slate-400">New user onboarding</div>
                      </div>
                    </div>
                  </div>

                  {/* Canvas */}
                  <div className="lg:col-span-2">
                    <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 min-h-[600px] bg-white text-black">
                      <div className="max-w-md mx-auto">
                        <div className="text-center mb-6">
                          <h1 className="text-2xl font-bold mb-2">Welcome to EcoNest!</h1>
                          <p className="text-gray-600">We're excited to have you on board</p>
                        </div>
                        
                        <div className="mb-6">
                          <img src="/api/placeholder/400/200" alt="Hero" className="w-full rounded-lg" />
                        </div>
                        
                        <div className="space-y-4 mb-6">
                          <p>Hi [First Name],</p>
                          <p>Thank you for joining our community! We're here to help you get started with our platform.</p>
                          <p>Here are some quick next steps:</p>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>Complete your profile</li>
                            <li>Explore our features</li>
                            <li>Join our community</li>
                          </ul>
                        </div>
                        
                        <div className="text-center">
                          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold">
                            Get Started
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Globe className="w-4 h-4 mr-2" />
                          Desktop
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Smartphone className="w-4 h-4 mr-2" />
                          Mobile
                        </Button>
                      </div>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                  </div>

                  {/* Properties */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Properties</h3>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="subject">Subject Line</Label>
                        <Input
                          id="subject"
                          value={emailSubject}
                          onChange={(e) => setEmailSubject(e.target.value)}
                          placeholder="Enter subject line..."
                          className="bg-slate-700 border-slate-600"
                        />
                      </div>
                      <div>
                        <Label htmlFor="from-name">From Name</Label>
                        <Input
                          id="from-name"
                          defaultValue="EcoNest Team"
                          className="bg-slate-700 border-slate-600"
                        />
                      </div>
                      <div>
                        <Label htmlFor="from-email">From Email</Label>
                        <Input
                          id="from-email"
                          defaultValue="hello@econest.ai"
                          className="bg-slate-700 border-slate-600"
                        />
                      </div>
                      <div>
                        <Label>Background Color</Label>
                        <div className="flex gap-2 mt-1">
                          <div className="w-8 h-8 bg-white border border-slate-600 rounded cursor-pointer"></div>
                          <div className="w-8 h-8 bg-gray-100 border border-slate-600 rounded cursor-pointer"></div>
                          <div className="w-8 h-8 bg-blue-50 border border-slate-600 rounded cursor-pointer"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audience" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Segments</CardTitle>
                  <CardDescription>Organize your audience into targeted groups</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {segments.map((segment) => (
                      <div key={segment.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${segment.color}`}></div>
                            <span className="font-medium">{segment.name}</span>
                          </div>
                          <Badge variant="secondary">{segment.contactCount.toLocaleString()} contacts</Badge>
                        </div>
                        <p className="text-sm text-slate-400 mb-2">{segment.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {segment.criteria.map((criterion, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {criterion}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                    <Button className="w-full" variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Segment
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Contacts</CardTitle>
                  <CardDescription>Manage your email subscribers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input placeholder="Search contacts..." className="bg-slate-700 border-slate-600" />
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {contacts.map((contact) => (
                        <div key={contact.id} className="p-3 bg-slate-700/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <div className="font-medium">
                                {contact.firstName} {contact.lastName}
                              </div>
                              <div className="text-sm text-slate-400">{contact.email}</div>
                            </div>
                            <Badge variant={contact.status === "subscribed" ? "default" : "destructive"}>
                              {contact.status}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mb-2">
                            {contact.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="text-xs text-slate-400">
                            Segments: {contact.segments.length} • 
                            Last activity: {contact.lastActivity?.toLocaleDateString() || "Never"}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Button className="w-full" variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Import Contacts
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Avg Open Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">38.5%</div>
                  <p className="text-xs text-green-400">+5.2% vs industry avg</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Avg Click Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.2%</div>
                  <p className="text-xs text-green-400">+1.1% vs industry avg</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Bounce Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1.2%</div>
                  <p className="text-xs text-green-400">-0.3% from last month</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Unsubscribe Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0.1%</div>
                  <p className="text-xs text-green-400">-0.05% from last month</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>A/B Test Results</CardTitle>
                <CardDescription>Performance comparison of test variants</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h3 className="font-semibold mb-4">Product Launch A/B Test</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="text-sm text-slate-400 mb-2">Variant A</div>
                        <div className="font-medium mb-1">🚀 Introducing Our Latest Innovation</div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-slate-400">Open Rate</div>
                            <div className="font-bold text-green-400">42.3%</div>
                          </div>
                          <div>
                            <div className="text-slate-400">Click Rate</div>
                            <div className="font-bold">5.1%</div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <Progress value={42.3} className="h-2" />
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-400 mb-2">Variant B</div>
                        <div className="font-medium mb-1">New Product Alert: Game-Changing Technology</div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-slate-400">Open Rate</div>
                            <div className="font-bold">39.7%</div>
                          </div>
                          <div>
                            <div className="text-slate-400">Click Rate</div>
                            <div className="font-bold text-green-400">6.2%</div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <Progress value={39.7} className="h-2" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                        Winner: Variant A (Higher Open Rate)
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Email Provider</CardTitle>
                  <CardDescription>Configure your email sending service</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Provider</Label>
                    <Select defaultValue="resend">
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="resend">Resend</SelectItem>
                        <SelectItem value="sendgrid">SendGrid</SelectItem>
                        <SelectItem value="mailgun">Mailgun</SelectItem>
                        <SelectItem value="postmark">Postmark</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="api-key">API Key</Label>
                    <Input
                      id="api-key"
                      type="password"
                      placeholder="Enter your API key..."
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="domain">Sending Domain</Label>
                    <Input
                      id="domain"
                      defaultValue="mail.econest.ai"
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Zap className="w-4 h-4 mr-2" />
                    Test Connection
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>CRM Integration</CardTitle>
                  <CardDescription>Connect your customer database</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>CRM System</Label>
                    <Select defaultValue="supabase">
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="supabase">Supabase</SelectItem>
                        <SelectItem value="hubspot">HubSpot</SelectItem>
                        <SelectItem value="salesforce">Salesforce</SelectItem>
                        <SelectItem value="airtable">Airtable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-sync contacts</Label>
                      <p className="text-sm text-slate-400">Automatically sync new contacts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Track email opens</Label>
                      <p className="text-sm text-slate-400">Add tracking pixels to emails</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Database className="w-4 h-4 mr-2" />
                    Connect CRM
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}