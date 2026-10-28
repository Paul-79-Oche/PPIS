require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
}

// We use the service role key to bypass RLS when performing admin actions
// or strictly verified operations on the backend.
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Ensures the 'school-media' bucket exists in Supabase Storage.
 */
async function ensureStorageBucket() {
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
