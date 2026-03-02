const { Router } = require('express');
const { connectDB } = require('../db');

const router = Router();

/**
 * GET /api/galeri-foto
 * Query params:
 *   page  – nomor halaman (default: 1)
 *   limit – item per halaman (default: 6)
 *   album – filter album (default: 'all')
 */
router.get('/', async (req, res) => {
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
});

module.exports = router;
