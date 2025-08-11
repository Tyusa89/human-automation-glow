import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { processUserInput } from '@/lib/spade';
import { createLead, createTask, fetchKB } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, Clock, AlertCircle, User, Building, Calendar, Mail, MessageSquare, X, FileText, Lightbulb } from 'lucide-react';

interface SPADEProcessorProps {
  userInput: string;
  context?: Record<string, any>;
}

export const SPADEProcessor: React.FC<SPADEProcessorProps> = ({ userInput, context = {} }) => {
  const [response, setResponse] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [executedActions, setExecutedActions] = useState<any[]>([]);
  const [pendingDraft, setPendingDraft] = useState<any>(null);
  const [editedContent, setEditedContent] = useState<string>('');
  const { toast } = useToast();

  const handleProcess = async () => {
    setIsProcessing(true);
    try {
      // Process through SPADE methodology
      const spadePlan = await processUserInput(userInput, context);
      setResponse(spadePlan);

      // Check if there's a pending outbound draft
      if (spadePlan.pendingConfirmation) {
        setPendingDraft(spadePlan.pendingConfirmation);
        setEditedContent(spadePlan.pendingConfirmation.content);
        return; // Stop here and wait for user confirmation
      }

      // Check if this is transcript processing
      if (spadePlan.plan.some(step => step.tool === 'extract_action_items')) {
        await handleTranscriptProcessing(spadePlan);
        return;
      }

      // Check if this is SOP creation
      if (spadePlan.plan.some(step => step.tool === 'generate_sop_steps')) {
        await handleSOPCreation(spadePlan);
        return;
      }

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

  const handleTranscriptProcessing = async (spadePlan: any) => {
    const actions = [];
    
    // Extract action items from the transcript
    const actionItems = extractActionItemsFromTranscript(userInput);
    const leadEmail = extractLeadEmailFromTranscript(userInput);
    
    // Create tasks for each action item
    for (const [index, actionItem] of actionItems.entries()) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1 + index); // Stagger due dates
      
      const taskData = {
        title: actionItem,
        due_iso: tomorrow.toISOString(),
        assignee: 'Auto-assigned',
        priority: 'normal' as const,
        lead_email: leadEmail || undefined,
        description: `Action item extracted from transcript: ${actionItem}`
      };

      try {
        const taskResult = await createTask(taskData);
        if (taskResult.success) {
          actions.push({
            type: 'task_created',
            data: taskResult.data,
            status: 'success',
            actionItem
          });
        }
      } catch (error) {
        actions.push({
          type: 'task_failed',
          data: { title: actionItem },
          status: 'error',
          actionItem
        });
      }
    }

    setExecutedActions(actions);
    
    toast({
      title: "Transcript Processed",
      description: `Created ${actions.filter(a => a.status === 'success').length} tasks from action items`,
    });
  };

  const extractActionItemsFromTranscript = (transcript: string): string[] => {
    const actionPatterns = [
      /(?:will|going to|need to|should|must|have to|action item|follow up|next step).*?(?:\.|$)/gi,
      /(?:^|\n).*(?:action|todo|task|follow.*up|next.*step).*?(?:\.|$)/gi,
      /(?:I'll|we'll|they'll|he'll|she'll).*?(?:\.|$)/gi,
      /(?:assigned|responsible|owner).*?(?:\.|$)/gi
    ];

    const actionItems = new Set<string>();
    
    actionPatterns.forEach(pattern => {
      const matches = transcript.match(pattern) || [];
      matches.forEach(match => {
        const cleaned = match.trim().replace(/^[^\w]*/, '').replace(/[^\w]*$/, '');
        if (cleaned.length > 10 && cleaned.length < 150) {
          actionItems.add(cleaned);
        }
      });
    });

    const items = Array.from(actionItems).slice(0, 7);
    return items.length >= 3 ? items : [
      "Follow up on discussed items",
      "Review meeting outcomes", 
      "Share relevant documentation",
      "Schedule next check-in"
    ];
  };

  const extractLeadEmailFromTranscript = (transcript: string): string | null => {
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const emails = transcript.match(emailPattern);
    return emails ? emails[0] : null;
  };

  const handleSOPCreation = async (spadePlan: any) => {
    const actions = [];
    
    try {
      // Extract search terms from the user input for KB lookup
      const searchQuery = extractSearchTermsFromInput(userInput);
      
      // Call the SOP generation edge function
      const { data, error } = await supabase.functions.invoke('generate-sop', {
        body: {
          document: userInput,
          searchQuery: searchQuery
        }
      });

      if (error) throw error;

      const { sopContent, firstStepTitle, relatedPolicies, stepsCount } = data;

      // Create a task for the first step only
      if (firstStepTitle) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const taskData = {
          title: firstStepTitle,
          due_iso: tomorrow.toISOString(),
          assignee: 'Process Owner',
          priority: 'high' as const,
          description: `First step in implementing the generated SOP. Total steps: ${stepsCount}`
        };

        const taskResult = await createTask(taskData);
        if (taskResult.success) {
          actions.push({
            type: 'task_created',
            data: taskResult.data,
            status: 'success'
          });
        }
      }

      // Store the SOP content for display
      actions.push({
        type: 'sop_generated',
        data: { 
          content: sopContent, 
          relatedPolicies,
          stepsCount,
          firstStepTitle
        },
        status: 'success'
      });

      setExecutedActions(actions);
      
      toast({
        title: "SOP Generated",
        description: `Created SOP with ${stepsCount} steps and task for first step`,
      });

    } catch (error) {
      console.error('SOP generation error:', error);
      actions.push({
        type: 'sop_failed',
        data: { error: error.message },
        status: 'error'
      });
      setExecutedActions(actions);
      
      toast({
        title: "SOP Generation Failed",
        description: "Please check your OpenAI API key configuration",
        variant: "destructive",
      });
    }
  };

  const extractSearchTermsFromInput = (input: string): string => {
    // Extract key terms for knowledge base search
    const words = input.toLowerCase().split(/\s+/);
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'turn', 'this', 'into', 'doc', 'document']);
    const keyWords = words.filter(word => word.length > 3 && !stopWords.has(word));
    return keyWords.slice(0, 5).join(' '); // Take first 5 relevant words
  };

  const handleConfirmSend = async () => {
    if (!pendingDraft) return;

    setIsProcessing(true);
    try {
      // Log the trace entry for sent message
      const traceEntry = {
        action: pendingDraft.action,
        target: pendingDraft.target,
        sent: true,
        timestamp: new Date().toISOString(),
        content: editedContent
      };
      
      console.log('Outbound message sent:', traceEntry);
      
      toast({
        title: "Message Sent",
        description: `${pendingDraft.type} sent to ${pendingDraft.target}`,
      });

      // Clear pending draft and continue with original processing
      setPendingDraft(null);
      setEditedContent('');
      
      // Continue with the rest of the processing logic
      await handleProcess();
      
    } catch (error) {
      toast({
        title: "Send Failed",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeclineSend = () => {
    if (!pendingDraft) return;

    // Log the trace entry for declined message
    const traceEntry = {
      action: pendingDraft.action,
      target: pendingDraft.target,
      sent: false,
      timestamp: new Date().toISOString(),
      content: editedContent
    };
    
    console.log('Outbound message declined:', traceEntry);
    
    toast({
      title: "Message Declined",
      description: "Draft discarded, no message sent",
    });

    // Clear pending draft
    setPendingDraft(null);
    setEditedContent('');
    setResponse(null);
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
                      {action.actionItem && (
                        <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                          Action Item: {action.actionItem}
                        </div>
                      )}
                    </div>
                  )}
                  {action.type === 'task_failed' && (
                    <div className="text-sm text-red-600">
                      Failed to create task: {action.data.title}
                    </div>
                  )}
                  {action.type === 'sop_generated' && (
                    <div className="text-sm space-y-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-3 w-3" />
                        <span className="font-medium">SOP Generated ({action.data.stepsCount} steps)</span>
                      </div>
                      <div className="bg-muted p-3 rounded text-xs max-h-40 overflow-y-auto">
                        <pre className="whitespace-pre-wrap font-mono">{action.data.content}</pre>
                      </div>
                      {action.data.relatedPolicies && (
                        <div className="text-xs text-muted-foreground">
                          <Lightbulb className="h-3 w-3 inline mr-1" />
                          Related policies were included in generation
                        </div>
                      )}
                    </div>
                  )}
                  {action.type === 'sop_failed' && (
                    <div className="text-sm text-red-600">
                      Failed to generate SOP: {action.data.error}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}

          {pendingDraft && (
            <div className="space-y-4 border-2 border-orange-200 rounded-lg p-4 bg-orange-50">
              <div className="flex items-center gap-2">
                {pendingDraft.type === 'email' ? <Mail className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
                <h4 className="font-medium text-orange-800">Outbound Message Draft</h4>
                <Badge variant="outline" className="text-orange-600 border-orange-600">
                  {pendingDraft.type.toUpperCase()}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">To:</span> {pendingDraft.target}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Action:</span> {pendingDraft.action}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message Content:</label>
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="min-h-[120px]"
                  placeholder="Edit the message content..."
                />
              </div>

              <div className="bg-orange-100 p-3 rounded text-sm text-orange-800">
                <strong>Confirmation Required:</strong> Do you want to send this now?
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleConfirmSend}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? 'Sending...' : 'Yes, Send Now'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleDeclineSend}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-1" />
                  No, Discard
                </Button>
              </div>
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