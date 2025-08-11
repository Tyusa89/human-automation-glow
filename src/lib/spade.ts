// SPADE (State, Plan, Assumptions, Decisions, Execute) guardrails implementation

interface SPADEConfig {
  confirmationThreshold: number; // Confidence threshold for confirmations
  clarificationThreshold: number; // Confidence threshold for asking questions
  enableTracing: boolean;
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

    // Check if confidence is too low for clarification
    if (confidence < this.config.clarificationThreshold) {
      return {
        shouldProceed: false,
        requiresClarification: true,
        clarificationQuestion: this.generateClarificationQuestion(context),
        reason: 'Low confidence requires clarification'
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