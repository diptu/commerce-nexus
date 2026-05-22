import 'dotenv/config';
import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
    const dbUri = process.env.MONGODB_URI;

    if (!dbUri) {
        console.error('❌ Database connection failed: MONGODB_URI is undefined.');
        process.exit(1);
    }

    try {
        const conn = await mongoose.connect(dbUri);
        console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('❌ Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

