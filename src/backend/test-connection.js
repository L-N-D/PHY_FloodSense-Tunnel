import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

console.log('🔍 Testing MongoDB connection...');
console.log('📍 Connection string:', MONGO_URL ? 'Found' : 'NOT FOUND');

if (!MONGO_URL) {
    console.error('❌ MONGO_URL is not defined in .env file');
    process.exit(1);
}

try {
    await mongoose.connect(MONGO_URL);
    console.log('✅ MongoDB connected successfully!');
    console.log('📊 Database:', mongoose.connection.db.databaseName);

    // Test: Insert and retrieve a sample document
    const TestSchema = new mongoose.Schema({ test: String, timestamp: Date });
    const TestModel = mongoose.model('Test', TestSchema);

    const doc = await TestModel.create({ test: 'Connection works!', timestamp: new Date() });
    console.log('✅ Test document created:', doc._id);

    await TestModel.deleteOne({ _id: doc._id });
    console.log('✅ Test document deleted');

    await mongoose.disconnect();
    console.log('✅ Connection test passed!');
    console.log('\n🎉 Your MongoDB is working correctly!');
    process.exit(0);
} catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('\n📝 Possible solutions:');
    console.error('   1. Check if your IP is whitelisted in MongoDB Atlas');
    console.error('   2. Verify username and password are correct');
    console.error('   3. Ensure the cluster is running (not paused)');
    console.error('   4. Try allowing access from anywhere (0.0.0.0/0) temporarily');
    process.exit(1);
}
