import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Settings, Download, RefreshCw, ArrowLeft, Activity, Sliders } from 'lucide-react';
import { SetupChecklist } from '@/components/dashboard/SetupChecklist';
import { useDashboardSuggestion, DashboardSuggestionCard } from '@/dashboard/suggestions';
import { 
  FocusToday, 
  WeeklyIncome, 
  MonthlyIncome, 
  IncomeChart, 
  ClientList, 
  FollowUpQueue, 
  AppointmentsToday, 
  TaskList, 
  ProjectBoard, 
  ActivityFeed, 
  AssistantSuggestions 
} from '@/components/dashboard/widgets';
import { 
  getDashboardConfig, 
  resolveDashboardWidgets, 
  type UserProfile,
  type ResolvedWidget 
} from '@/dashboard';
import { runTask } from '@/lib/db';
import { supabase } from '@/integrations/supabase/client';
import { useEnsureProfile } from '@/hooks/useEnsureProfile';
import { useToast } from '@/hooks/use-toast';
import { useRole, isAdminLike } from '@/hooks/useRole';


// Widget component map - using any for flexibility with different widget props
const WidgetComponent: Record<string, React.FC<any>> = {
  focus_today: FocusToday,
  kpi_weekly_income: WeeklyIncome,
  kpi_monthly_income: MonthlyIncome,
  income_trend_chart: IncomeChart,
  client_list: ClientList,
  follow_up_queue: FollowUpQueue,
  appointments_today: AppointmentsToday,
  task_list: TaskList,
  project_board: ProjectBoard,
  activity_feed: ActivityFeed,
  assistant_suggestions: AssistantSuggestions,
};

const Dashboard = () => {
  useEnsureProfile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { role, loading } = useRole();
  const admin = isAdminLike(role);
  const [lastKpi, setLastKpi] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile>({});
  const [widgets, setWidgets] = useState<ResolvedWidget[]>([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  
  const { 
    suggestion, 
    loading: suggestionLoading,
    refresh: refreshSuggestion
  } = useDashboardSuggestion();

  async function loadLastKpi() {
    const { data } = await supabase
      .from('results')
      .select('*')
      .eq('task', 'daily_kpi')
      .order('created_at', { ascending: false })
      .limit(1);
    setLastKpi(data?.[0]?.payload || null);
  }

  async function loadDashboard() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);
    
    // Fetch profile and widget overrides in parallel
    const [profileResult, widgetResult] = await Promise.all([
      supabase
        .from('profiles')
        .select('business_type, client_volume, monthly_revenue_range, tracking_method, success_goal, assistant_level, primary_challenges, work_type, hardest_things')
        .eq('user_id', user.id)
        .maybeSingle(),
      supabase
        .from('user_dashboard_widgets')
        .select('widget_key, enabled, sort_order, config')
        .eq('user_id', user.id)
    ]);
    
    const userProfile = (profileResult.data as UserProfile) || {};
    setProfile(userProfile);
    
    // Get rule-based widgets
    const ruleKeys = getDashboardConfig(userProfile);
    
    // Merge with DB overrides
    const resolvedWidgets = resolveDashboardWidgets(ruleKeys, widgetResult.data);
    setWidgets(resolvedWidgets);
    
    setProfileLoading(false);
  }

  useEffect(() => { 
    loadLastKpi(); 
    loadDashboard();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('results-kpi-dashboard')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'results', filter: "task=eq.daily_kpi" },
        () => loadLastKpi()
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function handleRunDaily() {
    try {
      const result = await runTask('daily_kpi', { since: 'yesterday' });
      if (result.status === 'ok') {
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

  // Group widgets by zone
  const focusWidget = widgets.find(w => w.key === 'focus_today');
  const kpiWidgets = widgets.filter(w => ['kpi_weekly_income', 'kpi_monthly_income', 'income_trend_chart'].includes(w.key));
  const primaryWidgets = widgets.filter(w => ['client_list', 'project_board', 'appointments_today', 'task_list'].includes(w.key));
  const secondaryWidgets = widgets.filter(w => ['follow_up_queue', 'assistant_suggestions', 'activity_feed'].includes(w.key));

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
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
                  Your personalized business overview
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/dashboard/settings')}
                className="gap-2"
              >
                <Sliders className="h-4 w-4" />
                Customize
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10">
                    <MoreHorizontal className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-background border border-border">
                  <DropdownMenuItem onClick={() => loadDashboard()} className="cursor-pointer">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleRunDaily} className="cursor-pointer">
                    <Download className="mr-2 h-4 w-4" />
                    Generate Daily Report
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/dashboard/settings')}>
                    <Sliders className="mr-2 h-4 w-4" />
                    Customize Widgets
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/onboarding')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Update Preferences
                  </DropdownMenuItem>
                  {admin && (
                    <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/admin')}>
                      <Activity className="mr-2 h-4 w-4" />
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Suggestion Banner */}
        {!suggestionLoading && suggestion && (
          <DashboardSuggestionCard 
            suggestion={suggestion} 
            onChanged={async () => {
              await loadDashboard();        // refresh widgets/order first
              await refreshSuggestion();    // then clear banner (single UI update)
            }} 
          />
        )}

        {/* Focus Today - top priority */}
        {focusWidget && (
          <div key={focusWidget.key}>
            <FocusToday />
          </div>
        )}

        {/* Setup Checklist */}
        <SetupChecklist />

        {/* KPI Row */}
        {kpiWidgets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {kpiWidgets.map((widget) => {
              const Component = WidgetComponent[widget.key];
              return Component ? <Component key={widget.key} config={widget.config} /> : null;
            })}
          </div>
        )}

        {/* Main Work Area - 2 column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Primary work widgets */}
          <div className="space-y-6">
            {primaryWidgets.map((widget) => {
              const Component = WidgetComponent[widget.key];
              return Component ? <Component key={widget.key} config={widget.config} /> : null;
            })}
          </div>

          {/* Right Column - Secondary widgets */}
          <div className="space-y-6">
            {secondaryWidgets.map((widget) => {
              const Component = WidgetComponent[widget.key];
              return Component ? <Component key={widget.key} config={widget.config} /> : null;
            })}
          </div>
        </div>

        {/* Last KPI info for admin */}
        {admin && lastKpi && (
          <Card className="border-muted">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">
                Last report: {lastKpi.date} · Leads {lastKpi.leads_today} · Tasks {lastKpi.tasks_run} · Avg resp {lastKpi.avg_response_min}m
              </p>
            </CardContent>
          </Card>
        )}

        {loading && (
          <div className="text-sm text-muted-foreground">
            Checking permissions…
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;