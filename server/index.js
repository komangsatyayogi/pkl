require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const { connectDB } = require('./db');

const beritaRouter   = require('./routes/berita');
const downloadRouter = require('./routes/download');
const fotoRouter     = require('./routes/foto');
const videoRouter    = require('./routes/video');
const kegiatanRouter = require('./routes/kegiatan');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── routes ────────────────────────────────────────────────────────────────────
app.use('/api/berita',      beritaRouter);
app.use('/api/download',    downloadRouter);
app.use('/api/galeri-foto', fotoRouter);
app.use('/api/galeri-video',videoRouter);
app.use('/api/kegiatan',    kegiatanRouter);

// ── health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Dinas Pangan API berjalan' });
});

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route tidak ditemukan' });
});

// ── start ─────────────────────────────────────────────────────────────────────
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀  Server berjalan di http://localhost:${PORT}`);
      console.log(`📡  Endpoint tersedia:`);
      console.log(`    GET /api/berita`);
      console.log(`    GET /api/download`);
      console.log(`    GET /api/galeri-foto`);
      console.log(`    GET /api/galeri-video`);
      console.log(`    GET /api/kegiatan`);
    });
  })
  .catch((err) => {
    console.error('❌  Gagal koneksi ke MongoDB:', err.message);
    process.exit(1);
  });
