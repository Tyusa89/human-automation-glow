# EcoNest AgentKit Setup Guide

## Overview
This guide shows how to configure your Supabase edge functions as HTTPS tools in OpenAI Agent Builder.

## Your API Endpoints

```
Leads API: https://rqldulvkwzvrmcvwttep.supabase.co/functions/v1/agentkit-leads
Templates API: https://rqldulvkwzvrmcvwttep.supabase.co/functions/v1/agentkit-templates
Events API: https://rqldulvkwzvrmcvwttep.supabase.co/functions/v1/agentkit-events
```

---

## 1️⃣ Tool Configuration: econest-leads-api

### In Agent Builder → Tools → Add HTTPS Tool

**Tool Name:** `econest-leads-api`

**Method:** `POST`

**URL:** `https://rqldulvkwzvrmcvwttep.supabase.co/functions/v1/agentkit-leads`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body Schema:**
```json
{
  "type": "object",
  "properties": {
    "op": {
      "type": "string",
      "enum": ["get_summary", "create_lead"],
      "description": "Operation to perform: get_summary returns lead counts, create_lead adds a new lead"
    },
    "owner_id": {
      "type": "string",
      "format": "uuid",
      "description": "The user's UUID from authentication"
    },
    "payload": {
      "type": "object",
      "properties": {
        "email": {
          "type": "string",
          "description": "Lead's email address (required for create_lead)"
        },
        "name": {
          "type": "string",
          "description": "Lead's full name"
        },
        "source": {
          "type": "string",
          "description": "Lead source (e.g., 'agent', 'website', 'referral')"
        },
        "notes": {
          "type": "string",
          "description": "Additional notes about the lead"
        }
      }
    }
  },
  "required": ["op", "owner_id"]
}
```

**Response Schema:**
```json
{
  "type": "object",
  "oneOf": [
    {
      "properties": {
        "total": { "type": "number" },
        "new": { "type": "number" },
        "warm": { "type": "number" },
        "customers": { "type": "number" }
      }
    },
    {
      "properties": {
        "success": { "type": "boolean" },
        "lead": {
          "type": "object",
          "properties": {
            "id": { "type": "string" },
            "email": { "type": "string" },
            "status": { "type": "string" },
            "name": { "type": "string" }
          }
        }
      }
    }
  ]
}
```

**Test Payloads:**

Get summary:
```json
{
  "op": "get_summary",
  "owner_id": "your-user-uuid-here"
}
```

Create lead:
```json
{
  "op": "create_lead",
  "owner_id": "your-user-uuid-here",
  "payload": {
    "email": "test@example.com",
    "name": "Test Lead",
    "source": "agent",
    "notes": "Created via AgentKit"
  }
}
```

---

## 2️⃣ Tool Configuration: econest-templates-api

### In Agent Builder → Tools → Add HTTPS Tool

**Tool Name:** `econest-templates-api`

**Method:** `POST`

**URL:** `https://rqldulvkwzvrmcvwttep.supabase.co/functions/v1/agentkit-templates`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body Schema:**
```json
{
  "type": "object",
  "properties": {
    "op": {
      "type": "string",
      "enum": ["list_templates", "list_owned", "install_template"],
      "description": "Operation: list_templates shows marketplace, list_owned shows user's templates, install_template activates one"
    },
    "owner_id": {
      "type": "string",
      "format": "uuid",
      "description": "The user's UUID from authentication"
    },
    "payload": {
      "type": "object",
      "properties": {
        "template_id": {
          "type": "string",
          "format": "uuid",
          "description": "Template UUID (required for install_template)"
        },
        "source": {
          "type": "string",
          "description": "Installation source (e.g., 'agent_install', 'checkout')"
        },
        "override_config": {
          "type": "object",
          "description": "Custom configuration overrides"
        }
      }
    }
  },
  "required": ["op", "owner_id"]
}
```

**Response Schema:**
```json
{
  "type": "object",
  "oneOf": [
    {
      "properties": {
        "templates": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": { "type": "string" },
              "slug": { "type": "string" },
              "name": { "type": "string" },
              "description": { "type": "string" },
              "category": { "type": "string" }
            }
          }
        }
      }
    },
    {
      "properties": {
        "user_templates": { "type": "array" }
      }
    },
    {
      "properties": {
        "success": { "type": "boolean" },
        "id": { "type": "string" }
      }
    }
  ]
}
```

**Test Payloads:**

