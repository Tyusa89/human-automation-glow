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
  async applyPolicies(plan: PlanStep[]): Promise<boolean> {
    const irreversibleActions = ['send_email', 'delete_data', 'create_payment', 'schedule_meeting', 'publish_content'];
    
    for (const step of plan) {
      if (irreversibleActions.includes(step.tool)) {
        const confirmed = await this.requestConfirmation(step.tool, step.inputs);
        if (!confirmed) {
          return false;
        }
      }
    }
    
    return true;
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
    const approved = await this.applyPolicies(plan);
    if (!approved) {
      return {
        plan: [{ step: "Awaiting confirmation", tool: "confirm", inputs: {}, success_criteria: "user confirms" }],
        actions: [],
        diff: { sources: [] },
        notes: ["Action requires user confirmation"]
      };
    }

    // E: Execute
    return await this.execute(plan);
  }

  // Helper methods
  private detectIntent(input: string): string {
    const lower = input.toLowerCase();
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
    
    return {
      created: { id: `${tool}_${Date.now()}`, tool, inputs, timestamp: new Date().toISOString() },
      source: `Tool: ${tool}`
    };
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
  IRREVERSIBLE_ACTIONS: [
    'send_email',
    'delete_data',
    'create_payment',
    'schedule_meeting',
    'publish_content'
  ]
} as const;