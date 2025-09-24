import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Zap, 
  MessageCircle, 
  Users, 
  Settings, 
  Send, 
  Webhook,
  CheckCircle,
  AlertCircle,
  User,
  Tag,
  Mail,
  Slack
} from "lucide-react";

interface Contact {
  id: string;
  name: string;
  email: string;
  tags: string[];
  lastSeen: string;
  status: "online" | "away" | "offline";
}

interface ZapEvent {
  id: string;
  type: "contact_created" | "tag_added" | "message_sent";
  timestamp: string;
  description: string;
  status: "success" | "pending" | "failed";
}

export default function ZapierIntercomIntegration() {
  const { toast } = useToast();
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [message, setMessage] = useState("");
  const [autoSync, setAutoSync] = useState(true);
  const [notifications, setNotifications] = useState({
    email: true,
    slack: false,
    web: true
  });

  const [contacts] = useState<Contact[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      tags: ["customer", "premium"],
      lastSeen: "2 minutes ago",
      status: "online"
    },
    {
      id: "2", 
      name: "Mike Chen",
      email: "mike@example.com",
      tags: ["lead", "trial"],
      lastSeen: "1 hour ago",
      status: "away"
    },
    {
      id: "3",
      name: "Emma Davis",
      email: "emma@example.com", 
      tags: ["customer"],
      lastSeen: "1 day ago",
      status: "offline"
    }
  ]);

  const [zapEvents] = useState<ZapEvent[]>([
    {
      id: "1",
      type: "contact_created",
      timestamp: "2 minutes ago",
      description: "New contact Sarah Johnson created in CRM",
      status: "success"
    },
    {
      id: "2",
      type: "tag_added", 
      timestamp: "5 minutes ago",
      description: "Tag 'premium' added to Mike Chen",
      status: "success"
    },
    {
      id: "3",
      type: "message_sent",
      timestamp: "10 minutes ago",
      description: "Welcome message sent to Emma Davis",
      status: "pending"
    }
  ]);

  const handleTriggerZap = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!webhookUrl) {
      toast({
        title: "Error",
        description: "Please enter your Zapier webhook URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log("Triggering Zapier webhook:", webhookUrl);

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          triggered_from: window.location.origin,
          contact: selectedContact,
          event_type: "manual_trigger",
          message: message || "Manual webhook trigger from integration template"
        }),
      });

      toast({
        title: "Zap Triggered",
        description: "The webhook was sent to Zapier. Check your Zap's history to confirm it was triggered.",
      });
    } catch (error) {
      console.error("Error triggering webhook:", error);
      toast({
        title: "Error",
        description: "Failed to trigger the Zapier webhook. Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!selectedContact || !message) return;
    
    toast({
      title: "Message Sent",
      description: `Message sent to ${selectedContact.name}`,
    });
    setMessage("");
  };

  const getStatusColor = (status: Contact["status"]) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      case "offline": return "bg-gray-500";
    }
  };

  const getEventIcon = (type: ZapEvent["type"]) => {
    switch (type) {
      case "contact_created": return <User className="w-4 h-4" />;
      case "tag_added": return <Tag className="w-4 h-4" />;
      case "message_sent": return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getEventStatus = (status: ZapEvent["status"]) => {
    switch (status) {
      case "success": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending": return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "failed": return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              INTEGRATION
            </Badge>
          </div>
          <h1 className="text-4xl font-bold mb-2">
            Integration • <span className="text-orange-400">Zapier</span> × <span className="text-blue-400">Intercom</span> vibe
          </h1>
          <p className="text-slate-400 text-lg">
            Trigger zaps from conversations and sync contact events
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Contacts
            </TabsTrigger>
            <TabsTrigger value="zaps" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Zap Events
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Total Contacts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{contacts.length}</div>
                  <p className="text-xs text-slate-400">+2 from last week</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Zap Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{zapEvents.length}</div>
                  <p className="text-xs text-slate-400">Last 24 hours</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Success Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">98%</div>
                  <p className="text-xs text-slate-400">Webhook delivery</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Webhook className="w-5 h-5" />
                  Quick Webhook Trigger
                </CardTitle>
                <CardDescription>
                  Manually trigger a Zapier webhook with custom data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTriggerZap} className="space-y-4">
                  <div>
                    <Label htmlFor="webhook-url">Zapier Webhook URL</Label>
                    <Input
                      id="webhook-url"
                      type="url"
                      placeholder="https://hooks.zapier.com/hooks/catch/..."
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message (Optional)</Label>
                    <Textarea
                      id="message"
                      placeholder="Custom message to include in webhook..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <Button type="submit" disabled={isLoading} className="bg-orange-600 hover:bg-orange-700">
                    {isLoading ? "Triggering..." : "Trigger Zap"}
                    <Zap className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Contacts</CardTitle>
                  <CardDescription>Manage your contact database</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {contacts.map((contact) => (
                      <div
                        key={contact.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedContact?.id === contact.id
                            ? "bg-blue-500/20 border-blue-500/50"
                            : "bg-slate-700/50 border-slate-600 hover:bg-slate-700"
                        }`}
                        onClick={() => setSelectedContact(contact)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4" />
                              </div>
                              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-800 ${getStatusColor(contact.status)}`} />
                            </div>
                            <div>
                              <div className="font-medium">{contact.name}</div>
                              <div className="text-sm text-slate-400">{contact.email}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-slate-400">{contact.lastSeen}</div>
                            <div className="flex gap-1 mt-1">
                              {contact.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Send Message</CardTitle>
                  <CardDescription>
                    {selectedContact ? `Send a message to ${selectedContact.name}` : "Select a contact to send a message"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea
                      placeholder={selectedContact ? "Type your message..." : "Select a contact first"}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={!selectedContact}
                      className="bg-slate-700 border-slate-600"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!selectedContact || !message}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="zaps" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Recent Zap Events</CardTitle>
                <CardDescription>Monitor your automation events and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {zapEvents.map((event) => (
                    <div key={event.id} className="flex items-center gap-4 p-3 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        {getEventIcon(event.type)}
                        {getEventStatus(event.status)}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{event.description}</div>
                        <div className="text-sm text-slate-400">{event.timestamp}</div>
                      </div>
                      <Badge variant={event.status === "success" ? "default" : event.status === "pending" ? "secondary" : "destructive"}>
                        {event.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Sync Settings</CardTitle>
                  <CardDescription>Configure how data syncs between systems</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-sync">Auto-sync contacts</Label>
                      <p className="text-sm text-slate-400">Automatically sync new contacts to Zapier</p>
                    </div>
                    <Switch
                      id="auto-sync"
                      checked={autoSync}
                      onCheckedChange={setAutoSync}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Choose how you want to be notified</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <Label htmlFor="email-notif">Email notifications</Label>
                    </div>
                    <Switch
                      id="email-notif"
                      checked={notifications.email}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, email: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Slack className="w-4 h-4" />
                      <Label htmlFor="slack-notif">Slack notifications</Label>
                    </div>
                    <Switch
                      id="slack-notif"
                      checked={notifications.slack}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, slack: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      <Label htmlFor="web-notif">Web notifications</Label>
                    </div>
                    <Switch
                      id="web-notif"
                      checked={notifications.web}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, web: checked }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}