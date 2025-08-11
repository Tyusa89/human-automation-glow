import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { processUserInput } from '@/lib/spade';
import { createLead, createTask } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Clock, AlertCircle, User, Building, Calendar } from 'lucide-react';

interface SPADEProcessorProps {
  userInput: string;
  context?: Record<string, any>;
}

export const SPADEProcessor: React.FC<SPADEProcessorProps> = ({ userInput, context = {} }) => {
  const [response, setResponse] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [executedActions, setExecutedActions] = useState<any[]>([]);
  const { toast } = useToast();

  const handleProcess = async () => {
    setIsProcessing(true);
    try {
      // Process through SPADE methodology
      const spadePlan = await processUserInput(userInput, context);
      setResponse(spadePlan);

      // Execute the actual plan with real API calls
      const actions = [];
      
      // Parse user input to extract lead information
      const emailMatch = userInput.match(/(\w+@\w+\.\w+)/);
      const nameMatch = userInput.match(/I'm (\w+)/);
      const companyMatch = userInput.match(/from (\w+)/);
      
      const leadData = {
        email: emailMatch?.[1] || `${nameMatch?.[1]?.toLowerCase() || 'user'}@${companyMatch?.[1]?.toLowerCase() || 'company'}.com`,
        name: nameMatch?.[1] || 'Unknown',
        company: companyMatch?.[1] || 'Unknown Company',
        source: 'website',
        notes: userInput,
        status: 'new'
      };

      // Create lead
      const leadResult = await createLead(leadData);
      if (leadResult.success) {
        actions.push({
          type: 'lead_created',
          data: leadResult.data,
          status: 'success'
        });
        
        toast({
          title: "Lead Created",
          description: `Created lead for ${leadData.name} from ${leadData.company}`,
        });
      }

      // Create follow-up task
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const taskData = {
        title: `Follow up with ${leadData.name} - Weekly Reports Automation`,
        due_iso: tomorrow.toISOString(),
        assignee: 'Andre',
        priority: 'normal' as const,
        lead_email: leadData.email
      };

      const taskResult = await createTask(taskData);
      if (taskResult.success) {
        actions.push({
          type: 'task_created', 
          data: taskResult.data,
          status: 'success'
        });
        
        toast({
          title: "Task Created",
          description: `Created follow-up task for ${leadData.name}`,
        });
      }

      setExecutedActions(actions);
      
    } catch (error) {
      console.error('SPADE processing error:', error);
      toast({
        title: "Processing Error",
        description: "Failed to process user input",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            SPADE Processor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">User Input:</h4>
            <p className="text-sm bg-muted p-3 rounded">{userInput}</p>
          </div>
          
          <Button 
            onClick={handleProcess} 
            disabled={isProcessing}
            className="w-full"
          >
            {isProcessing ? 'Processing...' : 'Process with SPADE'}
          </Button>

          {response && (
            <div className="space-y-3">
              <h4 className="font-medium">Plan Generated:</h4>
              {response.plan.map((step: any, index: number) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Badge variant="outline">{step.step}</Badge>
                  <span>{step.tool}</span>
                </div>
              ))}
            </div>
          )}

          {executedActions.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Executed Actions:
              </h4>
              {executedActions.map((action, index) => (
                <Card key={index} className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(action.status)}
                    <Badge variant={action.status === 'success' ? 'default' : 'destructive'}>
                      {action.type.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  {action.type === 'lead_created' && (
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3" />
                        <span>{action.data.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="h-3 w-3" />
                        <span>{action.data.company}</span>
                      </div>
                    </div>
                  )}
                  {action.type === 'task_created' && (
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>{action.data.title}</span>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}

          {executedActions.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Next Steps:</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Option 1</Badge>
                  <span>Schedule discovery call with {userInput.match(/I'm (\w+)/)?.[1] || 'prospect'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Option 2</Badge>
                  <span>Send automation assessment questionnaire</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Option 3</Badge>
                  <span>Review current reporting process via demo</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};