const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const projectRef = 'rzmkutmawuajgnditcaq';
const token = process.env.SUPABASE_ACCESS_TOKEN;

if (!token) {
  console.error('Missing SUPABASE_ACCESS_TOKEN');
  process.exit(1);
}

async function runQuery(sql, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: sql }),
      });

      const text = await res.text();
      if (!res.ok) {
        throw new Error(`Query failed: ${res.status} ${res.statusText}\n${text}`);
      }
      return text;
    } catch (err) {
      if (attempt === retries) throw err;
      console.warn(`[Attempt ${attempt}/${retries}] Network error, retrying in 2s...`, err.message);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

async function main() {
  console.log('=== Applying Migrations to Supabase ===');

  const teachersSql = fs.readFileSync(
    path.join(__dirname, '../supabase/migrations/20260908_teachers.sql'),
    'utf-8'
  );
  console.log('Running 20260908_teachers.sql...');
  await runQuery(teachersSql);
  console.log('✓ 20260908_teachers.sql executed successfully.');

  const droosSql = fs.readFileSync(
    path.join(__dirname, '../supabase/migrations/20260908_droos_table.sql'),
    'utf-8'
  );
  console.log('Running 20260908_droos_table.sql...');
  await runQuery(droosSql);
  console.log('✓ 20260908_droos_table.sql executed successfully.');

  console.log('=== All Migrations Applied! ===');
}

main().catch((err) => {
  console.error('Migration error:', err);
  process.exit(1);
});
