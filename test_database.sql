-- Test if we can see the tables and their structure
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name IN ('notes', 'contacts')
ORDER BY table_name, ordinal_position;

-- Test if we can query the notes table
SELECT COUNT(*) as note_count FROM notes;

-- Test if we can query the contacts table  
SELECT COUNT(*) as contact_count FROM contacts;

-- Check what columns actually exist in notes table
SELECT column_name FROM information_schema.columns WHERE table_name = 'notes';

-- Check what columns actually exist in contacts table
SELECT column_name FROM information_schema.columns WHERE table_name = 'contacts';