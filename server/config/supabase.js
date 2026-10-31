require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');

/**
 * Sanitize environment variable values by trimming whitespace
 * and removing surrounding quotes that some hosting platforms add.
 */
function cleanEnv(value) {
  if (!value) return '';
  return value.trim().replace(/^["']|["']$/g, '');
}

const supabaseUrl = cleanEnv(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
);
const supabaseServiceKey = cleanEnv(
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY
);

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    '⚠️ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.',
    'Ensure these environment variables are set in your hosting dashboard (e.g. Vercel).'
  );
}

// We use the service role key to bypass RLS when performing admin actions
// or strictly verified operations on the backend.
// createClient will throw if URL/key are empty, so we guard with defaults
// that produce a non-functional but non-crashing client.
const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseServiceKey || 'placeholder-key'
);

/**
 * Ensures the 'school-media' bucket exists in Supabase Storage.
 */
async function ensureStorageBucket() {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('⚠️ Skipping storage bucket check — Supabase credentials not configured.');
    return;
  }
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) {
      console.warn('⚠️ Could not list storage buckets:', error.message);
      return;
    }
    const bucketExists = buckets.some((b) => b.name === 'school-media');
    if (!bucketExists) {
      const { error: createError } = await supabase.storage.createBucket('school-media', {
        public: true,
      });
      if (createError) {
        console.warn('⚠️ Could not create school-media bucket:', createError.message);
      } else {
        console.log('✅ Created public storage bucket: school-media');
      }
    } else {
      console.log('✅ Storage bucket "school-media" verified.');
    }
  } catch (err) {
    console.error('Storage bucket check failed:', err);
  }
}

module.exports = supabase;
module.exports.ensureStorageBucket = ensureStorageBucket;
