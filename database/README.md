# MongoDB Seeder – Dinas Pangan Provinsi Sumatera Barat

Seeder ini menghasilkan **1.000 data dummy** ke database MongoDB lokal.

## Distribusi data

| Collection    | Jumlah |
|---------------|--------|
| `berita`      | 300    |
| `download`    | 200    |
| `galeri_foto` | 200    |
| `galeri_video`| 150    |
| `kegiatan`    | 150    |
| **Total**     | **1.000** |

## Prasyarat

- **Node.js** ≥ 18
- **MongoDB** berjalan di lokal (default: `mongodb://localhost:27017`)  
  Atau gunakan MongoDB Atlas / Docker.

## Cara Menjalankan

```bash
# 1. Masuk ke folder database
cd database

# 2. Install dependensi
npm install

# 3. Salin dan sesuaikan konfigurasi koneksi
copy .env.example .env
# Edit .env jika MongoDB URI atau nama DB berbeda

# 4. Jalankan seeder
npm run seed
```

Output yang diharapkan:
```
✅  Terhubung ke MongoDB – mongodb://localhost:27017
📦  Database : dinas_pangan_sumbar

  📰  berita       : 300 dokumen
  📥  download     : 200 dokumen
  🖼️   galeri_foto  : 200 dokumen
  🎬  galeri_video : 150 dokumen
  📅  kegiatan     : 150 dokumen

✅  Selesai! Total 1000 data berhasil dimasukkan ke "dinas_pangan_sumbar"
```

## Struktur Dokumen

### berita
```json
{
  "id": 1,
  "title": "Dinas Pangan Sumbar Gelar Sosialisasi ...",
  "excerpt": "...",
  "content": "<p>...</p>",
  "image": "https://images.unsplash.com/...",
  "date": "2024-03-10",
  "category": "Program",
  "author": "Admin Dinas Pangan",
  "status": "published",
  "views": 432,
  "tags": ["ketahanan pangan", "KRPL"],
  "createdAt": "2024-03-10T...",
  "updatedAt": "2024-03-10T..."
}
```

### download
```json
{
  "id": 1,
  "title": "Laporan Ketahanan Pangan 2024",
  "description": "...",
  "fileType": "PDF",
  "fileSize": "2.4 MB",
  "uploadDate": "2024-01-15",
  "category": "Laporan",
  "downloadCount": 145,
  "fileName": "laporan-ketahanan-pangan-2024.pdf",
  "url": "/files/laporan-ketahanan-pangan-2024.pdf",
  "createdAt": "...",
  "updatedAt": "..."
}
```

### galeri_foto
```json
{
  "id": 1,
  "title": "APN 2024",
  "date": "17 Desember 2024 09:08:14 WIB",
  "author": "administrator2",
  "views": "160 view",
  "image": "https://images.unsplash.com/...",
  "description": "...",
  "album": "APN",
  "createdAt": "...",
  "updatedAt": "..."
}
```

### galeri_video
```json
{
  "id": 1,
  "title": "Profil Dinas Pangan Provinsi Sumatera Barat 2024",
  "date": "...",
  "author": "administrator",
  "views": 1234,
  "thumbnail": "https://img.youtube.com/vi/.../hqdefault.jpg",
  "youtubeUrl": "https://www.youtube.com/watch?v=...",
  "embedUrl": "https://www.youtube.com/embed/...",
  "duration": "06:55",
  "description": "...",
  "category": "Profil",
  "createdAt": "...",
  "updatedAt": "..."
}
```

### kegiatan
```json
{
  "id": 1,
  "title": "Pelatihan KRPL Kelompok Wanita Tani 2024",
  "description": "...",
  "date": "2024-05-20",
  "location": "Padang, Sumatera Barat",
  "organizer": "Dinas Pangan Provinsi Sumatera Barat",
  "status": "completed",
  "category": "KRPL",
  "participants": 75,
  "image": "https://images.unsplash.com/...",
  "createdAt": "...",
  "updatedAt": "..."
}
```

## Catatan

- Setiap kali `npm run seed` dijalankan, data lama **dihapus** dan diganti baru.
- Indexes teks (`text index`) dibuat otomatis di `berita` dan `download` untuk fitur pencarian.
- Ubah nilai `count` di dalam `seed.js` jika ingin lebih atau kurang dari 1000 data.
