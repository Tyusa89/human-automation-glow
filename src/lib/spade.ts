// SPADE (State, Plan, Assumptions, Decisions, Execute) guardrails implementation

interface SPADEConfig {
  confirmationThreshold: number; // Confidence threshold for confirmations
  clarificationThreshold: number; // Confidence threshold for asking questions
  enableTracing: boolean;
}

interface PlanStep {
  step: string;
  tool: string;
  success: string;
}

interface IntentResult {
  intentDetected: boolean;
  plan?: PlanStep[];
  confidence: number;
}

interface ActionContext {
  action: string;
  confidence: number;
  reversible: boolean;
  data?: any;
  userIntent?: string;
}

interface SPADEResult {
  shouldProceed: boolean;
  requiresConfirmation?: boolean;
  requiresClarification?: boolean;
  clarificationQuestion?: string;
  lowConfidenceOptions?: string[];
  reason?: string;
}

export class SPADEGuardrails {
  private config: SPADEConfig;

  constructor(config: Partial<SPADEConfig> = {}) {
    this.config = {
      confirmationThreshold: 0.8,
      clarificationThreshold: 0.6,
      enableTracing: true,
      ...config
    };
  }

  /**
   * Evaluate an action against SPADE policies
   */
  async evaluateAction(context: ActionContext): Promise<SPADEResult> {
    const { action, confidence, reversible, data } = context;

    // Log trace if enabled
    if (this.config.enableTracing) {
      console.log(`SPADE: Evaluating action "${action}" with confidence ${confidence}`);
    }

    // Check if confidence is too low - offer options instead of just clarification
    if (confidence < this.config.clarificationThreshold) {
      return {
        shouldProceed: false,
        requiresClarification: true,
        lowConfidenceOptions: ['Summarize options', 'Pull docs', 'Escalate to human'],
        clarificationQuestion: this.generateTargetedQuestion(context),
        reason: 'Low confidence requires clarification or user choice'
      };
    }

    // Check if irreversible action requires confirmation
    if (!reversible && confidence < this.config.confirmationThreshold) {
      return {
        shouldProceed: false,
        requiresConfirmation: true,
        reason: 'Irreversible action requires user confirmation'
      };
    }

    // Action can proceed
    return {
      shouldProceed: true,
      reason: 'Action meets SPADE requirements'
    };
  }

  /**
   * Generate a targeted question for low confidence scenarios
   */
  private generateTargetedQuestion(context: ActionContext): string {
    const { action, userIntent } = context;
    
    if (userIntent) {
      return `I need clarification: What specifically would you like me to do regarding "${userIntent}"?`;
    }
    
    return `I'm not confident about "${action}". What's your preferred next step?`;
  }

  /**
   * Generate a clarification question based on action context
   */
  private generateClarificationQuestion(context: ActionContext): string {
    const { action, userIntent, data } = context;

    // Predefined clarification questions for common actions
    const clarificationTemplates: Record<string, string> = {
      'send_email': 'Are you sure you want to send this email? Please confirm the recipient and content.',
      'delete_data': 'This action cannot be undone. Are you sure you want to delete this data?',
      'create_lead': 'Should I create a new lead with this information?',
      'schedule_meeting': 'Would you like me to schedule this meeting for the proposed time?',
      'update_profile': 'Should I update your profile with these changes?'
    };

    // Check for specific action templates
    const template = clarificationTemplates[action.toLowerCase()];
    if (template) {
      return template;
    }

    // Generate generic clarification question
    if (userIntent) {
      return `I want to make sure I understand correctly. You want me to ${userIntent}. Is this correct?`;
    }

    return `I'm not completely confident about this action. Could you please clarify what you'd like me to do with "${action}"?`;
  }

  /**
   * Ask for user confirmation for irreversible actions
   */
  async requestConfirmation(action: string, details?: string): Promise<boolean> {
    return new Promise((resolve) => {
      const message = details 
        ? `Are you sure you want to ${action}?\n\nDetails: ${details}\n\nThis action cannot be undone.`
        : `Are you sure you want to ${action}? This action cannot be undone.`;

      const confirmed = window.confirm(message);
      resolve(confirmed);
    });
  }

  /**
   * Display clarification dialog
   */
  async requestClarification(question: string): Promise<string | null> {
    return new Promise((resolve) => {
      const response = window.prompt(question);
      resolve(response);
    });
  }

  /**
   * Detect intent and generate execution plan
   */
  detectIntent(userInput: string, context?: any): IntentResult {
    const input = userInput.toLowerCase();
    let confidence = 0.3;
    let intentDetected = false;
    let plan: PlanStep[] = [];

    // Lead creation intent
    if (input.includes('lead') || input.includes('contact') || input.includes('prospect')) {
      intentDetected = true;
      confidence = 0.8;
      plan = [
        { step: "Check existing lead", tool: "get_lead_status", success: "lead found or null" },
        { step: "Fill gaps from KB", tool: "fetch_KB_answer", success: "facts present" },
        { step: "Propose next actions", tool: "none", success: "user-approved or policy-safe" },
        { step: "Execute", tool: "create_lead", success: "diff created" }
      ];
    }
    
    // Task creation intent
    else if (input.includes('task') || input.includes('todo') || input.includes('reminder')) {
      intentDetected = true;
      confidence = 0.8;
      plan = [
        { step: "Check existing lead", tool: "get_lead_status", success: "lead found or null" },
        { step: "Fill gaps from KB", tool: "fetch_KB_answer", success: "facts present" },
        { step: "Propose next actions", tool: "none", success: "user-approved or policy-safe" },
        { step: "Execute", tool: "create_task", success: "diff created" }
      ];
    }
    
    // Meeting scheduling intent
    else if (input.includes('meeting') || input.includes('schedule') || input.includes('appointment')) {
      intentDetected = true;
      confidence = 0.8;
      plan = [
        { step: "Check existing lead", tool: "get_lead_status", success: "lead found or null" },
        { step: "Fill gaps from KB", tool: "fetch_KB_answer", success: "facts present" },
        { step: "Propose next actions", tool: "none", success: "user-approved or policy-safe" },
        { step: "Execute", tool: "schedule_meeting", success: "diff created" }
      ];
    }

    return { intentDetected, plan: intentDetected ? plan : undefined, confidence };
  }

  /**
   * Apply SPADE policies to an action before execution
   */
  async applyPolicies(context: ActionContext): Promise<boolean> {
    const evaluation = await this.evaluateAction(context);

    if (!evaluation.shouldProceed) {
      if (evaluation.requiresConfirmation) {
        const confirmed = await this.requestConfirmation(
          context.action, 
          JSON.stringify(context.data, null, 2)
        );
        return confirmed;
      }

      if (evaluation.requiresClarification && evaluation.clarificationQuestion) {
        const clarification = await this.requestClarification(evaluation.clarificationQuestion);
        if (clarification) {
          // Re-evaluate with updated context
          const updatedContext = {
            ...context,
            confidence: Math.min(context.confidence + 0.2, 1.0), // Boost confidence slightly
            userIntent: clarification
          };
          return this.applyPolicies(updatedContext);
        }
        return false;
      }
    }

    return evaluation.shouldProceed;
  }
}

// Export default instance with standard configuration
export const spadeGuardrails = new SPADEGuardrails();

// Export policy constants for easy access
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