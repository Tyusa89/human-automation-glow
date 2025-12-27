import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CheckCircle2, Calendar, Users, Bot, ArrowRight, Sparkles,
  Briefcase, Palette, Wrench, HelpCircle,
  ListTodo, Target, DollarSign, UserCheck, Clock, Frown
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { seedWidgetsOnOnboardingComplete } from "@/dashboard";
import { brand } from "@/components/Brand";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const workTypes = [
  { id: 'consultant', label: 'Consultant / Coach', description: 'Client sessions, follow-ups, monthly retainers', icon: Briefcase },
  { id: 'freelancer', label: 'Freelancer', description: 'Project-based work, invoicing, deliverables', icon: Users },
  { id: 'creative', label: 'Creative / Designer', description: 'Projects, deadlines, client feedback', icon: Palette },
  { id: 'local-service', label: 'Local Service Provider', description: 'Appointments, daily jobs, on-site work', icon: Wrench },
  { id: 'other', label: 'Other', description: 'General business management', icon: HelpCircle },
];

const hardestThings = [
  { id: 'organized', label: 'Staying organized', description: 'Too many things to track', icon: ListTodo },
  { id: 'focus', label: 'Knowing what to focus on', description: 'Unclear priorities each day', icon: Target },
  { id: 'income', label: 'Tracking income & expenses', description: 'Money in, money out confusion', icon: DollarSign },
  { id: 'followups', label: 'Client follow-ups', description: 'Dropping the ball on replies', icon: UserCheck },
  { id: 'time', label: 'Time management', description: 'Never enough hours', icon: Clock },
  { id: 'overwhelmed', label: 'Feeling overwhelmed', description: 'Too much at once', icon: Frown },
];

const setupGoals = [
  { id: 'appointments', label: 'Appointment Booking', description: 'Let clients book time with you', icon: Calendar },
  { id: 'leads', label: 'Lead Capture & CRM', description: 'Track and manage leads', icon: Users },
  { id: 'ai-assistant', label: 'AI Assistant', description: 'Automate customer support', icon: Bot },
];

type OnboardingStep = 'welcome' | 'work-type' | 'hardest' | 'goals';

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [selectedWorkType, setSelectedWorkType] = useState<string | null>(null);
  const [selectedHardest, setSelectedHardest] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

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
        .select('onboarding_completed')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profile?.onboarding_completed) {
        navigate('/');
        return;
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    } finally {
      setCheckingStatus(false);
    }
  };

  const toggleHardest = (id: string) => {
    setSelectedHardest(prev => {
      if (prev.includes(id)) return prev.filter(h => h !== id);
      if (prev.length >= 2) return prev; // Max 2 selections
      return [...prev, id];
    });
  };

  const toggleGoal = (id: string) => {
    setSelectedGoals(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
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
        setup_goals: selectedGoals,
        work_type: selectedWorkType,
        hardest_things: selectedHardest,
        // Map to new schema fields
        primary_challenges: selectedHardest,
      };

      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('user_id', user.id);

      if (error) throw error;

      // Seed default widgets based on onboarding answers
      await seedWidgetsOnOnboardingComplete(user.id, {
        work_type: selectedWorkType,
        hardest_things: selectedHardest,
        primary_challenges: selectedHardest,
      });

      toast.success('Setup complete! Welcome to Baseframe.');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Failed to complete setup');
    } finally {
      setLoading(false);
    }
  };

  const steps: OnboardingStep[] = ['welcome', 'work-type', 'hardest', 'goals'];
  const currentStepIndex = steps.indexOf(step);

  const goNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex]);
    }
  };

  const goBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setStep(steps[prevIndex]);
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
      <div className="w-full max-w-lg">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg mb-4">
            B
          </div>
          <h1 className="text-2xl font-bold">{brand.name}</h1>
          <p className="text-sm text-muted-foreground">{brand.tagline}</p>
        </div>

        {/* Step: Welcome */}
        {step === 'welcome' && (
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-xl">Welcome to {brand.name}</CardTitle>
              <CardDescription>
                Let's personalize your workspace in under 2 minutes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Dashboard tailored to your work</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Focus on what matters most</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>AI-powered automation</span>
                </div>
              </div>
              <Button 
                className="w-full" 
                size="lg"
                onClick={goNext}
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={handleComplete}
              >
                Skip for now
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step: Work Type */}
        {step === 'work-type' && (
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-xl">What kind of work do you do?</CardTitle>
              <CardDescription>
                This helps us show the right widgets and features.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-3">
                {workTypes.map(type => {
                  const Icon = type.icon;
                  const isSelected = selectedWorkType === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedWorkType(type.id)}
                      className={cn(
                        "w-full p-4 border-2 rounded-xl text-left transition-all",
                        "hover:border-primary/50 hover:bg-muted/50",
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg",
                          isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                        )}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{type.label}</div>
                          <div className="text-sm text-muted-foreground">{type.description}</div>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={goBack}>
                  Back
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={goNext}
                  disabled={!selectedWorkType}
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step: Hardest Things */}
        {step === 'hardest' && (
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-xl">What's hardest for you right now?</CardTitle>
              <CardDescription>
                Pick up to 2. We'll prioritize these on your dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-3">
                {hardestThings.map(thing => {
                  const Icon = thing.icon;
                  const isSelected = selectedHardest.includes(thing.id);
                  const isDisabled = selectedHardest.length >= 2 && !isSelected;
                  return (
                    <button
                      key={thing.id}
                      onClick={() => toggleHardest(thing.id)}
                      disabled={isDisabled}
                      className={cn(
                        "p-3 border-2 rounded-xl text-left transition-all",
                        "hover:border-primary/50 hover:bg-muted/50",
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border",
                        isDisabled && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <div className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg mb-2",
                        isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="font-medium text-sm">{thing.label}</div>
                      <div className="text-xs text-muted-foreground">{thing.description}</div>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={goBack}>
                  Back
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={goNext}
                  disabled={selectedHardest.length === 0}
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step: Goals */}
        {step === 'goals' && (
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-xl">What do you want to set up?</CardTitle>
              <CardDescription>
                Select all that apply. You can always add more later.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-3">
                {setupGoals.map(goal => {
                  const Icon = goal.icon;
                  const isSelected = selectedGoals.includes(goal.id);
                  return (
                    <button
                      key={goal.id}
                      onClick={() => toggleGoal(goal.id)}
                      className={cn(
                        "w-full p-4 border-2 rounded-xl text-left transition-all",
                        "hover:border-primary/50 hover:bg-muted/50",
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg",
                          isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                        )}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{goal.label}</div>
                          <div className="text-sm text-muted-foreground">{goal.description}</div>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={goBack}>
                  Back
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleComplete}
                  disabled={loading}
                >
                  {loading ? 'Setting up...' : 'Complete Setup'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {steps.map((s, i) => (
            <div
              key={s}
              className={cn(
                "h-2 w-8 rounded-full transition-colors",
                i <= currentStepIndex ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}