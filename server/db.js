const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://oxmang:oxmang24@dinaspangansumbar.id74iwk.mongodb.net/?appName=dinaspangansumbar';
const DB_NAME = process.env.DB_NAME || 'dinas_pangan_sumbar';

let db = null;

async function connectDB() {
  if (db) return db;
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  db = client.db(DB_NAME);
  console.log(`✅  MongoDB terhubung – database: ${DB_NAME}`);
  return db;
}

module.exports = { connectDB };
