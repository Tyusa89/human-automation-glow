export interface IntegrationProvider {
  id: string;
  name: string;
  description: string;
  features: string[];
  authType: 'oauth' | 'apikey';
  scopes?: string[];
  docs?: string;
  category: 'communication' | 'crm' | 'storage' | 'billing' | 'database' | 'webhook';
}

export const integrationProviders: Record<string, IntegrationProvider> = {
  slack: {
    id: 'slack',
    name: 'Slack',
    description: 'Connect your workflows to Slack for real-time notifications and team collaboration.',
    features: ['Send notifications to channels', 'Direct messages', 'Interactive buttons', 'File sharing'],
    authType: 'oauth',
    scopes: ['chat:write', 'channels:read', 'users:read'],
    docs: 'https://api.slack.com/docs',
    category: 'communication'
  },
  gmail: {
    id: 'gmail',
    name: 'Gmail',
    description: 'Automate email workflows and communications through Gmail integration.',
    features: ['Send automated emails', 'Read inbox', 'Manage labels', 'Email templates'],
    authType: 'oauth',
    scopes: ['https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/gmail.readonly'],
    docs: 'https://developers.google.com/gmail/api',
    category: 'communication'
  },
  'google-sheets': {
    id: 'google-sheets',
    name: 'Google Sheets',
    description: 'Sync data bidirectionally with Google Sheets for easy data management.',
    features: ['Read/write data', 'Create new sheets', 'Append rows', 'Real-time sync'],
    authType: 'oauth',
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    docs: 'https://developers.google.com/sheets/api',
    category: 'storage'
  },
  hubspot: {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Integrate with HubSpot CRM to manage contacts, deals, and marketing automation.',
    features: ['Sync contacts', 'Create deals', 'Track interactions', 'Marketing automation'],
    authType: 'oauth',
    scopes: ['crm.objects.contacts.read', 'crm.objects.deals.write'],
    docs: 'https://developers.hubspot.com/docs/api/overview',
    category: 'crm'
  },
  salesforce: {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'Connect to Salesforce for enterprise-grade CRM integration.',
    features: ['Manage leads & opportunities', 'Custom objects', 'Reports & dashboards', 'Workflow automation'],
    authType: 'oauth',
    scopes: ['api', 'refresh_token'],
    docs: 'https://developer.salesforce.com/docs',
    category: 'crm'
  },
  zendesk: {
    id: 'zendesk',
    name: 'Zendesk',
    description: 'Integrate customer support workflows with Zendesk.',
    features: ['Create tickets', 'Update status', 'Add comments', 'Customer insights'],
    authType: 'oauth',
    scopes: ['read', 'write'],
    docs: 'https://developer.zendesk.com/api-reference',
    category: 'communication'
  },
  twilio: {
    id: 'twilio',
    name: 'Twilio',
    description: 'Add SMS, voice, and WhatsApp capabilities to your workflows.',
    features: ['Send SMS', 'Voice calls', 'WhatsApp messaging', 'Phone verification'],
    authType: 'apikey',
    docs: 'https://www.twilio.com/docs',
    category: 'communication'
  },
  notion: {
    id: 'notion',
    name: 'Notion',
    description: 'Sync tasks, documents, and databases with Notion.',
    features: ['Create pages', 'Update databases', 'Task management', 'Documentation sync'],
    authType: 'oauth',
    scopes: ['read', 'update'],
    docs: 'https://developers.notion.com',
    category: 'storage'
  },
  postgres: {
    id: 'postgres',
    name: 'Postgres',
    description: 'Direct database integration for custom data operations.',
    features: ['Query data', 'Insert records', 'Update operations', 'Transaction support'],
    authType: 'apikey',
    docs: 'https://www.postgresql.org/docs',
    category: 'database'
  },
  webhook: {
    id: 'webhook',
    name: 'Webhook',
    description: 'Send HTTP requests to any webhook endpoint for custom integrations.',
    features: ['POST/GET requests', 'Custom headers', 'Authentication', 'Error handling'],
    authType: 'apikey',
    category: 'webhook'
  },
  stripe: {
    id: 'stripe',
    name: 'Stripe',
    description: 'Process payments and manage subscriptions with Stripe.',
    features: ['Payment processing', 'Subscription management', 'Invoice generation', 'Webhook events'],
    authType: 'oauth',
    scopes: ['read_write'],
    docs: 'https://stripe.com/docs/api',
    category: 'billing'
  },
  resend: {
    id: 'resend',
    name: 'Resend',
    description: 'Send transactional emails with Resend.',
    features: ['Send emails', 'Email templates', 'Analytics', 'Webhooks'],
    authType: 'apikey',
    docs: 'https://resend.com/docs',
    category: 'communication'
  }
};

export const getProvidersByCategory = (category: string) => {
  return Object.values(integrationProviders).filter(p => p.category === category);
};
