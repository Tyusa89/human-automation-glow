-- Create reports table
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

-- Create storage bucket for reports (this should be run in the Storage section of Supabase)
-- Go to Storage → Create new bucket:
-- Name: reports
-- Public: false (private)
-- File size limit: 50MB
-- Allowed MIME types: text/html, application/pdf

-- Storage policies (run these in the SQL editor after creating the bucket)
-- Allow users to view their own report files
CREATE POLICY "Users can view own report files"
ON storage.objects FOR SELECT
USING ( bucket_id = 'reports' AND (storage.foldername(name))[1] = auth.uid()::text );

-- Allow the service role to upload files (for the edge function)
CREATE POLICY "Service role can upload report files"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'reports' AND auth.role() = 'service_role' );