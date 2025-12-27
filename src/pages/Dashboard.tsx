import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Users, CheckSquare, BookOpen, Activity, MoreHorizontal, Settings, Download, RefreshCw, ArrowLeft, Calendar, DollarSign, Clock, Target, UserCheck, ListTodo } from 'lucide-react';
import LeadsTable from '@/components/LeadsTable';
import TasksTable from '@/components/TasksTable';
import KBList from '@/components/KBList';
import TracesList from '@/components/TracesList';
import { SPADEProcessor } from '@/components/SPADEProcessor';
import ProfileCard from '@/components/ProfileCard';
import CompleteProfile from '@/components/CompleteProfile';
import { SetupChecklist } from '@/components/dashboard/SetupChecklist';
import { runTask } from '@/lib/db';
import { supabase } from '@/integrations/supabase/client';
import { useEnsureProfile } from '@/hooks/useEnsureProfile';
import { useToast } from '@/hooks/use-toast';
import { useRole, isAdminLike } from '@/hooks/useRole';

type UserPreferences = {
  work_type: string | null;
  hardest_things: string[];
  setup_goals: string[];
};

const Dashboard = () => {
  console.log('=== DASHBOARD COMPONENT LOADED ===');
  useEnsureProfile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { role, loading } = useRole();
  const admin = isAdminLike(role);
  console.log('Dashboard - role:', role, 'admin:', admin, 'loading:', loading);
  const [activeTab, setActiveTab] = useState('leads');
  const [lastKpi, setLastKpi] = useState<any>(null);
  const [preferences, setPreferences] = useState<UserPreferences>({
    work_type: null,
    hardest_things: [],
    setup_goals: [],
  });

  async function loadLastKpi() {
    console.log('Loading latest KPI data...');
    const { data } = await supabase
      .from('results')
      .select('*')
      .eq('task', 'daily_kpi')
      .order('created_at', { ascending: false })
      .limit(1);
    console.log('KPI query result:', data);
    setLastKpi(data?.[0]?.payload || null);
  }

  async function loadPreferences() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('work_type, hardest_things, setup_goals')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (profile) {
      setPreferences({
        work_type: profile.work_type,
        hardest_things: profile.hardest_things || [],
        setup_goals: profile.setup_goals || [],
      });
    }
  }

  useEffect(() => { 
    loadLastKpi(); 
    loadPreferences();
  }, []);

  // Add real-time subscription for KPI updates
  useEffect(() => {
    console.log('Setting up real-time subscription for KPI updates...');
    const channel = supabase
      .channel('results-kpi-dashboard')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'results', filter: "task=eq.daily_kpi" },
        (payload) => {
          console.log('Real-time KPI update received:', payload);
          loadLastKpi();
        }
      )
      .subscribe((status) => {
        console.log('KPI subscription status:', status);
      });
    return () => { 
      console.log('Cleaning up KPI subscription...');
      supabase.removeChannel(channel); 
    };
  }, []);

  async function handleRunDaily() {
    alert('BUTTON CLICKED! Check console for details.');
    console.log('=== RUN DAILY SUMMARY CLICKED ===');
    try {
      console.log('About to call runTask...');
      const result = await runTask('daily_kpi', { since: 'yesterday' });
      console.log('runTask completed with result:', result);
      if (result.status === 'ok') {
        console.log('Task successful, loading KPI...');
        await loadLastKpi();
        toast({
          title: "Success",
          description: "Daily KPI report generated successfully",
        });
      }
    } catch (error) {
      console.error('Error in handleRunDaily:', error);
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

  // Widget visibility based on work_type
  const showClientList = ['consultant', 'freelancer', 'creative'].includes(preferences.work_type || '');
  const showAppointments = ['consultant', 'local-service'].includes(preferences.work_type || '');
  const showProjectBoard = ['creative', 'freelancer'].includes(preferences.work_type || '');
  const showDailyJobs = preferences.work_type === 'local-service';

  // Widget visibility based on hardest_things
  const showIncomeWidget = preferences.hardest_things.includes('income');
  const showFollowUpWidget = preferences.hardest_things.includes('followups');
  const showTaskListWidget = preferences.hardest_things.includes('organized');
  const showFocusTodayWidget = preferences.hardest_things.includes('focus');
  const showTimeWidget = preferences.hardest_things.includes('time');
  const isOverwhelmedMode = preferences.hardest_things.includes('overwhelmed');

  // Focus Today message based on hardest things
  const getFocusTodayMessage = () => {
    if (preferences.hardest_things.includes('overwhelmed')) {
      return "One step at a time. Here's your single focus:";
    }
    if (preferences.hardest_things.includes('focus')) {
      return "Your top priority today:";
    }
    return "Your focus today:";
  };

  // Dynamic stats based on work type
  const getStats = () => {
    const baseStats = [
      {
        title: "Total Leads",
        value: "24",
        icon: Users,
        change: "+12%",
        show: showClientList || preferences.work_type === 'other' || !preferences.work_type,
      },
      {
        title: "Active Tasks",
        value: "8",
        icon: CheckSquare,
        change: "+3",
        show: showTaskListWidget || !preferences.hardest_things.length,
      },
      {
        title: "This Week's Income",
        value: "$1,240",
        icon: DollarSign,
        change: "+$320",
        show: showIncomeWidget,
      },
      {
        title: "Upcoming Appointments",
        value: "5",
        icon: Calendar,
        change: "Next: 2pm",
        show: showAppointments,
      },
      {
        title: "Pending Follow-ups",
        value: "3",
        icon: UserCheck,
        change: "2 overdue",
        show: showFollowUpWidget,
      },
      {
        title: "Time Logged Today",
        value: "4.5h",
        icon: Clock,
        change: "Goal: 6h",
        show: showTimeWidget,
      },
      {
        title: "KB Articles",
        value: "156",
        icon: BookOpen,
        change: "+23",
        show: !isOverwhelmedMode && admin,
      },
      {
        title: "System Traces",
        value: "1,247",
        icon: Activity,
        change: "+156",
        show: !isOverwhelmedMode && admin,
      },
    ];

    // In overwhelmed mode, show max 4 widgets
    const filteredStats = baseStats.filter(s => s.show);
    return isOverwhelmedMode ? filteredStats.slice(0, 4) : filteredStats;
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Back Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate(-1)}
                className="h-10 w-10"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Go back</span>
              </Button>
              
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Dashboard
                </h1>
                <p className="text-muted-foreground">
                  {isOverwhelmedMode 
                    ? "Let's keep it simple today." 
                    : "Monitor your automation, leads, tasks, and system performance"}
                </p>
              </div>
            </div>
            
            {/* Three Dots Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <MoreHorizontal className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-background border border-border">
                <DropdownMenuItem onClick={() => loadLastKpi()} className="cursor-pointer">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh KPI Data
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleRunDaily} className="cursor-pointer">
                  <Download className="mr-2 h-4 w-4" />
                  Generate Daily Report
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => setActiveTab('tasks')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Task Management
                </DropdownMenuItem>
                {admin && (
                  <DropdownMenuItem className="cursor-pointer" onClick={() => setActiveTab('traces')}>
                    <Activity className="mr-2 h-4 w-4" />
                    System Traces
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Focus Today Widget - appears when "focus" or "overwhelmed" is selected */}
      {(showFocusTodayWidget || isOverwhelmedMode) && (
        <div className="container mx-auto px-4 py-4">
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Target className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{getFocusTodayMessage()}</p>
                  <p className="font-semibold text-foreground">Follow up with 3 pending client responses</p>
                </div>
                <Button size="sm">Mark Done</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Setup Checklist & Complete Profile */}
      {!isOverwhelmedMode && (
        <div className="container mx-auto px-4 py-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <SetupChecklist />
            <div className="lg:col-span-2">
              <CompleteProfile />
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className={`grid grid-cols-1 md:grid-cols-2 ${isOverwhelmedMode ? 'lg:grid-cols-2' : 'lg:grid-cols-4'} gap-6 mb-8`}>
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

        {/* Profile Section - hidden in overwhelmed mode */}
        {!isOverwhelmedMode && (
          <div className="container mx-auto px-4 py-6">
            <ProfileCard />
          </div>
        )}

        {/* Main Content Tabs - simplified in overwhelmed mode */}
        <Card className="border-accent/20">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className={`grid w-full ${
                isOverwhelmedMode 
                  ? 'grid-cols-2' 
                  : admin 
                    ? 'grid-cols-6' 
                    : 'grid-cols-4'
              }`}>
                {showClientList && <TabsTrigger value="leads">Leads</TabsTrigger>}
                {!showClientList && <TabsTrigger value="leads">Clients</TabsTrigger>}
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                {!isOverwhelmedMode && <TabsTrigger value="kb">Knowledge Base</TabsTrigger>}
                {!isOverwhelmedMode && <TabsTrigger value="spade">SPADE Demo</TabsTrigger>}
                {/* Admin-only tabs */}
                {admin && !isOverwhelmedMode && <TabsTrigger value="traces">Traces</TabsTrigger>}
                {admin && !isOverwhelmedMode && <TabsTrigger value="results">Results</TabsTrigger>}
              </TabsList>
              
              <TabsContent value="leads" className="mt-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {showClientList ? 'Recent Leads' : 'Your Clients'}
                  </h3>
                  <p className="text-muted-foreground">
                    {showClientList ? 'Latest 25 leads from your contact forms' : 'Manage your client relationships'}
                  </p>
                </div>
                <LeadsTable />
              </TabsContent>
              
              <TabsContent value="tasks" className="mt-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Task Management</h3>
                  <p className="text-muted-foreground">Track and manage your automation tasks</p>
                </div>
                {!isOverwhelmedMode && (
                  <div className="mb-4 flex items-center gap-3">
                    <Button onClick={handleRunDaily}>Run Daily Summary</Button>
                    {lastKpi && (
                      <div className="text-sm text-muted-foreground">
                        Last: {lastKpi.date} · Leads {lastKpi.leads_today} · Tasks {lastKpi.tasks_run} · Avg resp {lastKpi.avg_response_min}m
                      </div>
                    )}
                  </div>
                )}
                <TasksTable />
              </TabsContent>
              
              {!isOverwhelmedMode && (
                <TabsContent value="kb" className="mt-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Knowledge Base</h3>
                    <p className="text-muted-foreground">Search and manage your AI knowledge articles</p>
                  </div>
                  <KBList />
                </TabsContent>
              )}
              
              {!isOverwhelmedMode && (
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
              )}
              
              {/* Admin-only tabs content */}
              {admin && !isOverwhelmedMode && (
                <TabsContent value="traces" className="mt-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-foreground mb-2">System Traces</h3>
                    <p className="text-muted-foreground">Monitor automation activity and system logs</p>
                  </div>
                  <TracesList />
                </TabsContent>
              )}
              
              {admin && !isOverwhelmedMode && (
                <TabsContent value="results" className="mt-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Task Results</h3>
                    <p className="text-muted-foreground">View automation task results and analytics</p>
                  </div>
                  <div className="mb-4 flex items-center gap-3">
                    <Button onClick={handleGenerateSOP}>Generate SOP</Button>
                  </div>
                  {/* Results grid would go here */}
                  <div className="bg-muted/20 rounded-lg p-6 text-center">
                    <p className="text-muted-foreground">Results management interface coming soon</p>
                  </div>
                </TabsContent>
              )}

              {/* Loading state */}
              {loading && (
                <div className="text-sm text-muted-foreground mt-3">
                  Checking permissions…
                </div>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;