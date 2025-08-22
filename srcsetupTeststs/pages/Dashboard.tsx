import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, CheckSquare, BookOpen, Activity } from 'lucide-react';
import LeadsTable from '@/components/LeadsTable';
import TasksTable from '@/components/TasksTable';
import KBList from '@/components/KBList';
import TracesList from '@/components/TracesList';
import { SPADEProcessor } from '@/components/SPADEProcessor';
import ProfileCard from '@/components/ProfileCard';
import CompleteProfile from '@/components/CompleteProfile';
import { runTask } from '@/lib/api';
import { supabase } from '@/integrations/supabase/client';
import { useEnsureProfile } from '@/hooks/useEnsureProfile';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  useEnsureProfile();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('leads');
  const [lastKpi, setLastKpi] = useState<any>(null);

  async function loadLastKpi() {
    const { data } = await supabase
      .from('results')
      .select('*')
      .eq('task', 'daily_kpi')
      .order('created_at', { ascending: false })
      .limit(1);
    setLastKpi(data?.[0]?.payload || null);
  }

  useEffect(() => { loadLastKpi(); }, []);

  async function handleRunDaily() {
    try {
      const { status } = await runTask('daily_kpi', { since: 'yesterday' });
      if (status === 'ok') {
        await loadLastKpi();
        toast({
          title: "Success",
          description: "Daily KPI report generated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate daily KPI report",
        variant: "destructive",
      });
    }
  }

  async function handleGenerateSOP() {
    try {
      const { status } = await runTask('generate_sop', { topic: 'Onboarding New Lead' });
      if (status === 'ok') {
        toast({
          title: "Success",
          description: "SOP for 'Onboarding New Lead' generated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate SOP",
        variant: "destructive",
      });
    }
  }

  const stats = [
    {
      title: "Total Leads",
      value: "24",
      icon: Users,
      change: "+12%"
    },
    {
      title: "Active Tasks",
      value: "8",
      icon: CheckSquare,
      change: "+3"
    },
    {
      title: "KB Articles",
      value: "156",
      icon: BookOpen,
      change: "+23"
    },
    {
      title: "System Traces",
      value: "1,247",
      icon: Activity,
      change: "+156"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor your automation, leads, tasks, and system performance
          </p>
        </div>
      </div>

      {/* Complete Profile Prompt */}
      <div className="container mx-auto px-4 py-6">
        <CompleteProfile />
      </div>

      {/* Stats Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="border-accent/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {stat.value}
                      </p>
                      <p className="text-sm text-accent">
                        {stat.change}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Profile Section */}
        <div className="container mx-auto px-4 py-6">
          <ProfileCard />
        </div>

        {/* Main Content Tabs */}
        <Card className="border-accent/20">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="leads">Leads</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="kb">Knowledge Base</TabsTrigger>
                <TabsTrigger value="traces">Traces</TabsTrigger>
                <TabsTrigger value="spade">SPADE Demo</TabsTrigger>
              </TabsList>
              
              <TabsContent value="leads" className="mt-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Recent Leads</h3>
                  <p className="text-muted-foreground">Latest 25 leads from your contact forms</p>
                </div>
                <LeadsTable />
              </TabsContent>
              
              <TabsContent value="tasks" className="mt-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Task Management</h3>
                  <p className="text-muted-foreground">Track and manage your automation tasks</p>
                </div>
                <div className="mb-4 flex items-center gap-3">
                  <Button onClick={handleRunDaily}>Run Daily Summary</Button>
                  {lastKpi && (
                    <div className="text-sm text-muted-foreground">
                      Last: {lastKpi.date} · Leads {lastKpi.leads_today} · Tasks {lastKpi.tasks_run} · Avg resp {lastKpi.avg_response_min}m
                    </div>
                  )}
                </div>
                <TasksTable />
              </TabsContent>
              
              <TabsContent value="kb" className="mt-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Knowledge Base</h3>
                  <p className="text-muted-foreground">Search and manage your AI knowledge articles</p>
                </div>
                <KBList />
              </TabsContent>
              
              <TabsContent value="traces" className="mt-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">System Traces</h3>
                  <p className="text-muted-foreground">Monitor automation activity and system logs</p>
                </div>
                <TracesList />
              </TabsContent>
              
              <TabsContent value="spade" className="mt-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">SPADE Processing Demo</h3>
                  <p className="text-muted-foreground">Demonstrating AI-powered lead processing using SPADE methodology</p>
                </div>
                <SPADEProcessor 
                  userInput="Hi, I'm Mia from LumenCo. We need help automating weekly reports."
                  context={{ source: 'website', timestamp: new Date().toISOString() }}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;