import { supabase } from '@/integrations/supabase/client';

/**
 * Helper function to log task results to the database with proper user context
 */
export async function logResult(
  task: string,
  params: any,
  payload: any,
  status: 'ok' | 'error' = 'ok',
  logs: string[] = []
) {
  const { data: u } = await supabase.auth.getUser();
  const uid = u?.user?.id;
  if (!uid) throw new Error('Not authenticated');

  const { error } = await supabase.from('results').insert({
    user_id: uid, task, params, payload, status, logs
  });
  if (error) throw error;
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