List marketplace:
```json
{
  "op": "list_templates",
  "owner_id": "your-user-uuid-here"
}
```

List owned:
```json
{
  "op": "list_owned",
  "owner_id": "your-user-uuid-here"
}
```

Install template:
```json
{
  "op": "install_template",
  "owner_id": "your-user-uuid-here",
  "payload": {
    "template_id": "template-uuid-here",
    "source": "agent_install"
  }
}
```

---

## 3️⃣ Tool Configuration: econest-events-api

### In Agent Builder → Tools → Add HTTPS Tool

**Tool Name:** `econest-events-api`

**Method:** `POST`

**URL:** `https://rqldulvkwzvrmcvwttep.supabase.co/functions/v1/agentkit-events`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body Schema:**
```json
{
  "type": "object",
  "properties": {
    "owner_id": {
      "type": "string",
      "format": "uuid",
      "description": "The user's UUID from authentication"
    },
    "type": {
      "type": "string",
      "description": "Event type (e.g., 'agent_query', 'lead_created', 'template_installed')"
    },
    "payload": {
      "type": "object",
      "description": "Event data (free-form JSON)"
    }
  },
  "required": ["owner_id", "type"]
}
```

**Response Schema:**
```json
{
  "type": "object",
  "properties": {
    "success": { "type": "boolean" }
  }
}
```

**Test Payload:**
```json
{
  "owner_id": "your-user-uuid-here",
  "type": "agent_query",
  "payload": {
    "query": "How many leads do I have?",
    "timestamp": "2025-01-01T12:00:00Z"
  }
}
```

---

## 4️⃣ Agent Workflow Setup

### Create a new workflow in Agent Builder:

**Workflow Name:** `EcoNest Lead & Templates Agent`

**System Prompt:**
```
You are the EcoNest automation assistant.
You help the owner and their team manage leads, templates, and agent telemetry.

IMPORTANT: You ONLY manage data via the tools provided. Never make up numbers or data.
When unsure, ask clarifying questions before acting.

Available tools:
- econest-leads-api: Get lead statistics or create new leads
- econest-templates-api: Browse templates, see owned templates, or install new ones
- econest-events-api: Log your activities for telemetry

Always log important actions to econest-events-api for tracking.
```

### Node Structure:

```
Start (user message)
    ↓
Intent Classifier Agent
    ├─→ "lead" → Lead Agent (uses econest-leads-api)
    ├─→ "template" → Templates Agent (uses econest-templates-api)
    ├─→ "activity" → Activity Agent (uses econest-events-api)
    └─→ "other" → General Assistant
```

### Lead Agent Prompt:
```
You help manage leads using the econest-leads-api tool.

When asked about lead statistics, call:
- op: "get_summary" to get total, new, warm, and customer counts

When asked to create a lead, call:
- op: "create_lead" with email, name, source, and notes in payload

Always use the owner_id from the session context.
Log significant actions to econest-events-api.
```

### Templates Agent Prompt:
```
You help browse and install templates using the econest-templates-api tool.

When asked about available templates, call:
- op: "list_templates" to see the marketplace

When asked what templates they own, call:
- op: "list_owned" to see activated templates

When asked to install a template, call:
- op: "install_template" with the template_id in payload

Always use the owner_id from the session context.
Log installations to econest-events-api.
```

### Activity Agent Prompt:
```
You log and report on agent activity using the econest-events-api tool.

Log every significant action with:
- owner_id from session
- type: descriptive event name
- payload: relevant data

This creates an audit trail for the owner.
```

---

## 5️⃣ Getting owner_id in Agent Builder

You'll need to pass the authenticated user's UUID to the agent. Options:

1. **Session Variables:** Configure ChatKit to include `owner_id` from your auth system
2. **First Message:** Have the user provide their ID in the first interaction
3. **Token Endpoint:** Use a server endpoint that validates auth and returns owner_id

---

## Testing

Test each tool individually in Agent Builder's tool tester before wiring to agents.

Use the Supabase function logs to debug:
- [Leads logs](https://supabase.com/dashboard/project/rqldulvkwzvrmcvwttep/functions/agentkit-leads/logs)
- [Templates logs](https://supabase.com/dashboard/project/rqldulvkwzvrmcvwttep/functions/agentkit-templates/logs)
- [Events logs](https://supabase.com/dashboard/project/rqldulvkwzvrmcvwttep/functions/agentkit-events/logs)
