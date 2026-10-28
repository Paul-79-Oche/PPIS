require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const supabase = require('../config/supabase');

const ADMIN_EMAIL = 'admin@ppis.edu.ng';
const ADMIN_PASSWORD = 'Admin@PPIS2025!';

async function initAdmin() {
  console.log('🔑 PPIS Admin Provisioning Script');
  console.log('─────────────────────────────────');

  try {
    // Try to list existing users to check if admin already exists
    const { data: listData, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      console.error('❌ Failed to list users:', listError.message);
      process.exit(1);
    }

    const existingAdmin = listData.users.find((u) => u.email === ADMIN_EMAIL);

    if (existingAdmin) {
      console.log(`✅ Admin account already exists: ${ADMIN_EMAIL}`);
      console.log(`   User ID: ${existingAdmin.id}`);
      console.log('   No changes made.');
      return;
    }

    // Create the admin user with email confirmed
    console.log(`⏳ Creating admin account: ${ADMIN_EMAIL} ...`);
    const { data, error } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
    });

    if (error) {
      console.error('❌ Failed to create admin user:', error.message);
      process.exit(1);
    }

    console.log('');
    console.log('✅ Admin account created successfully!');
    console.log(`   Email:    ${data.user.email}`);
    console.log(`   User ID:  ${data.user.id}`);
    console.log('');
    console.log('🔐 Default Login Credentials:');
    console.log(`   Email:    ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log('');
    console.log('⚠️  IMPORTANT: Change the password after first login via Supabase Dashboard.');

  } catch (err) {
    console.error('❌ Unexpected error during admin provisioning:', err.message);
    process.exit(1);
  }
}

initAdmin();
