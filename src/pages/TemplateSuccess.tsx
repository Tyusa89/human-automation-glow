import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, ArrowRight, Settings2, LayoutDashboard, Mail, Globe, Calendar, Briefcase } from 'lucide-react';
import { getTemplateById } from '@/lib/templates';
import { supabase } from '@/integrations/supabase/client';

export default function TemplateSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const templateId = searchParams.get('template');
  const [template, setTemplate] = useState(getTemplateById(templateId || ''));
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (templateId) {
      setTemplate(getTemplateById(templateId));
    }
    fetchProfile();
  }, [templateId]);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      setProfile(data);
    }
  };

  // Format template ID for display if template not found in registry
  const formatTemplateId = (id: string) => {
    return id
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const templateName = template?.title || (templateId ? formatTemplateId(templateId) : 'Your system');

  // Get business type label
  const getBusinessTypeLabel = () => {
    const types: Record<string, string> = {
      consultant: "Consultant",
      coach: "Coach",
      freelancer: "Freelancer",
      creative: "Creative / Designer",
      creative_designer: "Creative / Designer",
      "local-service": "Local Service Provider",
      local_service_provider: "Local Service Provider",
      other: "Business",
    };
    return types[profile?.work_type] || types[profile?.business_type] || "Business";
  };

  // Get preferences
  const preferences = profile?.preferences as Record<string, unknown> | null;
  const emailEnabled = preferences?.email_reminders ?? true;
  const timezone = profile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-lg border-border/50 shadow-xl">
        <CardContent className="pt-8 pb-8 space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">System activated ✓</h1>
            <p className="text-muted-foreground mt-2">
              Your <span className="text-foreground font-medium">{templateName}</span> is live and configured for your workflow.
            </p>
          </div>

          {/* Mini recap box */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                <span>Business type</span>
              </div>
              <span className="text-foreground font-medium">{getBusinessTypeLabel()}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Globe className="h-4 w-4" />
                <span>Timezone</span>
              </div>
              <span className="text-foreground font-medium text-right max-w-[200px] truncate">
                {timezone}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>Notifications</span>
              </div>
              <span className="text-foreground font-medium">
                {emailEnabled ? "Email on" : "Email off"}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Calendar</span>
              </div>
              <span className="text-foreground font-medium">Not connected</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-2">
            <Button 
              onClick={() => navigate('/dashboard')} 
              size="lg"
              className="w-full"
            >
              <LayoutDashboard className="mr-2 h-5 w-5" />
              Go to Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            {templateId && (
              <Button 
                onClick={() => navigate(`/templates/${templateId}/setup?mode=advanced`)} 
                variant="ghost"
                className="w-full text-muted-foreground hover:text-foreground"
              >
                <Settings2 className="mr-2 h-4 w-4" />
                View template settings
              </Button>
            )}
          </div>

          {/* Tip */}
          <p className="text-xs text-muted-foreground/70 text-center">
            Next: Run a quick test to confirm everything is working.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
