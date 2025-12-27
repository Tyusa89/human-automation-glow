import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Calendar, FileText, Zap, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MaturitySignals {
  checklistComplete: boolean;
  hasTemplates: boolean;
  hasAutomationRuns: boolean;
  hasLeads: boolean;
  hasAppointments: boolean;
  hasRecentActivity: boolean;
}

interface NextAction {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  priority: number;
}

function getNextAction(signals: MaturitySignals): NextAction | null {
  const actions: NextAction[] = [];

  // Priority order based on user journey
  if (!signals.checklistComplete) {
    actions.push({
      id: 'complete-profile',
      title: 'Complete your profile',
      description: 'Finish setting up your account to unlock all features.',
      href: '/onboarding',
      icon: Sparkles,
      priority: 1,
    });
  }

  if (!signals.hasTemplates) {
    actions.push({
      id: 'install-template',
      title: 'Install your first template',
      description: 'Templates are the fastest way to automate your workflow.',
      href: '/templates',
      icon: FileText,
      priority: 2,
    });
  }

  if (!signals.hasAppointments && signals.hasTemplates) {
    actions.push({
      id: 'setup-appointments',
      title: 'Set up appointments',
      description: 'Start accepting bookings from your clients.',
      href: '/appointments',
      icon: Calendar,
      priority: 3,
    });
  }

  if (!signals.hasLeads && signals.hasTemplates) {
    actions.push({
      id: 'add-lead',
      title: 'Add your first lead',
      description: 'Start tracking your contacts and opportunities.',
      href: '/dashboard',
      icon: Users,
      priority: 4,
    });
  }

  if (!signals.hasAutomationRuns && signals.hasTemplates) {
    actions.push({
      id: 'run-automation',
      title: 'Run your first automation',
      description: 'See EcoNest work in the background for you.',
      href: '/integrations',
      icon: Zap,
      priority: 5,
    });
  }

  // Return highest priority action
  return actions.sort((a, b) => a.priority - b.priority)[0] || null;
}

interface NextBestActionProps {
  signals: MaturitySignals;
  className?: string;
}

export function NextBestAction({ signals, className }: NextBestActionProps) {
  const action = getNextAction(signals);

  if (!action) return null;

  const Icon = action.icon;

  return (
    <Card className={cn(
      "border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent",
      "backdrop-blur",
      className
    )}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-primary uppercase tracking-wide mb-0.5">
              Next step
            </p>
            <h3 className="text-base font-semibold text-foreground truncate">
              {action.title}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {action.description}
            </p>
          </div>

          <Button asChild size="sm" className="flex-shrink-0 gap-1.5">
            <Link to={action.href}>
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
