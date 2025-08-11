const SUPABASE_URL = 'https://rqldulvkwzvrmcvwttep.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxbGR1bHZrd3p2cm1jdnd0dGVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MzUzMzQsImV4cCI6MjA3MDIxMTMzNH0.rbgipKLn_obCtSP7sKOf-1k40twWwgi2sEesLBJrGNw';

const TABLES = {
  Leads: 'leads',
  Tasks: 'tasks', 
  Notes: 'notes',
  Meetings: 'meetings',
  Traces: 'traces',
  KB: 'knowledge_base', // Fixed: actual table name is knowledge_base
  Profiles: 'profiles'
};

function syncAll() {
  Object.entries(TABLES).forEach(([sheetName, table]) => syncTable(sheetName, table));
}

function syncTable(sheetName, table) {
  const url = `${SUPABASE_URL}/rest/v1/${table}?select=*`;
  const res = UrlFetchApp.fetch(url, {
    method: 'get',
    headers: { 
      apikey: ANON_KEY, 
      Authorization: `Bearer ${ANON_KEY}`,
      'Content-Type': 'application/json'
    },
    muteHttpExceptions: true
  });
  
  const data = JSON.parse(res.getContentText());
  if (!Array.isArray(data)) {
    console.log(`Error syncing ${sheetName}:`, data);
    return;
  }

  const sh = SpreadsheetApp.getActive().getSheetByName(sheetName) || SpreadsheetApp.getActive().insertSheet(sheetName);
  sh.clear();
  
  if (data.length === 0) {
    sh.getRange(1,1).setValue('No data');
    return;
  }

  const headers = Object.keys(data[0]);
  sh.getRange(1,1,1,headers.length).setValues([headers]);
  const rows = data.map(obj => headers.map(h => obj[h] ?? ''));
  sh.getRange(2,1,rows.length,headers.length).setValues(rows);
  
  console.log(`Synced ${rows.length} rows to ${sheetName}`);
}

// Optional: Set up automatic sync trigger
function createDailyTrigger() {
  ScriptApp.newTrigger('syncAll')
    .timeBased()
    .everyDays(1)
    .atHour(9) // 9 AM
    .create();
}