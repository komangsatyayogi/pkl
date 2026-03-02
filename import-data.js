import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MONGODB_URI = 'mongodb+srv://oxmang:oxmang24@dinaspangansumbar.id74iwk.mongodb.net/dinas_pangan_sumbar?retryWrites=true&w=majority';
const DB_NAME = 'dinas_pangan_sumbar';

const collections = [
  { name: 'berita', file: 'database/json-export/berita.json' },
  { name: 'download', file: 'database/json-export/download.json' },
  { name: 'galeri_foto', file: 'database/json-export/galeri_foto.json' },
  { name: 'galeri_video', file: 'database/json-export/galeri_video.json' },
  { name: 'kegiatan', file: 'database/json-export/kegiatan.json' },
];

async function importData() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');
    
    const db = client.db(DB_NAME);
    
    for (const col of collections) {
      try {
        const filePath = path.join(__dirname, col.file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        
        // Clear existing collection
        await db.collection(col.name).deleteMany({});
        
        // Insert new data
        const result = await db.collection(col.name).insertMany(data);
        console.log(`✅ ${col.name}: ${result.insertedCount} documents imported`);
      } catch (err) {
        console.error(`❌ Error importing ${col.name}:`, err.message);
      }
    }
    
    console.log('\n✅ All data imported successfully!');
  } finally {
    await client.close();
  }
}

importData().catch(console.error);
