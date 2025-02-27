import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
const client = new MongoClient(uri);
let isConnected = false;

export async function connectDB() {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
  }
  return client.db('Poikainscore');
}

export async function findUserByEmailOrUsername(email: string, userName: string) {
  const db = await connectDB();
  return db.collection('users').findOne({ $or: [{ email }, { userName }] });
}

export async function createUser(userData: { userName: string, firstName: string, lastName: string, email: string, password: string }) {
  const db = await connectDB();
  const result = await db.collection('users').insertOne(userData);
  return { ...userData, _id: result.insertedId };
}
