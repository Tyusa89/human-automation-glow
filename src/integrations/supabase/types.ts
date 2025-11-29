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
      profiles: {
        Row: {
          company: string | null
          created_at: string
          "econest AI": string | null
          email: string
          full_name: string | null
          id: string
          preferences: Json | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          "econest AI"?: string | null
          email: string
          full_name?: string | null
          id?: string
          preferences?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          "econest AI"?: string | null
          email?: string
          full_name?: string | null
          id?: string
          preferences?: Json | null
          updated_at?: string
          user_id?: string | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
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
    },
  },
} as const
