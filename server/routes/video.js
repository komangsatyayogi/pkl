const { Router } = require('express');
const { connectDB } = require('../db');

const router = Router();

/**
 * GET /api/galeri-video
 * Query params:
 *   page     – nomor halaman (default: 1)
 *   limit    – item per halaman (default: 6)
 *   category – filter kategori (default: 'all')
 */
router.get('/', async (req, res) => {
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
    console.error(err);
    res.status(500).json({ error: 'Gagal mengambil data galeri video' });
  }
});

module.exports = router;
