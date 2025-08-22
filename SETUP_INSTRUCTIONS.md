# Contact Form Auto-Reply Setup Instructions

## Database Setup

You need to create the contact submissions table in your Supabase database. Go to your Supabase dashboard > SQL Editor and run:

```sql
-- Create contact_submissions table
CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add RLS (Row Level Security)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from authenticated users and service role
CREATE POLICY "Allow inserts on contact_submissions" ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- Create policy to allow selects for service role only (for admin purposes)
CREATE POLICY "Allow select on contact_submissions for service role" ON contact_submissions
  FOR SELECT USING (auth.role() = 'service_role');
```

## Edge Function Setup

The contact form edge function has been created at `supabase/functions/contact-form/index.ts`. 

To deploy it to your Supabase project:

1. Install Supabase CLI if you haven't already
2. Log in to your Supabase account: `supabase login`
3. Link your project: `supabase link --project-ref YOUR_PROJECT_ID`
4. Deploy the function: `supabase functions deploy contact-form`

## Email Integration (Optional)

The current implementation logs the auto-reply email to the console. To actually send emails, you can:

1. **Use Resend** (Recommended):
   - Add Resend to your Supabase secrets
   - Install Resend in your edge function
   - Replace the console.log with actual email sending

2. **Use SendGrid**:
   - Add SendGrid API key to Supabase secrets
   - Integrate SendGrid API in the edge function

3. **Use native Supabase Auth email**:
   - Configure SMTP settings in Supabase Auth settings

## Features Implemented

✅ Contact form with validation (name, email, message)  
✅ Form submission handling with loading states  
✅ Database storage of contact submissions  
✅ Auto-reply email structure (ready for email provider)  
✅ Error handling and user feedback with toasts  
✅ Form reset after successful submission

## Next Steps

1. Run the SQL to create the database table
2. Deploy the edge function
3. Configure email sending (optional but recommended)
4. Test the contact form on your website