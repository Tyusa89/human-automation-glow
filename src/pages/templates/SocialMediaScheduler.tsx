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
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar as CalendarIcon,
  Clock,
  BarChart3,
  Settings,
  Plus,
  Send,
  Eye,
  Edit,
  Trash2,
  Users,
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  Hash,
  AtSign
} from "lucide-react";

interface Post {
  id: string;
  content: string;
  platforms: string[];
  scheduledTime: Date;
  status: "draft" | "scheduled" | "published" | "failed";
  image?: string;
  hashtags?: string[];
  mentions?: string[];
  analytics?: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
  };
}

interface Platform {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  color: string;
}

export default function SocialMediaScheduler() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [scheduledTime, setScheduledTime] = useState("09:00");
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  const [platforms] = useState<Platform[]>([
    { id: "twitter", name: "Twitter/X", icon: "🐦", connected: true, color: "bg-blue-500" },
    { id: "instagram", name: "Instagram", icon: "📷", connected: true, color: "bg-pink-500" },
    { id: "facebook", name: "Facebook", icon: "👤", connected: false, color: "bg-blue-600" },
    { id: "linkedin", name: "LinkedIn", icon: "💼", connected: true, color: "bg-blue-700" },
  ]);

  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      content: "Excited to share our new product launch! 🚀 #innovation #startup",
      platforms: ["twitter", "linkedin"],
      scheduledTime: new Date("2024-01-15T10:00:00"),
      status: "scheduled",
      hashtags: ["innovation", "startup"],
      analytics: { views: 1250, likes: 89, shares: 12, comments: 5 }
    },
    {
      id: "2", 
      content: "Behind the scenes of our team brainstorming session 💡",
      platforms: ["instagram", "facebook"],
      scheduledTime: new Date("2024-01-15T14:30:00"),
      status: "published",
      analytics: { views: 2340, likes: 156, shares: 23, comments: 18 }
    },
    {
      id: "3",
      content: "Weekly industry insights and trends 📊 What do you think?",
      platforms: ["linkedin"],
      scheduledTime: new Date("2024-01-16T09:00:00"),
      status: "draft"
    }
  ]);

  const handleCreatePost = () => {
    if (!newPostContent.trim() || selectedPlatforms.length === 0) {
      toast({
        title: "Error",
        description: "Please add content and select at least one platform",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingPost(true);
    setTimeout(() => {
      const newPost: Post = {
        id: Date.now().toString(),
        content: newPostContent,
        platforms: selectedPlatforms,
        scheduledTime: new Date(`${selectedDate.toDateString()} ${scheduledTime}`),
        status: "scheduled",
        hashtags: newPostContent.match(/#\w+/g)?.map(tag => tag.slice(1)) || [],
        mentions: newPostContent.match(/@\w+/g)?.map(mention => mention.slice(1)) || []
      };

      setPosts(prev => [...prev, newPost]);
      setNewPostContent("");
      setSelectedPlatforms([]);
      setIsCreatingPost(false);

      toast({
        title: "Post Scheduled",
        description: `Your post has been scheduled for ${newPost.scheduledTime.toLocaleString()}`,
      });
    }, 1000);
  };

  const getPlatformBadge = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    return platform ? (
      <Badge variant="secondary" className={`${platform.color} text-white`}>
        {platform.icon} {platform.name}
      </Badge>
    ) : null;
  };

  const getStatusIcon = (status: Post["status"]) => {
    switch (status) {
      case "published": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "scheduled": return <Clock className="w-4 h-4 text-blue-500" />;
      case "draft": return <Edit className="w-4 h-4 text-gray-500" />;
      case "failed": return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: Post["status"]) => {
    switch (status) {
      case "published": return "text-green-500";
      case "scheduled": return "text-blue-500";
      case "draft": return "text-gray-500";
      case "failed": return "text-red-500";
    }
  };

  const todaysPosts = posts.filter(post => 
    post.scheduledTime.toDateString() === selectedDate.toDateString()
  );

  const totalAnalytics = posts.reduce((acc, post) => {
    if (post.analytics) {
      acc.views += post.analytics.views;
      acc.likes += post.analytics.likes;
      acc.shares += post.analytics.shares;
      acc.comments += post.analytics.comments;
    }
    return acc;
  }, { views: 0, likes: 0, shares: 0, comments: 0 });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              MARKETING
            </Badge>
            <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
              EASY
            </Badge>
          </div>
          <h1 className="text-4xl font-bold mb-2">Social Media Scheduler</h1>
          <p className="text-slate-400 text-lg">
            Schedule and manage posts across multiple platforms.
          </p>
          <div className="flex gap-2 mt-4">
            {platforms.filter(p => p.connected).map(platform => (
              <Badge key={platform.id} variant="secondary" className={`${platform.color} text-white`}>
                {platform.icon} {platform.name}
              </Badge>
            ))}
            <Badge variant="secondary" className="bg-orange-500 text-white">
              ⏰ Scheduler (cron)
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="calendar" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Post
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

          <TabsContent value="calendar" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Select Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border border-slate-700"
                  />
                </CardContent>
              </Card>

              <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>
                    Posts for {selectedDate.toLocaleDateString()}
                  </CardTitle>
                  <CardDescription>
                    {todaysPosts.length} posts scheduled for this day
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {todaysPosts.length === 0 ? (
                      <div className="text-center py-8 text-slate-400">
                        No posts scheduled for this date
                      </div>
                    ) : (
                      todaysPosts.map((post) => (
                        <div key={post.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(post.status)}
                              <span className={`font-medium ${getStatusColor(post.status)}`}>
                                {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                              </span>
                              <span className="text-sm text-slate-400">
                                {post.scheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <p className="text-slate-200 mb-3">{post.content}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {post.platforms.map(platformId => getPlatformBadge(platformId))}
                          </div>

                          {post.hashtags && post.hashtags.length > 0 && (
                            <div className="flex items-center gap-2 mb-2">
                              <Hash className="w-4 h-4 text-blue-400" />
                              <div className="flex gap-1">
                                {post.hashtags.map(tag => (
                                  <Badge key={tag} variant="outline" className="text-blue-400 border-blue-400">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {post.analytics && (
                            <div className="flex gap-4 text-sm text-slate-400">
                              <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {post.analytics.views}
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="w-4 h-4" />
                                {post.analytics.likes}
                              </span>
                              <span className="flex items-center gap-1">
                                <Share className="w-4 h-4" />
                                {post.analytics.shares}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageCircle className="w-4 h-4" />
                                {post.analytics.comments}
                              </span>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Create New Post</CardTitle>
                <CardDescription>Schedule a post across multiple social media platforms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="content">Post Content</Label>
                  <Textarea
                    id="content"
                    placeholder="What's on your mind? Use #hashtags and @mentions..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="bg-slate-700 border-slate-600 min-h-[120px]"
                  />
                  <div className="text-right text-sm text-slate-400 mt-1">
                    {newPostContent.length}/280 characters
                  </div>
                </div>

                <div>
                  <Label>Select Platforms</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {platforms.map((platform) => (
                      <div
                        key={platform.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedPlatforms.includes(platform.id)
                            ? `${platform.color} bg-opacity-20 border-opacity-50`
                            : platform.connected
                            ? "bg-slate-700/50 border-slate-600 hover:bg-slate-700"
                            : "bg-slate-800/50 border-slate-700 opacity-50 cursor-not-allowed"
                        }`}
                        onClick={() => {
                          if (!platform.connected) return;
                          setSelectedPlatforms(prev =>
                            prev.includes(platform.id)
                              ? prev.filter(id => id !== platform.id)
                              : [...prev, platform.id]
                          );
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{platform.icon}</span>
                          <span className="font-medium">{platform.name}</span>
                          {!platform.connected && (
                            <Badge variant="outline" className="text-xs">Not Connected</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Scheduled Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={selectedDate.toISOString().split('T')[0]}
                      onChange={(e) => setSelectedDate(new Date(e.target.value))}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Scheduled Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleCreatePost}
                  disabled={isCreatingPost || !newPostContent.trim() || selectedPlatforms.length === 0}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isCreatingPost ? "Scheduling..." : "Schedule Post"}
                  <Send className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Total Views</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalAnalytics.views.toLocaleString()}</div>
                  <p className="text-xs text-green-400">+12% from last week</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Total Likes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalAnalytics.likes.toLocaleString()}</div>
                  <p className="text-xs text-green-400">+8% from last week</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Total Shares</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalAnalytics.shares.toLocaleString()}</div>
                  <p className="text-xs text-red-400">-3% from last week</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Comments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalAnalytics.comments.toLocaleString()}</div>
                  <p className="text-xs text-green-400">+15% from last week</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Platform Performance</CardTitle>
                <CardDescription>Engagement metrics by platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {platforms.filter(p => p.connected).map((platform) => {
                    const platformPosts = posts.filter(post => post.platforms.includes(platform.id));
                    const platformAnalytics = platformPosts.reduce((acc, post) => {
                      if (post.analytics) {
                        acc.views += post.analytics.views;
                        acc.likes += post.analytics.likes;
                        acc.shares += post.analytics.shares;
                        acc.comments += post.analytics.comments;
                      }
                      return acc;
                    }, { views: 0, likes: 0, shares: 0, comments: 0 });

                    return (
                      <div key={platform.id} className="p-4 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{platform.icon}</span>
                            <span className="font-medium">{platform.name}</span>
                          </div>
                          <Badge variant="secondary">{platformPosts.length} posts</Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-slate-400">Views</div>
                            <div className="font-bold">{platformAnalytics.views.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-slate-400">Likes</div>
                            <div className="font-bold">{platformAnalytics.likes.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-slate-400">Shares</div>
                            <div className="font-bold">{platformAnalytics.shares.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-slate-400">Comments</div>
                            <div className="font-bold">{platformAnalytics.comments.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Platform Connections</CardTitle>
                  <CardDescription>Manage your social media account connections</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {platforms.map((platform) => (
                    <div key={platform.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{platform.icon}</span>
                        <div>
                          <div className="font-medium">{platform.name}</div>
                          <div className="text-sm text-slate-400">
                            {platform.connected ? "Connected" : "Not connected"}
                          </div>
                        </div>
                      </div>
                      <Switch
                        checked={platform.connected}
                        onCheckedChange={(checked) => {
                          // Handle connection toggle
                          toast({
                            title: checked ? "Connected" : "Disconnected",
                            description: `${platform.name} has been ${checked ? "connected" : "disconnected"}`,
                          });
                        }}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Posting Schedule</CardTitle>
                  <CardDescription>Configure your default posting times</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Default Timezone</Label>
                    <Select defaultValue="UTC">
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="EST">Eastern Time</SelectItem>
                        <SelectItem value="PST">Pacific Time</SelectItem>
                        <SelectItem value="GMT">Greenwich Mean Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Posting Window Start</Label>
                    <Input
                      type="time"
                      defaultValue="09:00"
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div>
                    <Label>Posting Window End</Label>
                    <Input
                      type="time"
                      defaultValue="18:00"
                      className="bg-slate-700 border-slate-600"
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