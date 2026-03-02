const { Router } = require('express');
const { connectDB } = require('../db');

const router = Router();

/**
 * GET /api/kegiatan
 * Query params:
 *   page     – nomor halaman (default: 1)
 *   limit    – item per halaman (default: 6)
 *   category – filter kategori (default: 'all')
 *   status   – filter status: upcoming | ongoing | completed (default: 'all')
 */
router.get('/', async (req, res) => {
  try {
    const db       = await connectDB();
    const page     = Math.max(1, parseInt(req.query.page)  || 1);
    const limit    = Math.min(50, parseInt(req.query.limit) || 6);
    const category = req.query.category || 'all';
    const status   = req.query.status   || 'all';

    const filter = {};
    if (category !== 'all') filter.category = category;
    if (status   !== 'all') filter.status   = status;

    const col   = db.collection('kegiatan');
    const total = await col.countDocuments(filter);
    const data  = await col
      .find(filter)
      .sort({ date: -1 })
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
    res.status(500).json({ error: 'Gagal mengambil data kegiatan' });
  }
});

module.exports = router;
