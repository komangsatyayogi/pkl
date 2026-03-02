import { connectDB } from '../server/db.js';

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
    const db    = await connectDB();
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 6);
    const album = req.query.album || 'all';

    const filter = {};
    if (album !== 'all') filter.album = album;

    const col   = db.collection('galeri_foto');
    const total = await col.countDocuments(filter);
    const data  = await col
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    const albums = await col.distinct('album');

    res.json({
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      albums: ['all', ...albums.sort()],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengambil data galeri foto' });
  }
}
