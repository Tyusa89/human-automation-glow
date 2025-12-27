import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Calendar, FileText, Zap, Users, AlertTriangle, Share2, TrendingDown, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MaturitySignals, UserMode } from '@/hooks/useUserMaturity';

const DISMISSAL_KEY = 'econest_nba_dismissed';
const DISMISSAL_HOURS = 48; // Hide dismissed actions for 48 hours

interface NextAction {
  id: string;
  tier: 1 | 2 | 3;
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  buttonLabel: string;
}

interface DismissedAction {
  id: string;
  dismissedAt: number;
}

function getDismissedActions(): DismissedAction[] {
  try {
    const stored = localStorage.getItem(DISMISSAL_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as DismissedAction[];
    const now = Date.now();
    // Filter out expired dismissals
    return parsed.filter(d => (now - d.dismissedAt) < DISMISSAL_HOURS * 60 * 60 * 1000);
  } catch {
    return [];
  }
}

function dismissAction(actionId: string) {
  const current = getDismissedActions();
  const updated = [...current.filter(d => d.id !== actionId), { id: actionId, dismissedAt: Date.now() }];
  localStorage.setItem(DISMISSAL_KEY, JSON.stringify(updated));
}

function isActionDismissed(actionId: string): boolean {
  return getDismissedActions().some(d => d.id === actionId);
}

/**
 * Priority ladder engine - evaluates top to bottom, stops at first valid match
 */
function getNextBestAction(signals: MaturitySignals, mode: UserMode): NextAction | null {
  const actions: NextAction[] = [];

  // ============================================
  // 🟢 TIER 1 — Activation (New Users)
  // Non-skippable milestones
  // ============================================
  
  if (!signals.profileCompleted) {
    actions.push({
      id: 'complete-profile',
      tier: 1,
      title: 'Complete your profile',
      description: 'Finish setting up your account to unlock all features.',
      href: '/onboarding',
      icon: Sparkles,
      buttonLabel: 'Complete setup',
    });
  }

  if (signals.activeTemplatesCount === 0) {
    actions.push({
      id: 'install-template',
      tier: 1,
      title: 'Install your first template',
      description: 'Templates are the fastest way to automate your workflow.',
      href: '/templates',
      icon: FileText,
      buttonLabel: 'Browse templates',
    });
  }

  if (signals.activeTemplatesCount > 0 && !signals.hasSuccessfulAutomationRun) {
    actions.push({
      id: 'run-automation',
      tier: 1,
      title: 'Run your first automation',
      description: 'This activates EcoNest and unlocks insights.',
      href: '/integrations',
      icon: Zap,
      buttonLabel: 'Run automation',
    });
  }

  if (signals.activeTemplatesCount > 0 && signals.hasSuccessfulAutomationRun && !signals.hasFirstValueEvent) {
    actions.push({
      id: 'first-value',
      tier: 1,
      title: 'Book a test appointment or add a lead',
      description: 'See EcoNest working in real-time with real data.',
      href: '/appointments',
      icon: Calendar,
      buttonLabel: 'Get started',
    });
  }

  // ============================================
  // 🔵 TIER 2 — Momentum (Early Power Users)
  // Actions that compound value
  // ============================================
  
  if (signals.automationErrorsCount > 0) {
    actions.push({
      id: 'fix-automation',
      tier: 2,
      title: 'Fix failed automation',
      description: `${signals.automationErrorsCount} automation${signals.automationErrorsCount > 1 ? 's' : ''} need${signals.automationErrorsCount === 1 ? 's' : ''} attention.`,
      href: '/integrations',
      icon: AlertTriangle,
      buttonLabel: 'Review errors',
    });
  }

  if (signals.appointmentsEnabled && signals.upcomingAppointmentsCount === 0 && signals.hasFirstValueEvent) {
    actions.push({
      id: 'share-booking',
      tier: 2,
      title: 'Share your booking link',
      description: 'No upcoming appointments. Time to get booked.',
      href: '/appointments',
      icon: Share2,
      buttonLabel: 'Share link',
    });
  }

  if (signals.hasLeads && !signals.hasSuccessfulAutomationRun) {
    actions.push({
      id: 'automate-followup',
      tier: 2,
      title: 'Automate lead follow-up',
      description: 'Never miss a follow-up with automated sequences.',
      href: '/integrations',
      icon: Users,
      buttonLabel: 'Set up automation',
    });
  }

  // ============================================
  // 🟣 TIER 3 — Optimization (Power Users)
  // Signals, not tutorials
  // ============================================
  
  // Reactivation mode nudge
  if (mode === 'reactivation') {
    actions.push({
      id: 'resume-activity',
      tier: 3,
      title: 'Resume where you left off',
      description: `Nothing has run in ${signals.daysSinceLastActivity} days. Pick up where you stopped.`,
      href: '/integrations',
      icon: RefreshCw,
      buttonLabel: 'Resume',
    });
  }

  // Find first non-dismissed action by tier priority
  const sortedActions = actions.sort((a, b) => a.tier - b.tier);
  for (const action of sortedActions) {
    if (!isActionDismissed(action.id)) {
      return action;
    }
  }

  return null;
}

interface NextBestActionProps {
  signals: MaturitySignals;
  mode: UserMode;
  className?: string;
}

export function NextBestAction({ signals, mode, className }: NextBestActionProps) {
  const [action, setAction] = useState<NextAction | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setAction(getNextBestAction(signals, mode));
  }, [signals, mode]);

  if (!action || dismissed) return null;

  const Icon = action.icon;
  const tierColors = {
    1: 'from-primary/15 via-primary/5 to-transparent border-primary/30',
    2: 'from-amber-500/15 via-amber-500/5 to-transparent border-amber-500/30',
    3: 'from-slate-500/15 via-slate-500/5 to-transparent border-slate-500/30',
  };
  const tierIconColors = {
    1: 'bg-primary/20 text-primary',
    2: 'bg-amber-500/20 text-amber-500',
    3: 'bg-slate-500/20 text-slate-400',
  };

  const handleDismiss = () => {
    dismissAction(action.id);
    setDismissed(true);
  };

  return (
    <Card className={cn(
      "border bg-gradient-to-r backdrop-blur",
      tierColors[action.tier],
      className
    )}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className={cn(
            "flex-shrink-0 h-12 w-12 rounded-xl flex items-center justify-center",
            tierIconColors[action.tier]
          )}>
            <Icon className="h-6 w-6" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
              Next step
            </p>
            <h3 className="text-base font-semibold text-foreground">
              {action.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {action.description}
            </p>
          </div>

          <div className="flex-shrink-0 flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDismiss}
              className="text-muted-foreground hover:text-foreground"
            >
              Not now
            </Button>
            <Button asChild size="sm" className="gap-1.5">
              <Link to={action.href}>
                {action.buttonLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
