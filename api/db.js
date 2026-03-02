import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'dinaspangansumbar';

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI tidak di-set dalam environment variables');
}

let cachedClient = null;
let cachedDb = null;

export async function connectDB() {
  if (cachedDb) {
    return cachedDb;
  }

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable tidak ditemukan. Pastikan sudah di-set di Vercel Environment Variables.');
  }

  try {
    console.log('🔄 Menghubungkan ke MongoDB...');
    const client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority',
      // SSL/TLS settings untuk production
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false,
    });

    await client.connect();
    cachedClient = client;
    cachedDb = client.db(DB_NAME);
    
    console.log(`✅ MongoDB terhubung – database: ${DB_NAME}`);
    return cachedDb;
  } catch (error) {
    console.error('❌ Error koneksi MongoDB:', {
      message: error.message,
      code: error.code,
      uri: MONGODB_URI ? 'ada' : 'tidak ada'
    });
    throw error;
  }
}
