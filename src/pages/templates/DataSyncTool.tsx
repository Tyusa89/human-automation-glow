import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Clock, Database, Globe, RefreshCw, Settings, Play, Pause, CheckCircle2, XCircle, Zap, Calendar, Activity } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function DataSyncTool() {
  const [activeTab, setActiveTab] = useState('overview');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'running' | 'paused'>('idle');
  const [lastSync, setLastSync] = useState('2 hours ago');

  // Mock data for sync jobs
  const syncJobs = [
    {
      id: 1,
      name: 'Salesforce → Supabase',
      source: 'Salesforce',
      destination: 'Supabase',
      status: 'active',
      lastRun: '2 hours ago',
      nextRun: 'in 4 hours',
      records: 1250,
      schedule: 'Every 6 hours',
      conflicts: 0
    },
    {
      id: 2,
      name: 'HubSpot → Analytics DB',
      source: 'HubSpot',
      destination: 'PostgreSQL',
      status: 'completed',
      lastRun: '30 mins ago',
      nextRun: 'Tomorrow 9:00 AM',
      records: 890,
      schedule: 'Daily',
      conflicts: 2
    },
    {
      id: 3,
      name: 'Stripe → Data Warehouse',
      source: 'Stripe',
      destination: 'BigQuery',
      status: 'error',
      lastRun: '1 hour ago',
      nextRun: 'Paused',
      records: 456,
      schedule: 'Every 2 hours',
      conflicts: 0
    }
  ];

  const platforms = [
    { name: 'Salesforce', connected: true, records: '125k' },
    { name: 'HubSpot', connected: true, records: '89k' },
    { name: 'Stripe', connected: true, records: '45k' },
    { name: 'Supabase', connected: true, records: '260k' },
    { name: 'PostgreSQL', connected: false, records: '0' },
    { name: 'BigQuery', connected: true, records: '180k' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'completed': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'error': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Data Sync Tool</h1>
            <p className="text-muted-foreground">Synchronize data between multiple systems automatically</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              <Activity className="mr-1 h-3 w-3" />
              {syncJobs.filter(job => job.status === 'active').length} Active
            </Badge>
            <Button 
              onClick={() => setSyncStatus(syncStatus === 'running' ? 'paused' : 'running')}
              className={syncStatus === 'running' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'}
            >
              {syncStatus === 'running' ? (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Pause All
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Start All
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Records</p>
                  <p className="text-2xl font-bold">699k</p>
                </div>
                <Database className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Syncs</p>
                  <p className="text-2xl font-bold">{syncJobs.filter(job => job.status === 'active').length}</p>
                </div>
                <RefreshCw className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Conflicts</p>
                  <p className="text-2xl font-bold">{syncJobs.reduce((sum, job) => sum + job.conflicts, 0)}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Platforms</p>
                  <p className="text-2xl font-bold">{platforms.filter(p => p.connected).length}</p>
                </div>
                <Globe className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="platforms">Platforms</TabsTrigger>
            <TabsTrigger value="jobs">Sync Jobs</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {syncJobs.slice(0, 3).map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(job.status)}
                        <div>
                          <p className="font-medium">{job.name}</p>
                          <p className="text-sm text-muted-foreground">Last run: {job.lastRun}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Sync Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5" />
                    Current Sync Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Salesforce → Supabase</span>
                      <span>75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    <p className="text-xs text-muted-foreground">938 of 1,250 records synced</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>HubSpot → Analytics DB</span>
                      <span>100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    <p className="text-xs text-muted-foreground">890 of 890 records synced</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="p-6 h-auto flex-col gap-2">
                    <Zap className="h-8 w-8 text-blue-500" />
                    <span>Create New Sync</span>
                  </Button>
                  <Button variant="outline" className="p-6 h-auto flex-col gap-2">
                    <Globe className="h-8 w-8 text-green-500" />
                    <span>Connect Platform</span>
                  </Button>
                  <Button variant="outline" className="p-6 h-auto flex-col gap-2">
                    <Calendar className="h-8 w-8 text-purple-500" />
                    <span>Schedule Sync</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="platforms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Connected Platforms</CardTitle>
                <p className="text-muted-foreground">Manage your data source and destination platforms</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {platforms.map((platform) => (
                    <Card key={platform.name} className="relative">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold">{platform.name}</h3>
                          <Badge variant={platform.connected ? "default" : "secondary"}>
                            {platform.connected ? "Connected" : "Disconnected"}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Records:</span>
                            <span className="font-medium">{platform.records}</span>
                          </div>
                          <Button 
                            size="sm" 
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                          >
                            {platform.connected ? "Configure" : "Connect"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Sync Jobs</h2>
              <Button>
                <Zap className="mr-2 h-4 w-4" />
                Create New Job
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="p-4 font-medium">Job Name</th>
                        <th className="p-4 font-medium">Source → Destination</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium">Schedule</th>
                        <th className="p-4 font-medium">Records</th>
                        <th className="p-4 font-medium">Conflicts</th>
                        <th className="p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {syncJobs.map((job) => (
                        <tr key={job.id} className="border-b">
                          <td className="p-4 font-medium">{job.name}</td>
                          <td className="p-4">
                            <span className="text-sm">
                              {job.source} → {job.destination}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(job.status)}
                              <Badge variant="outline" className={getStatusColor(job.status)}>
                                {job.status}
                              </Badge>
                            </div>
                          </td>
                          <td className="p-4 text-sm">{job.schedule}</td>
                          <td className="p-4 text-sm">{job.records.toLocaleString()}</td>
                          <td className="p-4">
                            {job.conflicts > 0 ? (
                              <Badge variant="outline" className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                                {job.conflicts}
                              </Badge>
                            ) : (
                              <span className="text-sm text-muted-foreground">None</span>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">Edit</Button>
                              <Button size="sm" variant="outline">
                                {job.status === 'active' ? 'Pause' : 'Run'}
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

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sync-interval">Default Sync Interval</Label>
                    <Select defaultValue="6hours">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1hour">Every Hour</SelectItem>
                        <SelectItem value="6hours">Every 6 Hours</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-retry">Auto Retry Failed Syncs</Label>
                      <p className="text-sm text-muted-foreground">Automatically retry failed sync jobs</p>
                    </div>
                    <Switch id="auto-retry" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="conflict-resolution">Auto Conflict Resolution</Label>
                      <p className="text-sm text-muted-foreground">Use latest timestamp for conflicts</p>
                    </div>
                    <Switch id="conflict-resolution" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="notification-email">Notification Email</Label>
                    <Input 
                      id="notification-email" 
                      type="email" 
                      placeholder="admin@company.com"
                      defaultValue="admin@econest.com"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="error-notifications">Error Notifications</Label>
                      <p className="text-sm text-muted-foreground">Get notified about sync errors</p>
                    </div>
                    <Switch id="error-notifications" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="success-notifications">Success Notifications</Label>
                      <p className="text-sm text-muted-foreground">Get notified about successful syncs</p>
                    </div>
                    <Switch id="success-notifications" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Backup & Recovery</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Last backup was created on March 15, 2024. Consider creating a new backup before making significant changes.
                  </AlertDescription>
                </Alert>
                
                <div className="flex gap-4">
                  <Button variant="outline">
                    <Database className="mr-2 h-4 w-4" />
                    Create Backup
                  </Button>
                  <Button variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Restore From Backup
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}