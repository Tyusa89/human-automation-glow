import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Calendar, Users, Bot, Settings, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { getActivationComplete } from "@/dashboard/activation";

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  completed: boolean;
}

export function SetupChecklist() {
  const [dismissed, setDismissed] = useState(false);
  const [items, setItems] = useState<ChecklistItem[]>([
    { id: 'profile', label: 'Complete your profile', description: 'Add your name and company', icon: Settings, href: '/dashboard', completed: false },
    { id: 'appointments', label: 'Set up appointments', description: 'Configure booking services', icon: Calendar, href: '/appointments', completed: false },
    { id: 'leads', label: 'Add your first lead', description: 'Start tracking contacts', icon: Users, href: '/dashboard', completed: false },
    { id: 'ai', label: 'Try the AI assistant', description: 'Ask a question to get started', icon: Bot, href: '/help', completed: false },
  ]);

  useEffect(() => {
    const dismissedStorage = localStorage.getItem('setup-checklist-dismissed');
    if (dismissedStorage) setDismissed(true);
    checkProgress();
  }, []);

  const checkProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch all data needed for checklist + activation check
      const [profileResult, leadsResult, templatesResult, runsResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('full_name, company, onboarding_completed')
          .eq('user_id', user.id)
          .maybeSingle(),
        supabase
          .from('leads')
          .select('id')
          .eq('owner_id', user.id)
          .limit(1),
        supabase
          .from('user_templates')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id)
          .eq('is_active', true),
        supabase
          .from('workflow_runs')
          .select('id')
          .eq('owner_id', user.id)
          .eq('status', 'completed')
          .limit(1),
      ]);

      const profile = profileResult.data;
      const hasLeads = (leadsResult.data?.length ?? 0) > 0;
      const activeTemplatesCount = templatesResult.count ?? 0;
      const hasSuccessfulRun = (runsResult.data?.length ?? 0) > 0;

      // Check if activation is complete - if so, hide forever
      const activationComplete = getActivationComplete({
        profile: {
          full_name: profile?.full_name ?? null,
          company: profile?.company ?? null,
          onboarding_completed: profile?.onboarding_completed ?? false,
        },
        activeTemplatesCount,
        hasSuccessfulRun,
        hasFirstValueEvent: hasLeads,
      });

      if (activationComplete) {
        setDismissed(true);
        return;
      }

      setItems(prev => prev.map(item => {
        if (item.id === 'profile' && profile?.full_name && profile?.company) {
          return { ...item, completed: true };
        }
        if (item.id === 'leads' && hasLeads) {
          return { ...item, completed: true };
        }
        return item;
      }));
    } catch (error) {
      console.error('Error checking setup progress:', error);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('setup-checklist-dismissed', 'true');
    setDismissed(true);
  };

  const completedCount = items.filter(i => i.completed).length;
  const progress = (completedCount / items.length) * 100;

  if (dismissed || progress === 100) return null;

  return (
    <Card className="border-white/10 bg-[hsl(220,91%,15%)]/80 backdrop-blur">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base text-white">Setup Checklist</CardTitle>
            <CardDescription className="text-sm text-slate-400">
              {completedCount} of {items.length} completed
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Progress value={progress} className="h-1.5 mt-2" />
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map(item => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              to={item.href}
              className={cn(
                "flex items-center gap-3 p-2 rounded-lg transition-colors",
                "hover:bg-white/5",
                item.completed && "opacity-60"
              )}
            >
              {item.completed ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-slate-500 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className={cn(
                  "text-sm font-medium text-white",
                  item.completed && "line-through text-slate-400"
                )}>
                  {item.label}
                </div>
                <div className="text-xs text-slate-500 truncate">
                  {item.description}
                </div>
              </div>
              <Icon className="h-4 w-4 text-slate-500 flex-shrink-0" />
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
