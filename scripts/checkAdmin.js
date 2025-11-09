const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://hafizzes7_db_user:Basit1244@cluster0.vyjskng.mongodb.net/voltwise?retryWrites=true&w=majority';

async function checkAdmin() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check admins collection
    const admins = await mongoose.connection.db.collection('admins').find({}).toArray();
    console.log('📊 Total admin users:', admins.length);
    
    if (admins.length > 0) {
      console.log('👥 Admin users found:');
      admins.forEach(admin => {
        console.log('---');
        console.log('Email:', admin.email);
        console.log('Username:', admin.username);
        console.log('Role:', admin.role);
        console.log('Password:', admin.password ? '✅ Set' : '❌ Missing');
        console.log('Is Active:', admin.isActive);
      });
    } else {
      console.log('❌ No admin users found in database');
    }

    // Also check if we're in the right database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📁 Collections in database:');
    collections.forEach(collection => {
      console.log('-', collection.name);
    });

    await mongoose.disconnect();
    console.log('\n✅ Check completed');
    
  } catch (error) {
    console.error('❌ Error checking admin:', error);
  } finally {
    process.exit(0);
  }
}

checkAdmin();