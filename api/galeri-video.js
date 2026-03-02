import { connectDB } from './db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,HEAD');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const db       = await connectDB();
    const page     = Math.max(1, parseInt(req.query.page)  || 1);
    const limit    = Math.min(50, parseInt(req.query.limit) || 6);
    const category = req.query.category || 'all';

    const filter = {};
    if (category !== 'all') filter.category = category;

    const col   = db.collection('galeri_video');
    const total = await col.countDocuments(filter);
    const data  = await col
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    const categories = await col.distinct('category');

    res.json({
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      categories: ['all', ...categories.sort()],
    });
  } catch (err) {
    console.error('❌ API Galeri Video Error:', {
      message: err.message,
      stack: err.stack
    });
    
    const errorMsg = err.message?.includes('MONGODB_URI') 
      ? 'MongoDB belum dikonfigurasi. Hubungi admin.' 
      : err.message || 'Gagal mengambil data galeri video';
    
    res.status(500).json({ 
      error: errorMsg,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}
