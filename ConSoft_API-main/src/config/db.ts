import mongoose from 'mongoose';
import { env } from './env';

export async function connectToDatabase(): Promise<void> {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.mongoUri);
  // eslint-disable-next-line no-console
  console.log('MongoDB connected');
}



