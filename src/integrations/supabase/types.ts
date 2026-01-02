export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      acm_error_ack: {
        Row: {
          last_seen_error_at: string
          slug: string
          updated_at: string
          user_id: string
        }
        Insert: {
          last_seen_error_at: string
          slug: string
          updated_at?: string
          user_id: string
        }
        Update: {
          last_seen_error_at?: string
          slug?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      acm_events: {
        Row: {
          created_at: string
          direction: string
          event_type: string
          id: string
          lane: string
          meta: Json
          ok: boolean
          slug: string
          sub_lane: string | null
          summary: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          direction: string
          event_type: string
          id?: string
          lane: string
          meta?: Json
          ok?: boolean
          slug: string
          sub_lane?: string | null
          summary?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          direction?: string
          event_type?: string
          id?: string
          lane?: string
          meta?: Json
          ok?: boolean
          slug?: string
          sub_lane?: string | null
          summary?: string | null
          user_id?: string
        }
        Relationships: []
      }
      agent_events: {
        Row: {
          created_at: string
          id: string
          payload: Json
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          payload: Json
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          payload?: Json
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      api_rate_limits: {
        Row: {
          created_at: string
          endpoint: string
          id: string
          request_count: number
          updated_at: string
          user_id: string | null
          window_start: string
        }
        Insert: {
          created_at?: string
          endpoint: string
          id?: string
          request_count?: number
          updated_at?: string
          user_id?: string | null
          window_start?: string
        }
        Update: {
          created_at?: string
          endpoint?: string
          id?: string
          request_count?: number
          updated_at?: string
          user_id?: string | null
          window_start?: string
        }
        Relationships: []
      }
      appointment_services: {
        Row: {
          active: boolean
          created_at: string
          duration_minutes: number
          id: string
          name: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          duration_minutes: number
          id?: string
          name: string
        }
        Update: {
          active?: boolean
          created_at?: string
          duration_minutes?: number
          id?: string
          name?: string
        }
        Relationships: []
      }
      appointments: {
        Row: {
          cancel_token: string
          client_email: string
          client_name: string
          client_phone: string | null
          created_at: string
          end_time: string
          id: string
          notes: string | null
          reschedule_token: string
          service_id: string
          start_time: string
          status: string
        }
        Insert: {
          cancel_token?: string
          client_email: string
          client_name: string
          client_phone?: string | null
          created_at?: string
          end_time: string
          id?: string
          notes?: string | null
          reschedule_token?: string
          service_id: string
          start_time: string
          status?: string
        }
        Update: {
          cancel_token?: string
          client_email?: string
          client_name?: string
          client_phone?: string | null
          created_at?: string
          end_time?: string
          id?: string
          notes?: string | null
          reschedule_token?: string
          service_id?: string
          start_time?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "appointment_services"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action_type: string
          actor_id: string | null
          actor_role: string
          created_at: string | null
          decision: string
          id: number
          metadata: Json | null
          reason: string | null
          resource: string
          zone: number
        }
        Insert: {
          action_type: string
          actor_id?: string | null
          actor_role: string
          created_at?: string | null
          decision: string
          id?: number
          metadata?: Json | null
          reason?: string | null
          resource: string
          zone: number
        }
        Update: {
          action_type?: string
          actor_id?: string | null
          actor_role?: string
          created_at?: string | null
          decision?: string
          id?: number
          metadata?: Json | null
          reason?: string | null
          resource?: string
          zone?: number
        }
        Relationships: []
      }
      automation_runs: {
        Row: {
          created_at: string | null
          id: string
          payload: Json | null
          preset_id: string
          result: Json | null
          status: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          payload?: Json | null
          preset_id: string
          result?: Json | null
          status: string
        }
        Update: {
          created_at?: string | null
          id?: string
          payload?: Json | null
          preset_id?: string
          result?: Json | null
          status?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          client_ip: string | null
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          processed: boolean | null
          submitted_at: string
          updated_at: string | null
        }
        Insert: {
          client_ip?: string | null
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          processed?: boolean | null
          submitted_at?: string
          updated_at?: string | null
        }
        Update: {
          client_ip?: string | null
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          processed?: boolean | null
          submitted_at?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          company: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      customer_notes: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          customer_email: string
          id: string
          is_private: boolean
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          customer_email: string
          id?: string
          is_private?: boolean
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          customer_email?: string
          id?: string
          is_private?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      env_vars: {
        Row: {
          created_at: string | null
          id: string
          key: string
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          value?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          actor: string | null
          created_at: string | null
          id: number
          org_id: string | null
          payload: Json | null
          type: string | null
        }
        Insert: {
          actor?: string | null
          created_at?: string | null
          id?: number
          org_id?: string | null
          payload?: Json | null
          type?: string | null
        }
        Update: {
          actor?: string | null
          created_at?: string | null
          id?: number
          org_id?: string | null
          payload?: Json | null
          type?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount_cents: number
          category: string
          created_at: string
          currency: string
          expense_date: string
          id: string
          note: string | null
          user_id: string
          vendor: string | null
        }
        Insert: {
          amount_cents: number
          category: string
          created_at?: string
          currency?: string
          expense_date: string
          id?: string
          note?: string | null
          user_id: string
          vendor?: string | null
        }
        Update: {
          amount_cents?: number
          category?: string
          created_at?: string
          currency?: string
          expense_date?: string
          id?: string
          note?: string | null
          user_id?: string
          vendor?: string | null
        }
        Relationships: []
      }
      integration_configs: {
        Row: {
          config_key: string
          config_value: Json
          created_at: string
          id: string
          integration_id: string
          updated_at: string
        }
        Insert: {
          config_key: string
          config_value: Json
          created_at?: string
          id?: string
          integration_id: string
          updated_at?: string
        }
        Update: {
          config_key?: string
          config_value?: Json
          created_at?: string
          id?: string
          integration_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "integration_configs_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      integrations: {
        Row: {
          created_at: string
          encrypted_tokens: Json | null
          error_message: string | null
          id: string
          last_sync: string | null
          metadata: Json | null
          provider: string
          scopes: string[] | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          encrypted_tokens?: Json | null
          error_message?: string | null
          id?: string
          last_sync?: string | null
          metadata?: Json | null
          provider: string
          scopes?: string[] | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          encrypted_tokens?: Json | null
          error_message?: string | null
          id?: string
          last_sync?: string | null
          metadata?: Json | null
          provider?: string
          scopes?: string[] | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      knowledge_base: {
        Row: {
          category: string | null
          content: string
          created_at: string
          id: string
          metadata: Json | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          id?: string
          metadata?: Json | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          company: string | null
          created_at: string
          crm_deal_url: string | null
          email: string
          enrichment: Json | null
          id: string
          name: string | null
          notes: string | null
          owner_id: string | null
          source: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          crm_deal_url?: string | null
          email: string
          enrichment?: Json | null
          id?: string
          name?: string | null
          notes?: string | null
          owner_id?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          crm_deal_url?: string | null
          email?: string
          enrichment?: Json | null
          id?: string
          name?: string | null
          notes?: string | null
          owner_id?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      meetings: {
        Row: {
          created_at: string
          description: string | null
          duration_minutes: number | null
          end_time: string | null
          id: string
          lead_email: string
          meeting_link: string | null
          start_time: string
          status: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          end_time?: string | null
          id?: string
          lead_email: string
          meeting_link?: string | null
          start_time: string
          status?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          end_time?: string | null
          id?: string
          lead_email?: string
          meeting_link?: string | null
          start_time?: string
          status?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          category: string | null
          content: string
          created_at: string
          id: string
          lead_email: string | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          id?: string
          lead_email?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          lead_email?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      org_integrations: {
        Row: {
          enabled: boolean | null
          n8n_callback_secret: string | null
          n8n_webhook_url: string | null
          org_id: string
          updated_at: string | null
        }
        Insert: {
          enabled?: boolean | null
          n8n_callback_secret?: string | null
          n8n_webhook_url?: string | null
          org_id: string
          updated_at?: string | null
        }
        Update: {
          enabled?: boolean | null
          n8n_callback_secret?: string | null
          n8n_webhook_url?: string | null
          org_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      owned_products: {
        Row: {
          id: string
          metadata: Json | null
          product_sku: string
          purchased_at: string
          user_id: string
        }
        Insert: {
          id?: string
          metadata?: Json | null
          product_sku: string
          purchased_at?: string
          user_id: string
        }
        Update: {
          id?: string
          metadata?: Json | null
          product_sku?: string
          purchased_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pending_approvals: {
        Row: {
          action_type: string
          actor_id: string | null
          actor_role: string
          created_at: string | null
          id: string
          metadata: Json | null
          owner_id: string
          processed_at: string | null
          reason: string | null
          resolution_reason: string | null
          resolved_at: string | null
          resolved_by: string | null
          resource: string
          risk_level: string | null
          status: string
          updated_at: string | null
          zone: number
        }
        Insert: {
          action_type: string
          actor_id?: string | null
          actor_role: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          owner_id: string
          processed_at?: string | null
          reason?: string | null
          resolution_reason?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          resource: string
          risk_level?: string | null
          status?: string
          updated_at?: string | null
          zone: number
        }
        Update: {
          action_type?: string
          actor_id?: string | null
          actor_role?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          owner_id?: string
          processed_at?: string | null
          reason?: string | null
          resolution_reason?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          resource?: string
          risk_level?: string | null
          status?: string
          updated_at?: string | null
          zone?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          assistant_level: Database["public"]["Enums"]["assistant_level"] | null
          business_type: Database["public"]["Enums"]["business_type"] | null
          client_volume: Database["public"]["Enums"]["client_volume"] | null
          company: string | null
          created_at: string
          current_period_end: string | null
          current_plan: string | null
          econest_ai: string | null
          email: string
          full_name: string | null
          hardest_things: string[] | null
          home_address: string | null
          id: string
          is_owner: boolean
          locale: string | null
          monthly_revenue_range:
            | Database["public"]["Enums"]["monthly_revenue_range"]
            | null
          onboarding_completed: boolean | null
          onboarding_completed_at: string | null
          onboarding_step: string | null
          phone_number: string | null
          plan_tier: string | null
          preferences: Json | null
          primary_challenges: string[] | null
          role: string
          setup_goals: string[] | null
          stripe_customer_id: string | null
          subscription_status: string | null
          success_goal: Database["public"]["Enums"]["success_goal"] | null
          timezone: string | null
          tracking_method: Database["public"]["Enums"]["tracking_method"] | null
          updated_at: string
          user_id: string | null
          work_number: string | null
        }
        Insert: {
          assistant_level?:
            | Database["public"]["Enums"]["assistant_level"]
            | null
          business_type?: Database["public"]["Enums"]["business_type"] | null
          client_volume?: Database["public"]["Enums"]["client_volume"] | null
          company?: string | null
          created_at?: string
          current_period_end?: string | null
          current_plan?: string | null
          econest_ai?: string | null
          email: string
          full_name?: string | null
          hardest_things?: string[] | null
          home_address?: string | null
          id?: string
          is_owner?: boolean
          locale?: string | null
          monthly_revenue_range?:
            | Database["public"]["Enums"]["monthly_revenue_range"]
            | null
          onboarding_completed?: boolean | null
          onboarding_completed_at?: string | null
          onboarding_step?: string | null
          phone_number?: string | null
          plan_tier?: string | null
          preferences?: Json | null
          primary_challenges?: string[] | null
          role?: string
          setup_goals?: string[] | null
          stripe_customer_id?: string | null
          subscription_status?: string | null
          success_goal?: Database["public"]["Enums"]["success_goal"] | null
          timezone?: string | null
          tracking_method?:
            | Database["public"]["Enums"]["tracking_method"]
            | null
          updated_at?: string
          user_id?: string | null
          work_number?: string | null
        }
        Update: {
          assistant_level?:
            | Database["public"]["Enums"]["assistant_level"]
            | null
          business_type?: Database["public"]["Enums"]["business_type"] | null
          client_volume?: Database["public"]["Enums"]["client_volume"] | null
          company?: string | null
          created_at?: string
          current_period_end?: string | null
          current_plan?: string | null
          econest_ai?: string | null
          email?: string
          full_name?: string | null
          hardest_things?: string[] | null
          home_address?: string | null
          id?: string
          is_owner?: boolean
          locale?: string | null
          monthly_revenue_range?:
            | Database["public"]["Enums"]["monthly_revenue_range"]
            | null
          onboarding_completed?: boolean | null
          onboarding_completed_at?: string | null
          onboarding_step?: string | null
          phone_number?: string | null
          plan_tier?: string | null
          preferences?: Json | null
          primary_challenges?: string[] | null
          role?: string
          setup_goals?: string[] | null
          stripe_customer_id?: string | null
          subscription_status?: string | null
          success_goal?: Database["public"]["Enums"]["success_goal"] | null
          timezone?: string | null
          tracking_method?:
            | Database["public"]["Enums"]["tracking_method"]
            | null
          updated_at?: string
          user_id?: string | null
          work_number?: string | null
        }
        Relationships: []
      }
      results: {
        Row: {
          created_at: string
          id: string
          logs: string[] | null
          params: Json | null
          payload: Json | null
          status: string
          task: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          logs?: string[] | null
          params?: Json | null
          payload?: Json | null
          status?: string
          task: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          logs?: string[] | null
          params?: Json | null
          payload?: Json | null
          status?: string
          task?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      sales_leads: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          phone: string | null
          source: string | null
          status: string | null
          team_size: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          source?: string | null
          status?: string | null
          team_size?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          source?: string | null
          status?: string | null
          team_size?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      staff_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      support_customers: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      support_messages: {
        Row: {
          body: string
          created_at: string
          id: string
          sender: string
          thread_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          sender: string
          thread_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          sender?: string
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "support_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      support_threads: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          status: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          status?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_threads_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "support_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assignee: string | null
          created_at: string
          description: string | null
          due_date: string
          id: string
          lead_email: string | null
          priority: string | null
          status: string | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          assignee?: string | null
          created_at?: string
          description?: string | null
          due_date: string
          id?: string
          lead_email?: string | null
          priority?: string | null
          status?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          assignee?: string | null
          created_at?: string
          description?: string | null
          due_date?: string
          id?: string
          lead_email?: string | null
          priority?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      templates: {
        Row: {
          category: string | null
          config: Json | null
          created_at: string | null
          demo_image_url: string | null
          demo_video_url: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          updated_at: string | null
          version: string | null
        }
        Insert: {
          category?: string | null
          config?: Json | null
          created_at?: string | null
          demo_image_url?: string | null
          demo_video_url?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          category?: string | null
          config?: Json | null
          created_at?: string | null
          demo_image_url?: string | null
          demo_video_url?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          updated_at?: string | null
          version?: string | null
        }
        Relationships: []
      }
      terms_acceptance: {
        Row: {
          accepted_at: string
          id: string
          ip_address: string | null
          signature_data: string
          terms_version: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          accepted_at?: string
          id?: string
          ip_address?: string | null
          signature_data: string
          terms_version?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          accepted_at?: string
          id?: string
          ip_address?: string | null
          signature_data?: string
          terms_version?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      traces: {
        Row: {
          confidence: number
          created_at: string
          id: string
          intent: string
          plan: string | null
          solved: boolean
          tools_used: string | null
          updated_at: string
        }
        Insert: {
          confidence: number
          created_at?: string
          id?: string
          intent: string
          plan?: string | null
          solved: boolean
          tools_used?: string | null
          updated_at?: string
        }
        Update: {
          confidence?: number
          created_at?: string
          id?: string
          intent?: string
          plan?: string | null
          solved?: boolean
          tools_used?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_dashboard_suggestions: {
        Row: {
          acted_at: string | null
          created_at: string
          id: string
          payload: Json
          status: string
          suggestion_key: string
          user_id: string
        }
        Insert: {
          acted_at?: string | null
          created_at?: string
          id?: string
          payload?: Json
          status?: string
          suggestion_key: string
          user_id: string
        }
        Update: {
          acted_at?: string | null
          created_at?: string
          id?: string
          payload?: Json
          status?: string
          suggestion_key?: string
          user_id?: string
        }
        Relationships: []
      }
      user_dashboard_widgets: {
        Row: {
          config: Json
          created_at: string
          enabled: boolean
          id: string
          sort_order: number
          updated_at: string
          user_id: string
          widget_key: string
        }
        Insert: {
          config?: Json
          created_at?: string
          enabled?: boolean
          id?: string
          sort_order?: number
          updated_at?: string
          user_id: string
          widget_key: string
        }
        Update: {
          config?: Json
          created_at?: string
          enabled?: boolean
          id?: string
          sort_order?: number
          updated_at?: string
          user_id?: string
          widget_key?: string
        }
        Relationships: []
      }
      user_events: {
        Row: {
          created_at: string
          event_data: Json
          event_source: string | null
          event_type: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_data?: Json
          event_source?: string | null
          event_type: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_data?: Json
          event_source?: string | null
          event_type?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_template_activity: {
        Row: {
          created_at: string
          last_opened_at: string
          open_count: number
          saved: boolean
          saved_at: string | null
          template_slug: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          last_opened_at?: string
          open_count?: number
          saved?: boolean
          saved_at?: string | null
          template_slug: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          last_opened_at?: string
          open_count?: number
          saved?: boolean
          saved_at?: string | null
          template_slug?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_templates: {
        Row: {
          agent_config_override: Json | null
          created_at: string
          id: string
          is_active: boolean
          last_used_at: string | null
          purchased_at: string
          source: string | null
          stripe_checkout_session_id: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          template_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_config_override?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean
          last_used_at?: string | null
          purchased_at?: string
          source?: string | null
          stripe_checkout_session_id?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          template_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          agent_config_override?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean
          last_used_at?: string | null
          purchased_at?: string
          source?: string | null
          stripe_checkout_session_id?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          template_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_templates_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_runs: {
        Row: {
          created_at: string | null
          finished_at: string | null
          id: string
          owner_id: string
          result_summary: Json | null
          started_at: string | null
          status: string
          updated_at: string | null
          workflow_id: string
        }
        Insert: {
          created_at?: string | null
          finished_at?: string | null
          id?: string
          owner_id: string
          result_summary?: Json | null
          started_at?: string | null
          status?: string
          updated_at?: string | null
          workflow_id: string
        }
        Update: {
          created_at?: string | null
          finished_at?: string | null
          id?: string
          owner_id?: string
          result_summary?: Json | null
          started_at?: string | null
          status?: string
          updated_at?: string | null
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_runs_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflows: {
        Row: {
          config: Json
          created_at: string | null
          id: string
          name: string
          owner_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          config: Json
          created_at?: string | null
          id?: string
          name: string
          owner_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          config?: Json
          created_at?: string | null
          id?: string
          name?: string
          owner_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      contacts_admin_view: {
        Row: {
          company: string | null
          created_at: string | null
          email: string | null
          id: string | null
          name: string | null
          notes: string | null
          phone: string | null
          tags: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email?: never
          id?: string | null
          name?: string | null
          notes?: string | null
          phone?: never
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: never
          id?: string | null
          name?: string | null
          notes?: string | null
          phone?: never
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles_admin_view: {
        Row: {
          assistant_level: Database["public"]["Enums"]["assistant_level"] | null
          business_type: Database["public"]["Enums"]["business_type"] | null
          client_volume: Database["public"]["Enums"]["client_volume"] | null
          company: string | null
          created_at: string | null
          current_period_end: string | null
          current_plan: string | null
          email: string | null
          full_name: string | null
          hardest_things: string[] | null
          home_address: string | null
          id: string | null
          locale: string | null
          monthly_revenue_range:
            | Database["public"]["Enums"]["monthly_revenue_range"]
            | null
          onboarding_completed: boolean | null
          onboarding_completed_at: string | null
          onboarding_step: string | null
          phone_number: string | null
          plan_tier: string | null
          preferences: Json | null
          primary_challenges: string[] | null
          setup_goals: string[] | null
          stripe_customer_id: string | null
          subscription_status: string | null
          success_goal: Database["public"]["Enums"]["success_goal"] | null
          timezone: string | null
          tracking_method: Database["public"]["Enums"]["tracking_method"] | null
          updated_at: string | null
          user_id: string | null
          work_number: string | null
        }
        Insert: {
          assistant_level?:
            | Database["public"]["Enums"]["assistant_level"]
            | null
          business_type?: Database["public"]["Enums"]["business_type"] | null
          client_volume?: Database["public"]["Enums"]["client_volume"] | null
          company?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_plan?: string | null
          email?: string | null
          full_name?: string | null
          hardest_things?: string[] | null
          home_address?: never
          id?: string | null
          locale?: string | null
          monthly_revenue_range?:
            | Database["public"]["Enums"]["monthly_revenue_range"]
            | null
          onboarding_completed?: boolean | null
          onboarding_completed_at?: string | null
          onboarding_step?: string | null
          phone_number?: never
          plan_tier?: string | null
          preferences?: Json | null
          primary_challenges?: string[] | null
          setup_goals?: string[] | null
          stripe_customer_id?: never
          subscription_status?: string | null
          success_goal?: Database["public"]["Enums"]["success_goal"] | null
          timezone?: string | null
          tracking_method?:
            | Database["public"]["Enums"]["tracking_method"]
            | null
          updated_at?: string | null
          user_id?: string | null
          work_number?: never
        }
        Update: {
          assistant_level?:
            | Database["public"]["Enums"]["assistant_level"]
            | null
          business_type?: Database["public"]["Enums"]["business_type"] | null
          client_volume?: Database["public"]["Enums"]["client_volume"] | null
          company?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_plan?: string | null
          email?: string | null
          full_name?: string | null
          hardest_things?: string[] | null
          home_address?: never
          id?: string | null
          locale?: string | null
          monthly_revenue_range?:
            | Database["public"]["Enums"]["monthly_revenue_range"]
            | null
          onboarding_completed?: boolean | null
          onboarding_completed_at?: string | null
          onboarding_step?: string | null
          phone_number?: never
          plan_tier?: string | null
          preferences?: Json | null
          primary_challenges?: string[] | null
          setup_goals?: string[] | null
          stripe_customer_id?: never
          subscription_status?: string | null
          success_goal?: Database["public"]["Enums"]["success_goal"] | null
          timezone?: string | null
          tracking_method?:
            | Database["public"]["Enums"]["tracking_method"]
            | null
          updated_at?: string | null
          user_id?: string | null
          work_number?: never
        }
        Relationships: []
      }
    }
    Functions: {
      activate_template: {
        Args: { p_template_slug: string; p_user_id: string }
        Returns: undefined
      }
      deactivate_template: {
        Args: { p_template_slug: string; p_user_id: string }
        Returns: undefined
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_or_owner: { Args: never; Returns: boolean }
      is_owner: { Args: never; Returns: boolean }
      profile_auth_id: { Args: never; Returns: string }
    }
    Enums: {
      app_role: "admin" | "owner" | "user"
      assistant_level: "quiet" | "balanced" | "active"
      business_type:
        | "consultant"
        | "coach"
        | "freelancer"
        | "creative_designer"
        | "local_service_provider"
        | "other"
      client_volume: "1_3" | "4_10" | "11_25" | "25_plus"
      monthly_revenue_range:
        | "starting_inconsistent"
        | "under_5000"
        | "5000_10000"
        | "10000_plus"
      success_goal:
        | "consistent_income"
        | "less_stress"
        | "fewer_dropped_balls"
        | "more_time"
        | "preparing_to_grow"
      tracking_method:
        | "spreadsheets"
        | "accounting_software"
        | "notes_memory"
        | "nothing_consistently"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "owner", "user"],
      assistant_level: ["quiet", "balanced", "active"],
      business_type: [
        "consultant",
        "coach",
        "freelancer",
        "creative_designer",
        "local_service_provider",
        "other",
      ],
      client_volume: ["1_3", "4_10", "11_25", "25_plus"],
      monthly_revenue_range: [
        "starting_inconsistent",
        "under_5000",
        "5000_10000",
        "10000_plus",
      ],
      success_goal: [
        "consistent_income",
        "less_stress",
        "fewer_dropped_balls",
        "more_time",
        "preparing_to_grow",
      ],
      tracking_method: [
        "spreadsheets",
        "accounting_software",
        "notes_memory",
        "nothing_consistently",
      ],
    },
  },
} as const
