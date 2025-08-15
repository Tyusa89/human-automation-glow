CREATE POLICY "Users can view their own email"
ON profiles
FOR SELECT
USING (auth.uid() = id);