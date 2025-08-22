// Optional: SQL snippets/reference for Supabase RLS policies
export const policies = {
  select: 'SELECT * FROM my_table WHERE user_id = auth.uid();',
  insert: 'INSERT INTO my_table ...',
};
