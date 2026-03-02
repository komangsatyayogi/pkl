const { Router } = require('express');
const { connectDB } = require('../db');

const router = Router();

/**
 * GET /api/berita
 * Query params:
 *   page     – nomor halaman (default: 1)
 *   limit    – item per halaman (default: 6)
 *   category – filter kategori (default: 'all')
 *   search   – cari teks bebas di title / excerpt
 *   sort     – 'newest' | 'oldest' (default: 'newest')
 */
router.get('/', async (req, res) => {
  try {
    const db       = await connectDB();
    const page     = Math.max(1, parseInt(req.query.page)  || 1);
    const limit    = Math.min(50, parseInt(req.query.limit) || 6);
    const category = req.query.category || 'all';
    const search   = req.query.search   || '';
    const sort     = req.query.sort === 'oldest' ? 1 : -1;

    const filter = { status: 'published' };
    if (category !== 'all') filter.category = category;
    if (search) filter.$text = { $search: search };

    const col   = db.collection('berita');
    const total = await col.countDocuments(filter);
    const data  = await col
      .find(filter)
      .sort({ date: sort })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    // Ambil daftar kategori unik
    const categories = await col.distinct('category', { status: 'published' });

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
    res.status(500).json({ error: 'Gagal mengambil data berita' });
  }
});

/**
 * GET /api/berita/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const db   = await connectDB();
    const item = await db.collection('berita').findOne({ id: parseInt(req.params.id) });
    if (!item) return res.status(404).json({ error: 'Berita tidak ditemukan' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data' });
  }
});

module.exports = router;
