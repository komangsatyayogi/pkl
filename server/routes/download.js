const { Router } = require('express');
const { connectDB } = require('../db');

const router = Router();

/**
 * GET /api/download
 * Query params:
 *   page     – nomor halaman (default: 1)
 *   limit    – item per halaman (default: 5)
 *   category – filter kategori (default: 'all')
 *   search   – cari teks bebas di title / description
 */
router.get('/', async (req, res) => {
  try {
    const db       = await connectDB();
    const page     = Math.max(1, parseInt(req.query.page)  || 1);
    const limit    = Math.min(50, parseInt(req.query.limit) || 5);
    const category = req.query.category || 'all';
    const search   = req.query.search   || '';

    const filter = {};
    if (category !== 'all') filter.category = category;
    if (search) filter.$text = { $search: search };

    const col   = db.collection('download');
    const total = await col.countDocuments(filter);
    const data  = await col
      .find(filter)
      .sort({ uploadDate: -1 })
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
    res.status(500).json({ error: 'Gagal mengambil data download' });
  }
});

module.exports = router;
