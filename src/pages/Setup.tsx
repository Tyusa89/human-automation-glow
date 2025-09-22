import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

// Template configuration
const templateConfigs = {
  'lead-qualification-bot': {
    name: 'Lead Qualification Bot',
    description: 'Set up your lead qualification workflow',
    steps: [
      {
        title: 'Basic Information',
        description: 'Configure your bot settings',
        fields: [
          { name: 'botName', label: 'Bot Name', type: 'text', required: true },
          { name: 'welcomeMessage', label: 'Welcome Message', type: 'textarea', required: true },
        ]
      },
      {
        title: 'Qualification Questions',
        description: 'Define your lead qualification criteria',
        fields: [
          { name: 'primaryQuestion', label: 'Primary Question', type: 'text', required: true },
          { name: 'followupQuestions', label: 'Follow-up Questions', type: 'textarea', required: false },
        ]
      },
      {
        title: 'Integration',
        description: 'Connect to your CRM',
        fields: [
          { name: 'crmEndpoint', label: 'CRM Webhook URL', type: 'url', required: false },
          { name: 'notificationEmail', label: 'Notification Email', type: 'email', required: true },
        ]
      }
    ]
  },
  'support-triage': {
    name: 'Support Triage Bot',
    description: 'Configure your support bot',
    steps: [
      {
        title: 'Bot Configuration',
        description: 'Basic bot settings',
        fields: [
          { name: 'botName', label: 'Bot Name', type: 'text', required: true },
          { name: 'department', label: 'Department', type: 'text', required: true },
        ]
      },
      {
        title: 'Knowledge Base',
        description: 'Set up your FAQ knowledge base',
        fields: [
          { name: 'kbSource', label: 'Knowledge Base Source', type: 'text', required: false },
          { name: 'escalationThreshold', label: 'Escalation Threshold', type: 'number', required: true },
        ]
      }
    ]
  },
  'onboarding-flow': {
    name: 'Onboarding Flow',
    description: 'Set up user onboarding',
    steps: [
      {
        title: 'Flow Configuration',
        description: 'Configure onboarding steps',
        fields: [
          { name: 'flowName', label: 'Flow Name', type: 'text', required: true },
          { name: 'welcomeEmail', label: 'Welcome Email Template', type: 'textarea', required: true },
        ]
      }
    ]
  }
};

export default function SetupPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const templateId = searchParams.get('templateId');
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);

  const config = templateId ? templateConfigs[templateId as keyof typeof templateConfigs] : null;

  useEffect(() => {
    if (!templateId || !config) {
      navigate('/templates');
    }
  }, [templateId, config, navigate]);

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Template not found. Redirecting...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentStepConfig = config.steps[currentStep];
  const totalSteps = config.steps.length;
  const isLastStep = currentStep === totalSteps - 1;

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleNext = () => {
    if (isLastStep) {
      handleDeploy();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    
    try {
      // Simulate deployment process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // In a real implementation, this would:
      // 1. Create the template with the form data
      // 2. Set up database tables
      // 3. Configure the bot/flow
      // 4. Return the deployment status
      
      setDeployed(true);
      
      // Redirect to dashboard after a brief delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Deployment failed:', error);
      setIsDeploying(false);
    }
  };

  const isStepValid = () => {
    const requiredFields = currentStepConfig.fields.filter(field => field.required);
    return requiredFields.every(field => formData[field.name]?.trim());
  };

  if (deployed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center space-y-4">
            <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
            <div>
              <h2 className="text-xl font-semibold">Template Deployed!</h2>
              <p className="text-muted-foreground">Your {config.name} is ready to use.</p>
            </div>
            <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-12 px-4">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-4">
            Template Setup
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">{config.name}</h1>
          <p className="text-muted-foreground mt-2">{config.description}</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Step {currentStep + 1} of {totalSteps}</span>
            <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}% complete</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                {currentStep + 1}
              </span>
              {currentStepConfig.title}
            </CardTitle>
            <p className="text-muted-foreground">{currentStepConfig.description}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentStepConfig.fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>
                  {field.label} {field.required && <span className="text-destructive">*</span>}
                </Label>
                {field.type === 'textarea' ? (
                  <textarea
                    id={field.name}
                    className="w-full min-h-[100px] px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={formData[field.name] || ''}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                ) : (
                  <Input
                    id={field.name}
                    type={field.type}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => navigate('/templates')}
            >
              Cancel
            </Button>
            <Button
              onClick={handleNext}
              disabled={!isStepValid() || isDeploying}
            >
              {isDeploying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deploying...
                </>
              ) : isLastStep ? (
                'Deploy Template'
              ) : (
                <>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}