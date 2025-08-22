// EcoNest AI SPADE (State, Plan, Assumptions, Decisions, Execute) implementation

interface SPADEState {
  user: string;
  intent: string;
  history: string[];
  env: Record<string, any>;
  plan: PlanStep[];
  confidence: number;
}

interface PlanStep {
  step: string;
  tool: string;
  inputs: Record<string, any>;
  success_criteria: string;
}

interface SPADEAction {
  tool: string;
  inputs: Record<string, any>;
  result?: any;
}

interface SPADEDiff {
  created?: Record<string, any>[];
  updated?: Record<string, any>[];
  deleted?: Record<string, any>[];
  sources?: string[];
}

interface SPADEResponse {
  plan: PlanStep[];
  actions: SPADEAction[];
  diff: SPADEDiff;
  notes: string[];
  pendingConfirmation?: OutboundDraft;
}

interface OutboundDraft {
  type: 'email' | 'sms' | 'api_post' | 'delete' | 'bulk_update';
  target: string;
  content: string;
  action: string;
  inputs: Record<string, any>;
}

interface SPADEConfig {
  confirmationThreshold: number;
  clarificationThreshold: number;
  enableTracing: boolean;
}

export class EcoNestAI {
  private config: SPADEConfig;
  private state: SPADEState;

  constructor(config: Partial<SPADEConfig> = {}) {
    this.config = {
      confirmationThreshold: 0.8,
      clarificationThreshold: 0.6,
      enableTracing: true,
      ...config
    };
    
    this.state = {
      user: '',
      intent: '',
      history: [],
      env: {},
      plan: [],
      confidence: 0
    };
  }

  /**
   * S: Build STATE = {user, intent, history, env, plan, confidence}
   */
  buildState(userInput: string, context: Record<string, any> = {}): SPADEState {
    const intent = this.detectIntent(userInput);
    const confidence = this.calculateConfidence(userInput, intent);
    
    this.state = {
      user: context.user || 'anonymous',
      intent: intent,
      history: [...this.state.history, userInput],
      env: { ...context, timestamp: new Date().toISOString() },
      plan: [],
      confidence: confidence
    };

    if (this.config.enableTracing) {
      console.log('SPADE STATE:', this.state);
    }

    return this.state;
  }

  /**
   * P: Draft PLAN = [{step, tool, inputs, success_criteria}] before acting
   */
  draftPlan(intent: string): PlanStep[] {
    const plans: Record<string, PlanStep[]> = {
      'create_lead': [
        { step: "Check existing lead", tool: "get_lead_status", inputs: {}, success_criteria: "lead found or null" },
        { step: "Fill gaps from KB", tool: "fetch_KB_answer", inputs: {}, success_criteria: "facts present" },
        { step: "Propose next actions", tool: "none", inputs: {}, success_criteria: "user-approved or policy-safe" },
        { step: "Execute", tool: "create_lead", inputs: {}, success_criteria: "diff created" }
      ],
      'create_task': [
        { step: "Check existing lead", tool: "get_lead_status", inputs: {}, success_criteria: "lead found or null" },
        { step: "Fill gaps from KB", tool: "fetch_KB_answer", inputs: {}, success_criteria: "facts present" },
        { step: "Propose next actions", tool: "none", inputs: {}, success_criteria: "user-approved or policy-safe" },
        { step: "Execute", tool: "create_task", inputs: {}, success_criteria: "diff created" }
      ],
      'process_transcript': [
        { step: "Extract action items", tool: "extract_action_items", inputs: {}, success_criteria: "3-7 action items identified" },
        { step: "Identify lead context", tool: "identify_lead_email", inputs: {}, success_criteria: "lead email found or null" },
        { step: "Create tasks for each action", tool: "create_multiple_tasks", inputs: {}, success_criteria: "tasks created for all actions" },
        { step: "Link to lead if present", tool: "link_tasks_to_lead", inputs: {}, success_criteria: "tasks linked to lead email" }
      ],
      'create_sop': [
        { step: "Fetch related policies from KB", tool: "fetch_KB_answer", inputs: {}, success_criteria: "relevant policies retrieved" },
        { step: "Generate SOP steps with AI", tool: "generate_sop_steps", inputs: {}, success_criteria: "numbered steps with owners created" },
        { step: "Create task for first step", tool: "create_task", inputs: {}, success_criteria: "first step task created" },
        { step: "Output SOP document", tool: "format_sop_output", inputs: {}, success_criteria: "formatted SOP presented" }
      ],
      'schedule_meeting': [
        { step: "Check existing lead", tool: "get_lead_status", inputs: {}, success_criteria: "lead found or null" },
        { step: "Fill gaps from KB", tool: "fetch_KB_answer", inputs: {}, success_criteria: "facts present" },
        { step: "Propose next actions", tool: "none", inputs: {}, success_criteria: "user-approved or policy-safe" },
        { step: "Execute", tool: "schedule_meeting", inputs: {}, success_criteria: "diff created" }
      ]
    };

    return plans[intent] || [
      { step: "Clarify intent", tool: "ask_question", inputs: {}, success_criteria: "intent understood" }
    ];
  }

