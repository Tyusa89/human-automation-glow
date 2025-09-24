import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { FileText, Download, BarChart3, PieChart, TrendingUp, Calendar, Filter, Search, Plus, Eye, Edit, Trash2, Play, Clock, Users, DollarSign, Activity, Settings } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ReportGenerator() {
  const [activeTab, setActiveTab] = useState('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportProgress, setReportProgress] = useState(0);

  // Mock data for report templates
  const reportTemplates = [
    {
      id: 1,
      name: 'Monthly Sales Report',
      category: 'Sales',
      description: 'Comprehensive monthly sales analysis with charts and KPIs',
      format: 'PDF',
      charts: ['Bar Chart', 'Line Chart', 'Pie Chart'],
      lastUsed: '2 days ago',
      usage: 45,
      preview: '/api/placeholder/300/200'
    },
    {
      id: 2,
      name: 'Customer Analytics Dashboard',
      category: 'Analytics',
      description: 'Customer behavior insights and retention analysis',
      format: 'PDF',
      charts: ['Funnel Chart', 'Heatmap', 'Bar Chart'],
      lastUsed: '1 week ago',
      usage: 23,
      preview: '/api/placeholder/300/200'
    },
    {
      id: 3,
      name: 'Financial Performance',
      category: 'Finance',
      description: 'Quarterly financial performance with P&L breakdown',
      format: 'PDF',
      charts: ['Line Chart', 'Waterfall Chart', 'Table'],
      lastUsed: '3 days ago',
      usage: 67,
      preview: '/api/placeholder/300/200'
    },
    {
      id: 4,
      name: 'Marketing Campaign ROI',
      category: 'Marketing',
      description: 'Campaign performance metrics and ROI analysis',
      format: 'PDF',
      charts: ['Bar Chart', 'Donut Chart', 'Trend Line'],
      lastUsed: '5 days ago',
      usage: 12,
      preview: '/api/placeholder/300/200'
    }
  ];

  // Mock data for recent reports
  const recentReports = [
    {
      id: 1,
      name: 'Q1 Sales Performance',
      template: 'Monthly Sales Report',
      createdAt: '2024-03-15',
      status: 'completed',
      format: 'PDF',
      size: '2.4 MB'
    },
    {
      id: 2,
      name: 'Customer Retention Analysis',
      template: 'Customer Analytics Dashboard',
      createdAt: '2024-03-14',
      status: 'completed',
      format: 'PDF',
      size: '1.8 MB'
    },
    {
      id: 3,
      name: 'February Financial Review',
      template: 'Financial Performance',
      createdAt: '2024-03-10',
      status: 'processing',
      format: 'PDF',
      size: 'Processing...'
    }
  ];

  const stats = [
    { label: 'Total Reports', value: '1,247', icon: FileText, color: 'text-blue-500' },
    { label: 'Templates', value: '24', icon: BarChart3, color: 'text-green-500' },
    { label: 'This Month', value: '89', icon: Calendar, color: 'text-purple-500' },
    { label: 'Processing', value: '3', icon: Clock, color: 'text-orange-500' }
  ];

  const handleGenerateReport = async (templateId: number) => {
    setGeneratingReport(true);
    setReportProgress(0);
    
    // Simulate report generation progress
    const interval = setInterval(() => {
      setReportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setGeneratingReport(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-orange-500 animate-pulse" />;
      case 'failed':
        return <Trash2 className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'processing': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'failed': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Report Generator</h1>
            <p className="text-muted-foreground">Generate custom reports from your data sources</p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="mr-2 h-4 w-4" />
            New Report
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="reports">Recent Reports</TabsTrigger>
            <TabsTrigger value="generator">Report Builder</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Report Templates</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search templates..." className="pl-9 w-64" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reportTemplates.map((template) => (
                <Card key={template.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{template.category}</Badge>
                      <span className="text-sm text-muted-foreground">{template.usage} uses</span>
                    </div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="aspect-video bg-secondary/50 rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-8 w-8 text-muted-foreground" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {template.charts.map((chart) => (
                          <Badge key={chart} variant="outline" className="text-xs">
                            {chart}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">Last used: {template.lastUsed}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setSelectedTemplate(template.name)}
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        Preview
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleGenerateReport(template.id)}
                      >
                        <Play className="mr-1 h-3 w-3" />
                        Generate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent Reports</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export All
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="p-4 font-medium">Report Name</th>
                        <th className="p-4 font-medium">Template</th>
                        <th className="p-4 font-medium">Created</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium">Format</th>
                        <th className="p-4 font-medium">Size</th>
                        <th className="p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentReports.map((report) => (
                        <tr key={report.id} className="border-b hover:bg-secondary/50">
                          <td className="p-4 font-medium">{report.name}</td>
                          <td className="p-4 text-sm text-muted-foreground">{report.template}</td>
                          <td className="p-4 text-sm">{report.createdAt}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(report.status)}
                              <Badge variant="outline" className={getStatusColor(report.status)}>
                                {report.status}
                              </Badge>
                            </div>
                          </td>
                          <td className="p-4 text-sm">{report.format}</td>
                          <td className="p-4 text-sm">{report.size}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {report.status === 'completed' && (
                                <>
                                  <Button size="sm" variant="outline">
                                    <Download className="h-3 w-3" />
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                </>
                              )}
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generator" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Custom Report Builder</CardTitle>
                <p className="text-muted-foreground">Create a new report from scratch or customize an existing template</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {generatingReport && (
                  <Alert>
                    <Activity className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p>Generating your report... {reportProgress}%</p>
                        <Progress value={reportProgress} className="w-full" />
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="report-name">Report Name</Label>
                      <Input 
                        id="report-name" 
                        placeholder="Enter report name"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="data-source">Data Source</Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select data source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="postgres">PostgreSQL Database</SelectItem>
                          <SelectItem value="mysql">MySQL Database</SelectItem>
                          <SelectItem value="supabase">Supabase</SelectItem>
                          <SelectItem value="csv">CSV Upload</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="template">Base Template</Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Choose a template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blank">Blank Report</SelectItem>
                          <SelectItem value="sales">Sales Report</SelectItem>
                          <SelectItem value="analytics">Analytics Dashboard</SelectItem>
                          <SelectItem value="financial">Financial Report</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="format">Output Format</Label>
                      <Select defaultValue="pdf">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF Document</SelectItem>
                          <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                          <SelectItem value="csv">CSV File</SelectItem>
                          <SelectItem value="html">HTML Report</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Chart Types</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <Button variant="outline" className="justify-start">
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Bar Chart
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <TrendingUp className="mr-2 h-4 w-4" />
                          Line Chart
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <PieChart className="mr-2 h-4 w-4" />
                          Pie Chart
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <Activity className="mr-2 h-4 w-4" />
                          Area Chart
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="filters">Filters & Conditions</Label>
                      <Textarea 
                        id="filters"
                        placeholder="Add custom filters (e.g., date range, categories)"
                        className="mt-1"
                        rows={3}
                      />
                    </div>

                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => handleGenerateReport(1)}
                      disabled={generatingReport}
                    >
                      {generatingReport ? (
                        <>
                          <Clock className="mr-2 h-4 w-4 animate-spin" />
                          Generating Report...
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Generate Report
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Report Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="default-format">Default Output Format</Label>
                    <Select defaultValue="pdf">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Document</SelectItem>
                        <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                        <SelectItem value="csv">CSV File</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="auto-refresh">Auto-refresh Interval</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="retention">Report Retention Period</Label>
                    <Select defaultValue="90days">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30days">30 Days</SelectItem>
                        <SelectItem value="90days">90 Days</SelectItem>
                        <SelectItem value="1year">1 Year</SelectItem>
                        <SelectItem value="forever">Forever</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Sources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                      <div>
                        <p className="font-medium">PostgreSQL Database</p>
                        <p className="text-sm text-muted-foreground">Primary data source</p>
                      </div>
                      <Badge variant="default">Connected</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                      <div>
                        <p className="font-medium">Supabase</p>
                        <p className="text-sm text-muted-foreground">Analytics data</p>
                      </div>
                      <Badge variant="default">Connected</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                      <div>
                        <p className="font-medium">CSV Uploads</p>
                        <p className="text-sm text-muted-foreground">Manual data input</p>
                      </div>
                      <Badge variant="secondary">Available</Badge>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
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