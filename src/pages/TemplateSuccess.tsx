import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, ArrowRight, Home, Eye } from 'lucide-react';
import { getTemplateById } from '@/lib/templates';

// Map template IDs to their demo routes (only for templates with working demos)
const templateDemoRoutes: Record<string, string> = {
  'analytics-dashboard': '/demo/analytics-dashboard',
  'data-sync-tool': '/demo/data-sync-tool',
  'inventory-manager': '/demo/inventory-manager',
  'email-campaign-builder': '/demo/email-campaign-builder',
  'social-media-scheduler': '/demo/social-media-scheduler',
  'report-generator': '/demo/report-generator',
  'zapier-intercom-integration': '/demo/zapier-intercom',
};

export default function TemplateSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const templateId = searchParams.get('template');
  const [template, setTemplate] = useState(getTemplateById(templateId || ''));
  const demoRoute = templateId ? templateDemoRoutes[templateId] : null;

  useEffect(() => {
    if (templateId) {
      setTemplate(getTemplateById(templateId));
    }
  }, [templateId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-900 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl border-2 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-3xl font-bold">Template Generated Successfully!</CardTitle>
          <CardDescription className="text-lg">
            {template ? (
              <>Your <span className="font-semibold text-foreground">{template.title}</span> template has been configured and is ready to use.</>
            ) : (
              'Your template has been configured and is ready to use.'
            )}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {template && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-lg">Template Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Template:</span>
                  <span className="font-medium">{template.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium">{template.category}</span>
                </div>
                {template.difficulty && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Difficulty:</span>
                    <span className="font-medium">{template.difficulty}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="font-semibold">Next Steps:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Your template configuration has been saved</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>You can now explore the demo or return to browse more templates</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Sign in to your dashboard to access full features and customization</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            {demoRoute && (
              <Button 
                onClick={() => navigate(demoRoute)} 
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
              >
                <Eye className="mr-2 h-5 w-5" />
                View Dashboard Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => navigate('/templates')} 
                variant="outline"
                className="flex-1"
              >
                <Home className="mr-2 h-4 w-4" />
                Browse Templates
              </Button>
              <Button 
                onClick={() => navigate('/auth')} 
                className="flex-1"
              >
                Sign In to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
