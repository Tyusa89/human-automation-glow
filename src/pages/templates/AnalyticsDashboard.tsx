import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend
} from "recharts";
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  ShoppingCart,
  Eye,
  Clock,
  Settings,
  RefreshCw,
  Calendar,
  Filter,
  Download,
  Share,
  Plus,
  Edit,
  Trash2,
  Database,
  Activity,
  Target,
  Zap
} from "lucide-react";

interface KPI {
  id: string;
  title: string;
  value: number;
  previousValue: number;
  format: "number" | "currency" | "percentage";
  trend: "up" | "down" | "neutral";
  icon: any;
  color: string;
}

interface ChartData {
  name: string;
  value?: number;
  revenue?: number;
  users?: number;
  orders?: number;
  conversion?: number;
}

export default function AnalyticsDashboard() {
  const { toast } = useToast();
  const [isRealTime, setIsRealTime] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d");
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Sample data that updates in real-time
  const [kpis, setKpis] = useState<KPI[]>([
    {
      id: "revenue",
      title: "Total Revenue",
      value: 47834,
      previousValue: 42891,
      format: "currency",
      trend: "up",
      icon: DollarSign,
      color: "text-green-500"
    },
    {
      id: "users",
      title: "Active Users",
      value: 3421,
      previousValue: 3156,
      format: "number",
      trend: "up",
      icon: Users,
      color: "text-blue-500"
    },
    {
      id: "orders",
      title: "Orders",
      value: 1247,
      previousValue: 1389,
      format: "number",
      trend: "down",
      icon: ShoppingCart,
      color: "text-orange-500"
    },
    {
      id: "conversion",
      title: "Conversion Rate",
      value: 3.64,
      previousValue: 3.21,
      format: "percentage",
      trend: "up",
      icon: Target,
      color: "text-purple-500"
    }
  ]);

  const [revenueData] = useState<ChartData[]>([
    { name: "Jan", revenue: 42000, users: 2890, orders: 1234 },
    { name: "Feb", revenue: 38000, users: 3100, orders: 1145 },
    { name: "Mar", revenue: 45000, users: 3250, orders: 1289 },
    { name: "Apr", revenue: 41000, users: 3180, orders: 1156 },
    { name: "May", revenue: 48000, users: 3420, orders: 1334 },
    { name: "Jun", revenue: 52000, users: 3650, orders: 1445 },
    { name: "Jul", revenue: 47834, users: 3421, orders: 1247 }
  ]);

  const [trafficData] = useState<ChartData[]>([
    { name: "Organic", value: 4567, users: 2890 },
    { name: "Direct", value: 3421, users: 2156 },
    { name: "Social", value: 2345, users: 1543 },
    { name: "Email", value: 1890, users: 1234 },
    { name: "Paid", value: 1234, users: 890 }
  ]);

  const [conversionFunnelData] = useState<ChartData[]>([
    { name: "Visitors", value: 10000, conversion: 100 },
    { name: "Product Views", value: 7500, conversion: 75 },
    { name: "Add to Cart", value: 3200, conversion: 32 },
    { name: "Checkout", value: 1800, conversion: 18 },
    { name: "Purchase", value: 364, conversion: 3.64 }
  ]);

  const pieColors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00ff00"];

  // Simulate real-time updates
  useEffect(() => {
    if (!isRealTime) return;

    const interval = setInterval(() => {
      setKpis(prevKpis => 
        prevKpis.map(kpi => ({
          ...kpi,
          previousValue: kpi.value,
          value: kpi.value + (Math.random() - 0.5) * (kpi.value * 0.02) // Small random changes
        }))
      );
      setLastUpdated(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, [isRealTime]);

  const formatValue = (value: number, format: KPI["format"]) => {
    switch (format) {
      case "currency":
        return `$${value.toLocaleString()}`;
      case "percentage":
        return `${value.toFixed(2)}%`;
      default:
        return value.toLocaleString();
    }
  };

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous * 100);
  };

  const refreshData = () => {
    toast({
      title: "Data Refreshed",
      description: "Dashboard data has been updated with the latest information",
    });
    setLastUpdated(new Date());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              DATA
            </Badge>
            <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-red-500/30">
              ADVANCED
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
              <p className="text-slate-400 text-lg">
                Real-time business analytics with custom KPI tracking.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Activity className={`w-4 h-4 ${isRealTime ? "text-green-500" : "text-gray-500"}`} />
                <span className="text-sm">
                  {isRealTime ? "Live" : "Paused"}
                </span>
                <Switch
                  checked={isRealTime}
                  onCheckedChange={setIsRealTime}
                />
              </div>
              <Button
                onClick={refreshData}
                variant="outline"
                size="sm"
                className="border-slate-600"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Badge variant="secondary" className="bg-blue-500 text-white">
              📊 Real-time data
            </Badge>
            <Badge variant="secondary" className="bg-green-500 text-white">
              🎯 Custom KPIs
            </Badge>
            <Badge variant="secondary" className="bg-purple-500 text-white">
              📈 Interactive charts
            </Badge>
            <Badge variant="secondary" className="bg-cyan-500 text-white">
              🗄️ Database
            </Badge>
            <Badge variant="secondary" className="bg-orange-500 text-white">
              📊 Charting library
            </Badge>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-40 bg-slate-800 border-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="border-slate-600">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
            <Button variant="outline" size="sm" className="border-slate-600">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="border-slate-600">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="revenue" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Revenue
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpis.map((kpi) => {
                const change = calculateChange(kpi.value, kpi.previousValue);
                const Icon = kpi.icon;
                
                return (
                  <Card key={kpi.id} className="bg-slate-800/50 border-slate-700">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-slate-400">{kpi.title}</CardTitle>
                        <Icon className={`w-4 h-4 ${kpi.color}`} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold mb-1">
                        {formatValue(kpi.value, kpi.format)}
                      </div>
                      <div className="flex items-center gap-1">
                        {change > 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : change < 0 ? (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        ) : null}
                        <span className={`text-xs ${change > 0 ? "text-green-500" : change < 0 ? "text-red-500" : "text-slate-400"}`}>
                          {change > 0 ? "+" : ""}{change.toFixed(1)}%
                        </span>
                        <span className="text-xs text-slate-400">vs previous</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Trend */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Monthly revenue over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Traffic Sources */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Traffic Sources</CardTitle>
                  <CardDescription>Breakdown of user acquisition channels</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={trafficData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {trafficData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* User Growth */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>Active users over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke="#10B981"
                        strokeWidth={3}
                        dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Conversion Funnel */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Conversion Funnel</CardTitle>
                  <CardDescription>User journey from visit to purchase</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={conversionFunnelData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis type="number" stroke="#9CA3AF" />
                      <YAxis dataKey="name" type="category" stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="value" fill="#F59E0B" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
                <CardDescription>Detailed revenue breakdown and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-500">$47,834</div>
                    <div className="text-sm text-slate-400">Total Revenue</div>
                    <div className="text-xs text-green-400">+11.5% from last month</div>
                  </div>
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-500">$39.80</div>
                    <div className="text-sm text-slate-400">Average Order Value</div>
                    <div className="text-xs text-red-400">-2.3% from last month</div>
                  </div>
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-500">$14.12</div>
                    <div className="text-sm text-slate-400">Revenue per User</div>
                    <div className="text-xs text-green-400">+5.7% from last month</div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="revenue" fill="#3B82F6" name="Revenue" />
                    <Bar dataKey="orders" fill="#10B981" name="Orders" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>User Analytics</CardTitle>
                  <CardDescription>User engagement and behavior metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke="#8B5CF6"
                        strokeWidth={3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>User Acquisition</CardTitle>
                  <CardDescription>How users find your platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trafficData.map((source, index) => (
                      <div key={source.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: pieColors[index % pieColors.length] }}
                          />
                          <span>{source.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{source.value.toLocaleString()}</div>
                          <div className="text-xs text-slate-400">
                            {((source.value / trafficData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Dashboard Settings</CardTitle>
                  <CardDescription>Configure your analytics dashboard</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Real-time Updates</Label>
                      <p className="text-sm text-slate-400">Automatically refresh data</p>
                    </div>
                    <Switch
                      checked={isRealTime}
                      onCheckedChange={setIsRealTime}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Reports</Label>
                      <p className="text-sm text-slate-400">Weekly analytics summary</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Data Retention</Label>
                      <p className="text-sm text-slate-400">Keep historical data for 90 days</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div>
                    <Label>Default Time Range</Label>
                    <Select defaultValue="7d">
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1d">Last 24 hours</SelectItem>
                        <SelectItem value="7d">Last 7 days</SelectItem>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                        <SelectItem value="90d">Last 90 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Data Sources</CardTitle>
                  <CardDescription>Manage your connected data sources</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">PostgreSQL Database</span>
                      </div>
                      <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                        Connected
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400">postgres://localhost:5432/analytics</p>
                  </div>
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-orange-500" />
                        <span className="font-medium">Recharts Library</span>
                      </div>
                      <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                        Active
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400">Interactive charting library</p>
                  </div>
                  <Button className="w-full" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Data Source
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