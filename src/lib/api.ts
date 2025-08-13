// API client for EcoNest AI automation backend
// This implementation uses Supabase Edge Functions instead of Google Sheets webhook

interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

interface LeadData {
  name?: string;
  email: string;
  source?: string;
  company?: string;
  notes?: string;
}

interface TaskData {
  title: string;
  due_iso: string;
  assignee?: string;
  lead_email?: string;
  priority?: 'low' | 'normal' | 'high';
}

interface NoteData {
  content: string;
  lead_email?: string;
  category?: string;
  tags?: string[];
}

interface MeetingData {
  lead_email: string;
  start_iso: string;
  duration_min?: number;
}

interface TraceData {
  intent: string;
  plan?: string;
  tools_used?: string;
  confidence: number;
  solved: boolean;
}

// Base API client configuration
const API_BASE_URL = '/api'; // Will use Supabase Edge Functions

class APIClient {
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<APIResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'An error occurred'
        };
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  // Lead management
  async createLead(leadData: LeadData): Promise<APIResponse> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data, error } = await supabase
        .from('leads')
        .insert([{
          name: leadData.name,
          email: leadData.email,
          source: leadData.source,
          company: leadData.company,
          notes: leadData.notes,
          status: 'new'
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating lead:', error);
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error in createLead:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create lead'
      };
    }
  }

  async getLeads(limit: number = 25): Promise<APIResponse> {
    // Mock implementation - this will be replaced with Supabase query
    console.log('Fetching leads, limit:', limit);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      data: {
        leads: [], // Will be populated with real data
        total: 0
      }
    };
  }

  // Task management
  async createTask(taskData: TaskData): Promise<APIResponse> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          title: taskData.title,
          due_date: taskData.due_iso,
          assignee: taskData.assignee,
          lead_email: taskData.lead_email,
          priority: taskData.priority || 'normal',
          status: 'pending'
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating task:', error);
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error in createTask:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create task'
      };
    }
  }

  async getTasks(): Promise<APIResponse> {
    console.log('Fetching tasks');
    
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return {
      success: true,
      data: {
        tasks: []
      }
    };
  }

  // Knowledge Base
  async fetchKB(query: string, topK: number = 3): Promise<APIResponse> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Use PostgreSQL full-text search for better matching
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .textSearch('title,content', query, {
          type: 'websearch',
          config: 'english'
        })
        .limit(topK);

      if (error) {
        console.error('Error searching knowledge base:', error);
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        data: {
          results: data || [],
          query,
          totalResults: data?.length || 0
        }
      };
    } catch (error) {
      console.error('Error in fetchKB:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search knowledge base'
      };
    }
  }

  // Notes and traces
  async logNote(noteData: NoteData): Promise<APIResponse> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data, error } = await supabase
        .from('notes')
        .insert([{
          content: noteData.content,
          lead_email: noteData.lead_email,
          category: noteData.category,
          tags: noteData.tags
        }])
        .select()
        .single();

      if (error) {
        console.error('Error logging note:', error);
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error in logNote:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to log note'
      };
    }
  }

  async logTrace(traceData: TraceData): Promise<APIResponse> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data, error } = await supabase
        .from('traces')
        .insert([{
          intent: traceData.intent,
          plan: traceData.plan,
          tools_used: traceData.tools_used,
          confidence: traceData.confidence,
          solved: traceData.solved
        }])
        .select()
        .single();

      if (error) {
        console.error('Error logging trace:', error);
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error in logTrace:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to log trace'
      };
    }
  }

  // Meeting scheduling
  async scheduleMeeting(meetingData: MeetingData): Promise<APIResponse> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Generate a placeholder meeting link
      const meetingId = `meeting_${Date.now()}`;
      const placeholderLink = `https://meet.econest.ai/join/${meetingId}`;
      
      const { data, error } = await supabase
        .from('meetings')
        .insert([{
          lead_email: meetingData.lead_email,
          start_time: meetingData.start_iso,
          duration_minutes: meetingData.duration_min || 30,
          meeting_link: placeholderLink,
          status: 'scheduled'
        }])
        .select()
        .single();

      if (error) {
        console.error('Error scheduling meeting:', error);
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        data: {
          ...data,
          placeholder_link: placeholderLink
        }
      };
    } catch (error) {
      console.error('Error in scheduleMeeting:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to schedule meeting'
      };
    }
  }

  // User management
  async getUserProfile(email: string): Promise<APIResponse> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        data: {
          email,
          profile: data || null
        }
      };
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user profile'
      };
    }
  }
}

export async function runTask(task: "daily_kpi" | "generate_sop", params: any = {}) {
  const { supabase } = await import('@/integrations/supabase/client');
  
  try {
    const { data, error } = await supabase.functions.invoke('run-task', {
      body: { task, params }
    });

    if (error) {
      // Log error to results table
      await supabase.from('results').insert({
        task, params, payload: null, logs: [error.message], status: 'error'
      });
      throw error;
    }

    // Log successful result
    await supabase.from('results').insert({
      task,
      params,
      payload: data?.payload ?? null,
      logs: data?.logs ?? [],
      status: data?.status ?? 'ok'
    });

    return data; // { status, payload, logs }
  } catch (err) {
    // Ensure any unexpected errors are also logged
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    await supabase.from('results').insert({
      task, params, payload: null, logs: [errorMessage], status: 'error'
    });
    throw err;
  }
}

// Export singleton instance
export const apiClient = new APIClient();

// Export individual functions for convenience
export const createLead = (data: LeadData) => apiClient.createLead(data);
export const createTask = (data: TaskData) => apiClient.createTask(data);
export const scheduleMeeting = (data: MeetingData) => apiClient.scheduleMeeting(data);
export const logNote = (data: NoteData) => apiClient.logNote(data);
export const logTrace = (data: TraceData) => apiClient.logTrace(data);
export const fetchKB = (query: string, topK?: number) => apiClient.fetchKB(query, topK);
export const getUserProfile = (email: string) => apiClient.getUserProfile(email);

export default apiClient;