import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CheckCircle2, ArrowRight, Rocket, Settings2, Globe,
  Briefcase, Palette, Wrench, HelpCircle, Users
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { seedWidgetsOnOnboardingComplete } from "@/dashboard";
import { brand } from "@/components/Brand";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const workTypes = [
  { id: 'consultant', label: 'Consultant / Coach', icon: Briefcase },
  { id: 'freelancer', label: 'Freelancer', icon: Users },
  { id: 'creative', label: 'Creative / Designer', icon: Palette },
  { id: 'local-service', label: 'Local Service', icon: Wrench },
  { id: 'other', label: 'Other', icon: HelpCircle },
];

type OnboardingStep = 'setup' | 'preferences';

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState<OnboardingStep>('setup');
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  
  // Step 1: Setup
  const [projectName, setProjectName] = useState('My Workspace');
  const [selectedWorkType, setSelectedWorkType] = useState('consultant');
  const [timezone, setTimezone] = useState(() => 
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Step 2: Preferences (optional)
  const [emailReminders, setEmailReminders] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [aiAssistant, setAiAssistant] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed, full_name')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profile?.onboarding_completed) {
        navigate('/');
        return;
      }
      
      // Pre-fill project name if we have user's name
      if (profile?.full_name) {
        setProjectName(`${profile.full_name}'s Workspace`);
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const profileData = {
        onboarding_completed: true,
        onboarding_step: 'complete',
        onboarding_completed_at: new Date().toISOString(),
        work_type: selectedWorkType,
        timezone,
        preferences: {
          project_name: projectName,
          email_reminders: emailReminders,
          sms_alerts: smsAlerts,
          ai_assistant: aiAssistant,
        },
        assistant_level: aiAssistant ? 'balanced' as const : 'quiet' as const,
      };

      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('user_id', user.id);

      if (error) throw error;

      // Seed default widgets
      await seedWidgetsOnOnboardingComplete(user.id, {
        work_type: selectedWorkType,
      });

      toast.success('You\'re all set! Welcome to EcoNest.');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Failed to complete setup');
    } finally {
      setLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg mb-3">
            <Rocket className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold">{brand.name}</h1>
        </div>

        {/* Step 1: Setup */}
        {step === 'setup' && (
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Set up your workspace</CardTitle>
              <CardDescription>
                Takes about 30 seconds
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Project Name */}
              <div className="space-y-2">
                <Label htmlFor="project-name">Workspace name</Label>
                <Input
                  id="project-name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="My Workspace"
                />
              </div>

              {/* Work Type - Compact Pills */}
              <div className="space-y-2">
                <Label>What do you do?</Label>
                <div className="flex flex-wrap gap-2">
                  {workTypes.map(type => {
                    const Icon = type.icon;
                    const isSelected = selectedWorkType === type.id;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setSelectedWorkType(type.id)}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80 text-muted-foreground"
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {type.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Timezone - Auto-detected */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  Timezone
                </Label>
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  {timezone}
                </div>
              </div>

              {/* Advanced Settings - Collapsible */}
              <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
                <CollapsibleTrigger asChild>
                  <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <Settings2 className="h-3.5 w-3.5" />
                    Advanced settings
                    <ArrowRight className={cn(
                      "h-3 w-3 transition-transform",
                      showAdvanced && "rotate-90"
                    )} />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3">
                  <div className="space-y-3 p-3 bg-muted/30 rounded-lg text-sm">
                    <div className="space-y-1">
                      <Label htmlFor="timezone-input" className="text-xs">Override timezone</Label>
                      <Input
                        id="timezone-input"
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Button 
                className="w-full" 
                size="lg"
                onClick={() => setStep('preferences')}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Preferences (Optional) */}
        {step === 'preferences' && (
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Customize your experience</CardTitle>
              <CardDescription>
                Optional — you can change these anytime
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-reminders">Email reminders</Label>
                    <p className="text-xs text-muted-foreground">Daily digest & task reminders</p>
                  </div>
                  <Switch
                    id="email-reminders"
                    checked={emailReminders}
                    onCheckedChange={setEmailReminders}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-alerts">SMS alerts</Label>
                    <p className="text-xs text-muted-foreground">Urgent notifications only</p>
                  </div>
                  <Switch
                    id="sms-alerts"
                    checked={smsAlerts}
                    onCheckedChange={setSmsAlerts}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="ai-assistant">AI Assistant</Label>
                    <p className="text-xs text-muted-foreground">Smart suggestions & automation</p>
                  </div>
                  <Switch
                    id="ai-assistant"
                    checked={aiAssistant}
                    onCheckedChange={setAiAssistant}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setStep('setup')}
                >
                  Back
                </Button>
                <Button
                  className="flex-1"
                  size="lg"
                  onClick={handleComplete}
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Launch Workspace'}
                  {!loading && <Rocket className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress indicator - Simplified */}
        <div className="flex justify-center gap-2 mt-6">
          <div className={cn(
            "h-1.5 w-12 rounded-full transition-colors",
            "bg-primary"
          )} />
          <div className={cn(
            "h-1.5 w-12 rounded-full transition-colors",
            step === 'preferences' ? "bg-primary" : "bg-muted"
          )} />
        </div>
        
        {/* Skip option - subtle */}
        <div className="text-center mt-4">
          <button
            onClick={handleComplete}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip and use defaults
          </button>
        </div>
      </div>
    </div>
  );
}