  /**
   * A: Validate assumptions vs KB; if mismatch or confidence<0.6, ask 1 targeted question or switch to retrieval
   */
  validateAssumptions(state: SPADEState): { valid: boolean; question?: string; options?: string[] } {
    if (state.confidence < this.config.clarificationThreshold) {
      return {
        valid: false,
        question: `I need clarification about: ${state.intent}. What specifically would you like me to do?`,
        options: ['Summarize options', 'Pull docs', 'Escalate to human']
      };
    }

    return { valid: true };
  }

  /**
   * D: Apply policies: confirm irreversible actions; never send or delete without explicit Confirm
   */
  async applyPolicies(plan: PlanStep[]): Promise<{ approved: boolean; pendingDraft?: OutboundDraft }> {
    const outboundActions = ['send_email', 'send_sms', 'send_chat', 'api_post', 'send_notification'];
    const irreversibleActions = ['delete_data', 'bulk_update', 'create_payment', 'publish_content'];
    
    for (const step of plan) {
      // Check for outbound messages that need drafting
      if (outboundActions.includes(step.tool)) {
        const draft = this.generateOutboundDraft(step);
        return { approved: false, pendingDraft: draft };
      }
      
      // Check for other irreversible actions
      if (irreversibleActions.includes(step.tool)) {
        const confirmed = await this.requestConfirmation(step.tool, step.inputs);
        if (!confirmed) {
          return { approved: false };
        }
      }
    }
    
    return { approved: true };
  }

  private generateOutboundDraft(step: PlanStep): OutboundDraft {
    const { tool, inputs } = step;
    let content = '';
    let target = '';
    
    switch (tool) {
      case 'send_email':
        target = inputs.email || inputs.to || 'recipient@example.com';
        content = inputs.subject ? `Subject: ${inputs.subject}\n\n${inputs.body || inputs.message || ''}` : inputs.message || '';
        break;
      case 'send_sms':
        target = inputs.phone || inputs.to || '+1234567890';
        content = inputs.message || '';
        break;
      case 'api_post':
        target = inputs.url || inputs.endpoint || 'External API';
        content = JSON.stringify(inputs.data || inputs.payload || {}, null, 2);
        break;
      default:
        target = inputs.target || 'Unknown';
        content = inputs.content || inputs.message || JSON.stringify(inputs, null, 2);
    }

    return {
      type: tool.replace('send_', '') as OutboundDraft['type'],
      target,
      content,
      action: step.step,
      inputs
    };
  }

