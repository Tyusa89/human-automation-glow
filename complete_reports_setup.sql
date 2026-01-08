-- Complete database setup for the reports system

-- First, create the reports table if it doesn't exist
CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL,
  title TEXT NOT NULL,
  params JSONB DEFAULT '{}',
  file_bucket TEXT NOT NULL,
  file_path TEXT NOT NULL,
  status TEXT DEFAULT 'ready',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Create policies for reports
CREATE POLICY "Users can view their own reports" ON reports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reports" ON reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports" ON reports
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reports" ON reports
  FOR DELETE USING (auth.uid() = user_id);

-- Drop existing function if it exists to handle return type changes
DROP FUNCTION IF EXISTS report_metrics(UUID, TIMESTAMP WITH TIME ZONE, TIMESTAMP WITH TIME ZONE);

-- Create the report_metrics function that the Edge Function needs
CREATE OR REPLACE FUNCTION report_metrics(
  p_user_id UUID,
  p_start TIMESTAMP WITH TIME ZONE,
  p_end TIMESTAMP WITH TIME ZONE
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  -- Generate sample metrics based on existing tables
  -- This function aggregates data from your contacts, notes, etc.
  
  WITH metrics AS (
    SELECT 
      -- Contacts metrics
      COALESCE((
        SELECT COUNT(*)
        FROM contacts 
        WHERE user_id = p_user_id 
        AND created_at >= p_start 
        AND created_at <= p_end
      ), 0) as contacts_new,
      
      COALESCE((
        SELECT COUNT(*)
        FROM contacts 
        WHERE user_id = p_user_id
      ), 0) as contacts_total,
      
      -- Notes metrics  
      COALESCE((
        SELECT COUNT(*)
        FROM notes 
        WHERE user_id = p_user_id 
        AND created_at >= p_start 
        AND created_at <= p_end
      ), 0) as notes_new,
      
      COALESCE((
        SELECT COUNT(*)
        FROM notes 
        WHERE user_id = p_user_id
      ), 0) as notes_total,
      
      -- Pinned notes
      COALESCE((
        SELECT COUNT(*)
        FROM notes 
        WHERE user_id = p_user_id 
        AND is_pinned = true
      ), 0) as notes_pinned,
      
      -- Sample appointment/lead metrics (placeholder for future tables)
      0 as appointments_count,
      0 as appointments_upcoming_7d,
      0 as leads_new,
      '{}' as leads_by_status,
      '{}' as appointments_by_status
  )
  SELECT json_build_object(
    'contacts_new', contacts_new,
    'contacts_total', contacts_total,
    'notes_new', notes_new,
    'notes_total', notes_total,
    'notes_pinned', notes_pinned,
    'appointments_count', appointments_count,
    'appointments_upcoming_7d', appointments_upcoming_7d,
    'leads_new', leads_new,
    'leads_by_status', leads_by_status,
    'appointments_by_status', appointments_by_status
  ) INTO result
  FROM metrics;
  
  RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION report_metrics TO authenticated;

-- Storage bucket policies (run these after creating the 'reports' bucket in Supabase Storage)
-- Note: First create the bucket in Supabase Dashboard: Storage → Create new bucket → Name: 'reports' → Private

-- Policy for users to view their own report files
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can view own report files'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can view own report files"
    ON storage.objects FOR SELECT
    USING ( bucket_id = ''reports'' AND (storage.foldername(name))[1] = auth.uid()::text );';
  END IF;
END $$;

-- Policy for service role to upload files (for Edge Function)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Service role can upload report files'
  ) THEN
    EXECUTE 'CREATE POLICY "Service role can upload report files"
    ON storage.objects FOR INSERT
    WITH CHECK ( bucket_id = ''reports'' AND auth.role() = ''service_role'' );';
  END IF;
END $$;