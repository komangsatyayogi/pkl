import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'dinas_pangan_sumbar';

let cachedClient = null;
let cachedDb = null;

export async function connectDB() {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    const client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });

    await client.connect();
    cachedClient = client;
    cachedDb = client.db(DB_NAME);
    
    console.log(`✅  MongoDB terhubung – database: ${DB_NAME}`);
    return cachedDb;
  } catch (error) {
    console.error('❌  Gagal koneksi MongoDB:', error.message);
    throw error;
  }
}