  /**
   * E: Execute tools step-by-step; return a DIFF of changes and cite sources
   */
  async execute(plan: PlanStep[]): Promise<SPADEResponse> {
    const actions: SPADEAction[] = [];
    const diff: SPADEDiff = {
      created: [],
      updated: [],
      deleted: [],
      sources: []
    };
    const notes: string[] = [];

    for (const step of plan) {
      try {
        const action: SPADEAction = {
          tool: step.tool,
          inputs: step.inputs
        };

        // Execute the tool (mock implementation)
        const result = await this.executeTool(step.tool, step.inputs);
        action.result = result;
        actions.push(action);

        // Update diff based on action
        if (result.created) {
          diff.created?.push(result.created);
        }
        if (result.updated) {
          diff.updated?.push(result.updated);
        }
        if (result.source) {
          diff.sources?.push(result.source);
        }

        notes.push(`✓ ${step.step} completed successfully`);
      } catch (error) {
        notes.push(`✗ ${step.step} failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return {
      plan,
      actions,
      diff,
      notes
    };
  }

  /**
   * Process user input following complete SPADE methodology
   */
  async process(userInput: string, context: Record<string, any> = {}): Promise<SPADEResponse> {
    // S: Build state
    const state = this.buildState(userInput, context);

    // P: Draft plan
    const plan = this.draftPlan(state.intent);
    state.plan = plan;

    // A: Validate assumptions
    const validation = this.validateAssumptions(state);
    if (!validation.valid) {
      return {
        plan: [{ step: "Clarification needed", tool: "ask_question", inputs: {}, success_criteria: "user responds" }],
        actions: [],
        diff: { sources: [] },
        notes: [validation.question || "Need clarification", ...(validation.options || [])]
      };
    }

    // D: Apply policies
    const policyResult = await this.applyPolicies(plan);
    if (!policyResult.approved) {
      if (policyResult.pendingDraft) {
        return {
          plan: [{ step: "Draft ready for confirmation", tool: "confirm_outbound", inputs: {}, success_criteria: "user confirms or declines" }],
          actions: [],
          diff: { sources: [] },
          notes: ["Outbound message draft ready for review"],
          pendingConfirmation: policyResult.pendingDraft
        };
      } else {
        return {
          plan: [{ step: "Awaiting confirmation", tool: "confirm", inputs: {}, success_criteria: "user confirms" }],
          actions: [],
          diff: { sources: [] },
          notes: ["Action requires user confirmation"]
        };
      }
    }

    // E: Execute
    return await this.execute(plan);
  }

  // Helper methods
  private detectIntent(input: string): string {
    const lower = input.toLowerCase();
    
    // Check for SOP creation requests
    if (lower.includes('sop') || (lower.includes('turn') && lower.includes('doc')) || 
        lower.includes('standard operating procedure') || lower.includes('process document')) {
      return 'create_sop';
    }
    
    // Check for transcript patterns
    if (this.isTranscript(input)) {
      return 'process_transcript';
    }
    
    if (lower.includes('lead') || lower.includes('contact') || lower.includes('prospect')) {
      return 'create_lead';
    }
    if (lower.includes('task') || lower.includes('todo') || lower.includes('reminder')) {
      return 'create_task';
    }
    if (lower.includes('meeting') || lower.includes('schedule') || lower.includes('appointment')) {
      return 'schedule_meeting';
    }
    return 'unknown';
  }

  private isTranscript(input: string): boolean {
    const transcriptIndicators = [
      /\d{1,2}:\d{2}.*:/,  // Timestamp patterns like "10:30 John:"
      /\[.*\].*:/,         // Bracket notation like "[John Smith]:"
      /(speaker|participant)\s*\d+:/i,  // Speaker labels
      /\w+\s*:\s*[A-Z].*\n.*\w+\s*:/,   // Multiple speaker turns
      /meeting.*transcript/i,
      /call.*transcript/i,
      /conversation.*transcript/i
    ];
    
    const hasMultipleSpeakers = (input.match(/\w+\s*:/g) || []).length >= 2;
    const hasTranscriptPattern = transcriptIndicators.some(pattern => pattern.test(input));
    const isLongEnough = input.length > 200; // Transcripts are typically longer
    
    return (hasMultipleSpeakers && isLongEnough) || hasTranscriptPattern;
  }

  private extractActionItems(transcript: string): string[] {
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

    // Convert to array and limit to 3-7 items
    const items = Array.from(actionItems).slice(0, 7);
    return items.length >= 3 ? items : this.generateGenericActions(transcript);
  }

  private generateGenericActions(transcript: string): string[] {
    // Fallback: generate generic actions if no specific patterns found
    return [
      "Follow up on discussed items",
      "Review meeting outcomes", 
      "Share relevant documentation",
      "Schedule next check-in"
    ];
  }

  private findLeadEmail(transcript: string): string | null {
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const emails = transcript.match(emailPattern);
    return emails ? emails[0] : null;
  }

  private calculateConfidence(input: string, intent: string): number {
    if (intent === 'unknown') return 0.3;
    if (input.length < 10) return 0.5;
    return 0.8;
  }

  private async requestConfirmation(action: string, inputs: Record<string, any>): Promise<boolean> {
    const message = `Confirm irreversible action: ${action}\nInputs: ${JSON.stringify(inputs, null, 2)}`;
    return window.confirm(message);
  }

  private async executeTool(tool: string, inputs: Record<string, any>): Promise<any> {
    // Mock implementation - replace with actual tool execution
    console.log(`Executing tool: ${tool}`, inputs);
    
    switch (tool) {
      case 'extract_action_items':
        const actionItems = this.extractActionItems(this.state.history[this.state.history.length - 1]);
        return { created: { actionItems }, source: 'Transcript Analysis' };
      
      case 'identify_lead_email':
        const leadEmail = this.findLeadEmail(this.state.history[this.state.history.length - 1]);
        return { created: { leadEmail }, source: 'Email Detection' };
      
      default:
        return {
          created: { id: `${tool}_${Date.now()}`, tool, inputs, timestamp: new Date().toISOString() },
          source: `Tool: ${tool}`
        };
    }
  }
}

// Export singleton instance
export const econestAI = new EcoNestAI();

// Export convenience function
export const processUserInput = (input: string, context?: Record<string, any>) => 
  econestAI.process(input, context);

// Export SPADE policy constants
export const SPADE_POLICIES = {
  CONFIRMATION_THRESHOLD: 0.8,
  CLARIFICATION_THRESHOLD: 0.6,
  OUTBOUND_ACTIONS: [
    'send_email',
    'send_sms', 
    'send_chat',
    'api_post',
    'send_notification'
  ],
  IRREVERSIBLE_ACTIONS: [
    'delete_data',
    'bulk_update',
    'create_payment',
    'publish_content'
  ]
} as const;