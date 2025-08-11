// API client for EcoNest AI automation backend
// This implementation uses Supabase Edge Functions instead of Google Sheets webhook

interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

interface LeadData {
  name: string;
  email: string;
  company?: string;
  message: string;
}

interface TaskData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

interface NoteData {
  content: string;
  category?: string;
  tags?: string[];
}

interface TraceData {
  action: string;
  component: string;
  status: 'success' | 'error' | 'warning' | 'pending';
  message: string;
  metadata?: Record<string, any>;
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
    // For now, simulate the API call - this will be replaced with Supabase Edge Function
    console.log('Creating lead:', leadData);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful response
    return {
      success: true,
      data: {
        id: `lead_${Date.now()}`,
        ...leadData,
        createdAt: new Date().toISOString()
      }
    };
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
    console.log('Creating task:', taskData);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
      data: {
        id: `task_${Date.now()}`,
        ...taskData,
        status: 'pending',
        createdAt: new Date().toISOString()
      }
    };
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
    console.log('Searching KB:', { query, topK });
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      success: true,
      data: {
        results: [],
        query,
        totalResults: 0
      }
    };
  }

  // Notes and traces
  async logNote(noteData: NoteData): Promise<APIResponse> {
    console.log('Logging note:', noteData);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      success: true,
      data: {
        id: `note_${Date.now()}`,
        ...noteData,
        createdAt: new Date().toISOString()
      }
    };
  }

  async logTrace(traceData: TraceData): Promise<APIResponse> {
    console.log('Logging trace:', traceData);
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      success: true,
      data: {
        id: `trace_${Date.now()}`,
        ...traceData,
        timestamp: new Date().toISOString()
      }
    };
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

// Export singleton instance
export const apiClient = new APIClient();

// Export individual functions for convenience
export const createLead = (data: LeadData) => apiClient.createLead(data);
export const createTask = (data: TaskData) => apiClient.createTask(data);
export const logNote = (data: NoteData) => apiClient.logNote(data);
export const logTrace = (data: TraceData) => apiClient.logTrace(data);
export const fetchKB = (query: string, topK?: number) => apiClient.fetchKB(query, topK);
export const getUserProfile = (email: string) => apiClient.getUserProfile(email);

export default apiClient;