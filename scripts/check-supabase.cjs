// Temporary script to test Supabase connection & inspect tables
// Uses realtime disabled to work on Node 20
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: { transport: { WebSocket: undefined } },
  auth: { persistSession: false },
});

async function main() {
  console.log('=== Testing Supabase Connection ===');
  console.log('URL:', supabaseUrl);

  const tables = ['teachers', 'educational_stages', 'grade_levels', 'courses', 'modules', 'lessons'];

  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(10);
    console.log(`\n--- ${table} ---`);
    if (error) {
      console.log('Error:', error.message, error.code);
    } else {
      console.log(`Rows (${data.length}):`, JSON.stringify(data, null, 2));
    }
  }
}

main().catch(console.error);
