import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI.replace(/\/$/, '');
    const conn = await mongoose.connect(`${mongoUri}/${DB_NAME}`, { dbName: DB_NAME });
    console.log(`MongoDB Connected: ${conn.connection.host} / ${conn.connection.name}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
