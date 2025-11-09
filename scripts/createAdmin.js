const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb+srv://hafizzes7_db_user:Basit1244@cluster0.vyjskng.mongodb.net/voltwise?retryWrites=true&w=majority';

async function createInitialAdmin() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await mongoose.connection.db.collection('admins').findOne({ 
      email: 'admin@voltwise.com' 
    });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists:');
      console.log('Email:', existingAdmin.email);
      console.log('Username:', existingAdmin.username);
      console.log('Role:', existingAdmin.role);
      
      // Test the password
      if (existingAdmin.password) {
        const isPasswordValid = await bcrypt.compare('admin123', existingAdmin.password);
        console.log('Password test (admin123):', isPasswordValid ? '✅ Valid' : '❌ Invalid');
      } else {
        console.log('❌ No password set for admin');
      }
      
    } else {
      console.log('🆕 Creating new admin user...');
      
      // Hash the password
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      const admin = {
        username: 'superadmin',
        email: 'admin@voltwise.com',
        password: hashedPassword,
        role: 'super-admin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await mongoose.connection.db.collection('admins').insertOne(admin);
      console.log('✅ Initial admin user created successfully!');
      console.log('Email: admin@voltwise.com');
      console.log('Password: admin123');
      console.log('⚠️  Please change the password after first login!');
    }
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    process.exit(0);
  }
}

createInitialAdmin();