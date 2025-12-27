import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Calendar, Users, Bot, Settings, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

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

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, company')
        .eq('user_id', user.id)
        .maybeSingle();

      const { data: leads } = await supabase
        .from('leads')
        .select('id')
        .eq('owner_id', user.id)
        .limit(1);

      setItems(prev => prev.map(item => {
        if (item.id === 'profile' && profile?.full_name && profile?.company) {
          return { ...item, completed: true };
        }
        if (item.id === 'leads' && leads && leads.length > 0) {
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
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">Setup Checklist</CardTitle>
            <CardDescription className="text-sm">
              {completedCount} of {items.length} completed
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
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
                "hover:bg-muted/50",
                item.completed && "opacity-60"
              )}
            >
              {item.completed ? (
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className={cn(
                  "text-sm font-medium",
                  item.completed && "line-through"
                )}>
                  {item.label}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {item.description}
                </div>
              </div>
              <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
