import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, ArrowRight, Settings2, LayoutDashboard } from 'lucide-react';
import { getTemplateById } from '@/lib/templates';

export default function TemplateSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const templateId = searchParams.get('template');
  const [template, setTemplate] = useState(getTemplateById(templateId || ''));

  useEffect(() => {
    if (templateId) {
      setTemplate(getTemplateById(templateId));
    }
  }, [templateId]);

  // Format template ID for display if template not found in registry
  const formatTemplateId = (id: string) => {
    return id
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const templateName = template?.title || (templateId ? formatTemplateId(templateId) : 'Your system');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-lg border-border/50 shadow-xl">
        <CardHeader className="text-center space-y-4 pb-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Your system is live</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Main message */}
          <div className="text-center">
            <p className="text-muted-foreground">
              We've configured <span className="text-foreground font-medium">{templateName}</span> based on your business.
            </p>
          </div>

          {/* What's ready */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-3">
            <h3 className="font-medium text-sm text-foreground">What's ready:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Smart defaults applied from your profile</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>System configured and active</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Ready to use immediately</span>
              </li>
            </ul>
          </div>

          {/* Primary action */}
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
            
            {/* Secondary action - Advanced settings */}
            {templateId && (
              <Button 
                onClick={() => navigate(`/templates/${templateId}/setup?mode=advanced`)} 
                variant="ghost"
                className="w-full text-muted-foreground hover:text-foreground"
              >
                <Settings2 className="mr-2 h-4 w-4" />
                Advanced settings
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
