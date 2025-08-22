import { supabase } from '@/integrations/supabase/client';

/**
 * Helper function to log task results to the database with proper user context
 */
export async function logResult(
  task: string,
  params: any = {},
  payload: any = null,
  status: 'ok' | 'error' | 'pending' = 'ok',
  logs: string[] = []
) {
  try {
    const { error } = await supabase
      .from('results')
      .insert({
        task,
        params,
        payload,
        status,
        logs
      });

    if (error) {
      console.error('Failed to log result:', error);
    }
  } catch (err) {
    console.error('Error logging result:', err);
  }
}

/**
 * Improved task runner with proper authentication and result logging
 */
export async function runTask(task: "daily_kpi" | "generate_sop", params: any = {}) {
  try {
    const { data, error } = await supabase.functions.invoke('run-task', { 
      body: { task, params } 
    });
    
    if (error) {
      await logResult(task, params, null, 'error', [error.message]);
      throw error;
    }
    
    await logResult(task, params, data?.payload ?? null, 'ok', data?.logs ?? []);
    return data; // { status, payload, logs }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    await logResult(task, params, null, 'error', [errorMessage]);
    throw err;
  }
}