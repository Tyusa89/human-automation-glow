import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Template registry (keep in sync with client fallback)
const templates = [
  {
    templateId: "lead-qualification-bot",
    name: "Lead Qualification Bot",
    tagline: "Filter, score, and route leads with an AI agent.",
    category: "Bots",
    difficulty: "Beginner",
    badges: ["New"],
    hero: "/lovable-uploads/22c32c18-97ea-4d61-b7cc-513f8c8daa5e.png",
    gallery: [
      "/lovable-uploads/22c32c18-97ea-4d61-b7cc-513f8c8daa5e.png",
      "/lovable-uploads/5fd0e2db-d0a1-4acb-b206-80402fcc72fd.png",
    ],
    description: "An inbound lead triage flow with forms, validations, scoring, and CRM-ready outputs.",
    features: [
      "Multi-step intake form",
      "AI scoring & notes",
      "CRM export hook",
      "Supabase + RLS defaults",
    ],
    actions: { behavior: "wizard", path: "/setup" },
  },
  {
    templateId: "inventory-manager",
    name: "Inventory Manager",
    tagline: "Track stock levels with alerts and simple analytics.",
    category: "Dashboards",
    difficulty: "Intermediate",
    badges: ["Popular"],
    hero: "/lovable-uploads/8cea8862-2c9a-4eeb-b53a-eba08632ca5f.png",
    gallery: [
      "/lovable-uploads/8cea8862-2c9a-4eeb-b53a-eba08632ca5f.png",
      "/lovable-uploads/5fd0e2db-d0a1-4acb-b206-80402fcc72fd.png",
    ],
    description: "SKU CRUD, low-stock alerts, and sales trends.",
    features: ["CRUD pages", "Low-stock alerts", "CSV import/export"],
    actions: { behavior: "scaffold", api: "/api/scaffold" },
  },
  {
    templateId: "support-triage",
    name: "Support Triage",
    tagline: "Resolves FAQs with AI, routes edge cases to human agents.",
    category: "Bots",
    difficulty: "Intermediate",
    badges: ["Popular"],
    hero: "/lovable-uploads/22c32c18-97ea-4d61-b7cc-513f8c8daa5e.png",
    gallery: ["/lovable-uploads/22c32c18-97ea-4d61-b7cc-513f8c8daa5e.png"],
    description: "AI-powered support bot that handles common questions and escalates complex issues.",
    features: ["AI FAQ resolution", "Human handoff", "Helpdesk integration"],
    actions: { behavior: "wizard", path: "/setup" },
  },
  {
    templateId: "data-enrichment",
    name: "Data Enrichment",
    tagline: "Research agent enriches prospects from domain to CRM.",
    category: "Ops",
    difficulty: "Advanced",
    badges: ["New"],
    hero: "/lovable-uploads/8cea8862-2c9a-4eeb-b53a-eba08632ca5f.png",
    gallery: ["/lovable-uploads/8cea8862-2c9a-4eeb-b53a-eba08632ca5f.png"],
    description: "Automatically enrich lead data with company information and contact details.",
    features: ["Domain lookup", "CRM integration", "Automated research"],
    actions: { behavior: "scaffold", api: "/api/scaffold" },
  },
  {
    templateId: "onboarding-flow",
    name: "Onboarding Flow",
    tagline: "Guided signup with form + agent combo.",
    category: "Auth",
    difficulty: "Intermediate",
    badges: ["Popular"],
    hero: "/lovable-uploads/5fd0e2db-d0a1-4acb-b206-80402fcc72fd.png",
    gallery: ["/lovable-uploads/5fd0e2db-d0a1-4acb-b206-80402fcc72fd.png"],
    description: "Streamlined user onboarding with guided signup and welcome automation.",
    features: ["Multi-step forms", "Welcome emails", "Workspace setup"],
    actions: { behavior: "wizard", path: "/setup" },
  },
];

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method === 'GET') {
      return new Response(
        JSON.stringify({ ok: true, data: templates }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    return new Response(
      JSON.stringify({ ok: false, error: 'Method not allowed' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
