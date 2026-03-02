/**
 * MongoDB Seeder - Dinas Pangan Provinsi Sumatera Barat
 * Total: 1000 data dummy
 *   - berita      : 300 dokumen
 *   - download     : 200 dokumen
 *   - galeri_foto  : 200 dokumen
 *   - galeri_video : 150 dokumen
 *   - kegiatan     : 150 dokumen
 *
 * Cara pakai:
 *   npm install
 *   cp .env.example .env   (lalu sesuaikan MONGODB_URI)
 *   node seed.js
 */

require('dotenv').config();
const { MongoClient } = require('mongodb');

// ── koneksi ─────────────────────────────────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME     = process.env.DB_NAME     || 'dinas_pangan_sumbar';

// ── helpers ──────────────────────────────────────────────────────────────────
const rnd        = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick       = (arr)      => arr[Math.floor(Math.random() * arr.length)];
const pickMany   = (arr, n)   => [...arr].sort(() => 0.5 - Math.random()).slice(0, n);
const rndDate    = (start, end) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const pad        = (n)  => String(n).padStart(2, '0');
const fmtDate    = (d)  =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fmtWIB     = (d)  =>
  `${pad(d.getDate())} ${BULAN_IND[d.getMonth()]} ${d.getFullYear()} ` +
  `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} WIB`;

const BULAN_IND  = [
  'Januari','Februari','Maret','April','Mei','Juni',
  'Juli','Agustus','September','Oktober','November','Desember'
];

// ── template data ─────────────────────────────────────────────────────────────
const START = new Date('2020-01-01');
const END   = new Date('2026-02-28');

const KABKOTA = [
  'Padang','Bukittinggi','Solok','Padang Panjang','Sawahlunto',
  'Payakumbuh','Pariaman','Agam','Tanah Datar','Pesisir Selatan',
  'Sijunjung','Pasaman','Lima Puluh Kota','Dharmasraya','Solok Selatan',
  'Pasaman Barat','Kepulauan Mentawai','Padang Pariaman'
];

const AUTHORS = [
  'Admin Dinas Pangan','administrator','administrator2','administrator3',
  'Humas Dinas Pangan','Redaksi PKL','Bidang Ketersediaan','Bidang Distribusi',
  'Bidang Konsumsi','Sekretariat','UPTD BPSMP'
];

const BERITA_CATEGORIES = ['Program','Kegiatan','Prestasi','Workshop','Inovasi','Berita','Pengumuman','Informasi'];
const BERITA_TAGS_POOL  = [
  'ketahanan pangan','pangan lokal','pertanian','B2SA','KRPL','LDPM',
  'harga pangan','distribusi','sertifikasi','keamanan pangan','stunting',
  'Sumbar','Sumatera Barat','BAPANAS','Bulog','bantuan benih','produksi padi',
  'cadangan pangan','SKPG','Demapan','lumbung pangan','diversifikasi'
];

const BERITA_TITLE_PREFIXES = [
  'Dinas Pangan Sumbar',
  'Pemerintah Provinsi Sumatera Barat',
  'Badan Pangan Nasional',
  'Tim Ketahanan Pangan',
  'Kelompok Tani',
  'UPTD BPSMP Sumbar',
  'Bidang Distribusi Pangan',
  'Bidang Ketersediaan Pangan',
  'Bidang Konsumsi Pangan',
];

const BERITA_TITLE_BODIES = [
  'Gelar Sosialisasi Program Ketahanan Pangan',
  'Melaksanakan Rapat Optimalisasi Realisasi Kegiatan',
  'Raih Penghargaan Stabilisasi Pasokan dan Harga Pangan',
  'Luncurkan Program Kawasan Rumah Pangan Lestari',
  'Adakan Workshop Diversifikasi Pangan Lokal',
  'Distribusikan Bantuan Benih Padi Unggulan kepada Petani',
  'Monitoring Stok Beras di Gudang Bulog',
  'Selenggarakan Festival Pangan Nusantara',
  'Evaluasi Capaian Program Lumbung Pangan',
  'Tingkatkan Kapasitas SDM melalui Bimbingan Teknis',
  'Koordinasi Lintas Sektor dalam Stabilisasi Harga Pangan',
  'Berhasil Turunkan Angka Kerawanan Pangan di Wilayah Terpencil',
  'Publikasikan Neraca Pangan Provinsi Sumatera Barat',
  'Dorong Konsumsi Pangan B2SA di Masyarakat',
  'Verifikasi Data Cadangan Pangan Masyarakat',
  'Implementasikan Sistem Informasi Harga Pangan Online',
  'Kembangkan Demplot Pertanian Organik',
  'Pantau Perkembangan Harga Komoditas Pangan Strategis',
  'Edukasi Masyarakat tentang Keamanan Pangan',
  'Sertifikasi Produk Pangan Olahan Lokal',
  'Adakan Pelatihan Pengolahan Hasil Pertanian',
  'Rakor Penanganan Kerawanan Pangan Daerah Terpencil',
  'Apresiasi Kelompok Tani Berprestasi Tingkat Provinsi',
  'Dorong Pengembangan Pangan Fungsional Berbasis Lokal',
  'Tandatangani MoU dengan Universitas untuk Riset Ketahanan Pangan',
  'Lakukan Uji Mutu Beras di Pasar Tradisional',
  'Kunjungi Petani Milenial Pengguna Teknologi Modern',
  'Fasilitasi Akses Pembiayaan untuk Usaha Pangan Lokal',
  'Launching Aplikasi Pemantauan Harga Pangan Real-Time',
  'Rapat Koordinasi TPID Bahas Stabilisasi Pangan',
];

const BERITA_EXCERPTS = [
  'Program ini bertujuan untuk meningkatkan ketahanan pangan di Provinsi Sumatera Barat secara berkelanjutan melalui pendekatan partisipatif masyarakat.',
  'Kegiatan tersebut dihadiri oleh perwakilan dari 18 kabupaten/kota di Sumatera Barat untuk membahas berbagai isu terkait pangan.',
  'Dinas Pangan terus berupaya menjaga stabilitas ketersediaan pangan di tengah berbagai tantangan iklim dan dinamika pasar global.',
  'Melalui program ini, diharapkan masyarakat dapat memenuhi kebutuhan pangan secara mandiri dan berkelanjutan.',
  'Pencapaian ini merupakan hasil kerja keras seluruh jajaran Dinas Pangan bersama masyarakat dan pemangku kepentingan di Sumatera Barat.',
  'Inovasi dalam bidang pangan terus dikembangkan untuk mendukung ketahanan pangan nasional sesuai arahan Pemerintah Pusat.',
  'Kegiatan monitoring rutin dilaksanakan untuk memastikan pasokan pangan mencukupi kebutuhan masyarakat, terutama menjelang hari-hari besar.',
  'Petani dan kelompok tani diberikan pendampingan intensif dalam rangka meningkatkan produktivitas dan kualitas hasil pertanian.',
  'Harga komoditas pangan pokok dipantau secara berkala guna mencegah terjadinya gejolak harga yang merugikan konsumen dan petani.',
  'Workshop ini menghadirkan narasumber berpengalaman di bidang ketahanan pangan untuk berbagi pengetahuan dan pengalaman terbaik.',
  'Program bantuan benih unggul disalurkan kepada ribuan petani di seluruh kabupaten/kota Sumatera Barat untuk mendorong peningkatan produksi.',
  'Koordinasi intensif dilakukan bersama pemerintah kabupaten/kota, Bulog, dan asosiasi petani untuk menjaga kestabilan harga pangan.',
  'Gerakan konsumsi pangan B2SA terus digalakkan sebagai upaya peningkatan gizi masyarakat dan pencegahan stunting di Sumatera Barat.',
  'Sertifikasi produk pangan lokal menjadi langkah penting untuk meningkatkan daya saing komoditas Sumatera Barat di pasar nasional.',
  'Pemanfaatan teknologi informasi dalam pengelolaan data pangan terus ditingkatkan untuk mendukung pengambilan keputusan yang akurat.',
];

const UNSPLASH_BERITA = [
  'photo-1557804506-669a67965ba0','photo-1504754524776-8f4f37790ca0',
  'photo-1542838132-92c53300491e','photo-1609501676725-7186f150d4f5',
  'photo-1511690743698-d9d85f2fbf38','photo-1517842645767-c639042777db',
  'photo-1464226184884-fa280b87c399','photo-1506484381205-f7945653044d',
  'photo-1500651230702-0e2d8a49d4ad','photo-1574943320219-553eb213f72d',
  'photo-1530836369250-ef72a3f5cda8','photo-1467453678174-768ec8fc9d55',
  'photo-1591086429944-fafdc9e1c1cd','photo-1512621776951-a57141f2eefd',
  'photo-1598300042247-d088f8ab3a91','photo-1560493676-04071c5f467b',
];

// ── GENERATE BERITA (300) ────────────────────────────────────────────────────
function generateBerita(count = 300) {
  const data = [];
  for (let i = 1; i <= count; i++) {
    const d = rndDate(START, END);
    const imgId = pick(UNSPLASH_BERITA);
    data.push({
      id: i,
      title: `${pick(BERITA_TITLE_PREFIXES)} ${pick(BERITA_TITLE_BODIES)} ${rnd(2020, 2026)}`,
      excerpt: pick(BERITA_EXCERPTS),
      content: `<p>${pick(BERITA_EXCERPTS)}</p><p>${pick(BERITA_EXCERPTS)}</p><p>${pick(BERITA_EXCERPTS)}</p>`,
      image: `https://images.unsplash.com/${imgId}?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80`,
      date: fmtDate(d),
      category: pick(BERITA_CATEGORIES),
      author: pick(AUTHORS),
      status: rnd(0, 9) < 9 ? 'published' : 'draft',
      views: rnd(10, 2500),
      tags: pickMany(BERITA_TAGS_POOL, rnd(2, 5)),
      createdAt: d,
      updatedAt: d,
    });
  }
  return data;
}

// ── template: DOWNLOAD ───────────────────────────────────────────────────────
const DL_CATEGORIES = ['Laporan','Panduan','Data','Formulir','Peraturan','Pedoman','Statistik','Prosedur'];
const DL_FILETYPE   = ['PDF','XLSX','DOCX','PPTX','CSV'];
const DL_FILESIZES  = ['128 KB','245 KB','512 KB','860 KB','1.2 MB','1.8 MB','2.4 MB','3.0 MB','4.5 MB','6.1 MB'];
const DL_TITLE_MAP  = {
  'Laporan'  : ['Laporan Ketahanan Pangan','Laporan Kinerja Dinas Pangan','Laporan Distribusi Pangan','Laporan Neraca Bahan Makanan','Laporan Kegiatan Tahunan'],
  'Panduan'  : ['Panduan Teknis KRPL','Panduan Pelaksanaan LDPM','Panduan Program Diversifikasi Pangan','Panduan B2SA','Panduan Lumbung Pangan Masyarakat'],
  'Data'     : ['Data Produksi Padi','Data Harga Pangan Pokok','Data Ketersediaan Pangan','Data SKPG','Data Neraca Pangan'],
  'Formulir' : ['Formulir Permohonan Bantuan Benih','Formulir Registrasi Kelompok Tani','Formulir Pengajuan KRPL','Formulir Laporan Bulanan','Formulir Ceklist Monitoring'],
  'Peraturan': ['Peraturan Daerah Ketahanan Pangan','Peraturan Gubernur tentang Pangan','SK Kepala Dinas','Pergub Diversifikasi Pangan','Perda Distribusi Pangan'],
  'Pedoman'  : ['Pedoman Umum Program Demapan','Pedoman PDRP','Pedoman Sertifikasi Pangan','Pedoman Pengawasan Keamanan Pangan','Pedoman Cadangan Pangan'],
  'Statistik': ['Statistik Pertanian Sumatera Barat','Statistik Harga Komoditas','Statistik Produksi Tanaman Pangan','BPS Data Konsumsi Pangan','Statistik SKPG Provinsi'],
  'Prosedur' : ['SOP Distribusi Bantuan Pangan','SOP Sertifikasi Produk PSAT','SOP Monitoring Harga','SOP Verifikasi Data Pangan','Prosedur Pengaduan Layanan'],
};

function generateDownload(count = 200) {
  const data = [];
  for (let i = 1; i <= count; i++) {
    const d = rndDate(START, END);
    const cat = pick(DL_CATEGORIES);
    const titleBase = pick(DL_TITLE_MAP[cat]);
    const year = rnd(2018, 2026);
    const ft   = pick(DL_FILETYPE);
    const ext  = ft.toLowerCase();
    data.push({
      id: i,
      title: `${titleBase} ${year}`,
      description: `Dokumen resmi ${titleBase.toLowerCase()} yang diterbitkan oleh Dinas Pangan Provinsi Sumatera Barat untuk tahun ${year}.`,
      fileType: ft,
      fileSize: pick(DL_FILESIZES),
      uploadDate: fmtDate(d),
      category: cat,
      downloadCount: rnd(5, 800),
      fileName: `${titleBase.toLowerCase().replace(/\s+/g, '-')}-${year}.${ext}`,
      url: `/files/${titleBase.toLowerCase().replace(/\s+/g, '-')}-${year}.${ext}`,
      createdAt: d,
      updatedAt: d,
    });
  }
  return data;
}

// ── template: GALERI FOTO ────────────────────────────────────────────────────
const FOTO_ALBUMS = ['APN','KRPL','LDPM','Lumbung Pangan','Demapan','Festival Pangan','Monitoring','Workshop','Rapat Koordinasi','Bimtek','Sertifikasi','SKPG'];
const FOTO_TITLE_MAP = {
  'APN'             : ['Asesmen Pangan Nasional','Kegiatan APN','Dokumentasi APN','Pelaksanaan APN'],
  'KRPL'            : ['Penilaian KRPL','Launching KRPL','Monitoring KRPL','Workshop KRPL'],
  'LDPM'            : ['Launching LDPM','Pembinaan LDPM','Monitoring LDPM','Evaluasi LDPM'],
  'Lumbung Pangan'  : ['Pendirian Lumbung Pangan','Monitoring Lumbung Pangan','Bantuan Lumbung Pangan'],
  'Demapan'         : ['Kegiatan Demapan','Desa Mandiri Pangan','Peluncuran Demapan'],
  'Festival Pangan' : ['Festival Pangan Nusantara','BAPANAS Awards','Pameran Pangan Lokal'],
  'Monitoring'      : ['Monitoring Harga Pangan','Monitoring Stok Beras','Monitoring SPHP'],
  'Workshop'        : ['Workshop Keamanan Pangan','Workshop B2SA','Bimtek Pengolahan Pangan'],
  'Rapat Koordinasi': ['Rakor Ketahanan Pangan','Rakor TPID','Rakor Lintas Sektor'],
  'Bimtek'          : ['Bimtek Petani','Bimtek Pengolahan Hasil Tani','Bimtek Sertifikasi'],
  'Sertifikasi'     : ['Sertifikasi PSAT','Registrasi Produk Pangan','Uji Lab Pangan'],
  'SKPG'            : ['Pemantauan SKPG','Updating Data SKPG','Rapat Evaluasi SKPG'],
};
const UNSPLASH_FOTO = [
  'photo-1464226184884-fa280b87c399','photo-1506484381205-f7945653044d',
  'photo-1574943320219-553eb213f72d','photo-1530836369250-ef72a3f5cda8',
  'photo-1467453678174-768ec8fc9d55','photo-1591086429944-fafdc9e1c1cd',
  'photo-1512621776951-a57141f2eefd','photo-1598300042247-d088f8ab3a91',
  'photo-1560493676-04071c5f467b','photo-1500651230702-0e2d8a49d4ad',
];

function generateGaleriFoto(count = 200) {
  const data = [];
  for (let i = 1; i <= count; i++) {
    const d     = rndDate(START, END);
    const album = pick(FOTO_ALBUMS);
    const year  = d.getFullYear();
    const imgId = pick(UNSPLASH_FOTO);
    data.push({
      id: i,
      title: `${pick(FOTO_TITLE_MAP[album])} ${year}`,
      date: fmtWIB(d),
      author: pick(AUTHORS),
      views: `${rnd(20, 2500)} view`,
      image: `https://images.unsplash.com/${imgId}?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80`,
      description: `Dokumentasi kegiatan ${FOTO_TITLE_MAP[album][0].toLowerCase()} yang dilaksanakan di Provinsi Sumatera Barat pada tahun ${year}.`,
      album,
      createdAt: d,
      updatedAt: d,
    });
  }
  return data;
}

// ── template: GALERI VIDEO ────────────────────────────────────────────────────
const VIDEO_CATEGORIES = ['Sosialisasi','Liputan Kegiatan','Profil','Tutorial','Penghargaan','Berita TV'];
const YT_IDS = [
  'dQw4w9WgXcQ','jNQXAC9IVRw','9bZkp7q19f0','kXYiU_JCYtU',
  'OPf0YbXqDm0','Ct6BUPvE2sM','YQHsXMglC9A','60ItHLz5WEA',
  'fRh_vgS2dFE','HgzGwKwLmgM','VYOjWnS4cMY','0KSOMA3QBU0',
];
const VIDEO_TITLES = [
  'Profil Dinas Pangan Provinsi Sumatera Barat','Sosialisasi Program Ketahanan Pangan',
  'Liputan Festival Pangan Nusantara','Tutorial Budidaya Sayuran KRPL',
  'Penghargaan APN – Adhikarya Pangan Nusantara','Berita Perkembangan Harga Pangan',
  'Dokumentasi Kegiatan Monitoring Pangan','Penyerahan Bantuan Benih Padi Unggul',
  'Peluncuran Aplikasi Harga Pangan Online','Rapat Koordinasi Stabilisasi Pangan',
  'Profil UPTD BPSMP Sumatera Barat','Evaluasi Akhir Tahun Program Pangan',
  'Bimtek Pengolahan Hasil Pertanian','Gerakan Konsumsi B2SA',
  'Demplot Pertanian Organik Sumbar','Sertifikasi Produk Pangan Lokal',
  'Inovasi Penyimpanan Pascapanen','MoU Riset Ketahanan Pangan',
  'Sosialisasi Peraturan Pangan Daerah','Workshop Keamanan Pangan Bersama BPOM',
];
const DURATIONS = ['02:34','04:12','06:55','08:30','10:07','03:48','05:21','07:16','09:44','11:02','12:33','14:59'];

function generateGaleriVideo(count = 150) {
  const data = [];
  for (let i = 1; i <= count; i++) {
    const d   = rndDate(START, END);
    const ytId = pick(YT_IDS);
    data.push({
      id: i,
      title: `${pick(VIDEO_TITLES)} ${d.getFullYear()}`,
      date: fmtWIB(d),
      author: pick(AUTHORS),
      views: rnd(30, 5000),
      thumbnail: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
      youtubeUrl: `https://www.youtube.com/watch?v=${ytId}`,
      embedUrl: `https://www.youtube.com/embed/${ytId}`,
      duration: pick(DURATIONS),
      description: `Video dokumentasi kegiatan Dinas Pangan Provinsi Sumatera Barat – ${pick(VIDEO_CATEGORIES)} tahun ${d.getFullYear()}.`,
      category: pick(VIDEO_CATEGORIES),
      createdAt: d,
      updatedAt: d,
    });
  }
  return data;
}

// ── template: KEGIATAN ────────────────────────────────────────────────────────
const KEG_CATEGORIES = ['KRPL','LDPM','Demapan','Sertifikasi','SKPG','PDRP','Lumbung Pangan','Diversifikasi','B2SA','Monitoring'];
const KEG_STATUS     = ['upcoming','ongoing','completed'];
const KEG_TITLE_MAP  = {
  'KRPL'         : ['Pelatihan KRPL Kelompok Wanita Tani','Monitoring Kawasan Rumah Pangan Lestari','Lomba KRPL Terbaik','Bimtek KRPL Kabupaten'],
  'LDPM'         : ['Pembinaan LDPM Lumbung Desa','Monitoring LDPM','Evaluasi LDPM Akhir Tahun','Launching LDPM Baru'],
  'Demapan'      : ['Penetapan Desa Mandiri Pangan','Evaluasi Demapan','Workshop Demapan','Pelatihan Fasilitator Demapan'],
  'Sertifikasi'  : ['Registrasi Sertifikasi Produk PSAT','Uji Lab Keamanan Pangan','Penerbitan Sertifikat Pangan','Sosialisasi Sertifikasi'],
  'SKPG'         : ['Pemutakhiran Data SKPG','Rapat Evaluasi SKPG','Sosialisasi Sistem SKPG','Verifikasi Data Kerawanan Pangan'],
  'PDRP'         : ['Penyusunan PDRP','Implementasi PDRP','Evaluasi PDRP','Bimtek PDRP Kabupaten'],
  'Lumbung Pangan':['Pendirian Lumbung Pangan Baru','Pengisian Lumbung Pangan Masyarakat','Monitoring Lumbung Pangan','Pelatihan Pengelola Lumbung'],
  'Diversifikasi':['Gelar Pangan Lokal','Festival Kuliner Nusantara','Lomba Kreasi Pangan Lokal','Sosialisasi Diversifikasi Pangan'],
  'B2SA'         : ['Sosialisasi Gerakan B2SA','Demo Masak B2SA','Penilaian Kantin B2SA','Kampanye Pangan Bergizi'],
  'Monitoring'   : ['Inspeksi Harga Pasar','Monitoring Stok Beras','Pengecekan Kualitas Beras','Sidak Pasar Tradisional'],
};

function generateKegiatan(count = 150) {
  const data = [];
  for (let i = 1; i <= count; i++) {
    const d   = rndDate(START, END);
    const cat = pick(KEG_CATEGORIES);
    const imgId = pick(UNSPLASH_BERITA);
    data.push({
      id: i,
      title: `${pick(KEG_TITLE_MAP[cat])} ${d.getFullYear()}`,
      description: `Kegiatan ${KEG_TITLE_MAP[cat][0].toLowerCase()} yang dilaksanakan oleh Dinas Pangan Provinsi Sumatera Barat di ${pick(KABKOTA)} pada tahun ${d.getFullYear()}.`,
      date: fmtDate(d),
      location: `${pick(KABKOTA)}, Sumatera Barat`,
      organizer: 'Dinas Pangan Provinsi Sumatera Barat',
      status: pick(KEG_STATUS),
      category: cat,
      participants: rnd(15, 300),
      image: `https://images.unsplash.com/${imgId}?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80`,
      createdAt: d,
      updatedAt: d,
    });
  }
  return data;
}

// ── main ──────────────────────────────────────────────────────────────────────
async function main() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅  Terhubung ke MongoDB –', MONGODB_URI);

    const db = client.db(DB_NAME);
    console.log(`📦  Database : ${DB_NAME}\n`);

    // Hapus collection lama agar seed berjalan ulang dari awal
    const collections = ['berita','download','galeri_foto','galeri_video','kegiatan'];
    for (const col of collections) {
      await db.collection(col).drop().catch(() => {/* abaikan jika belum ada */});
    }

    // ── Berita (300) ──────────────────────────────────────────────────────────
    const beritaData = generateBerita(300);
    await db.collection('berita').insertMany(beritaData);
    // Index berguna untuk pencarian & paginasi
    await db.collection('berita').createIndex({ category: 1 });
    await db.collection('berita').createIndex({ date: -1 });
    await db.collection('berita').createIndex({ status: 1 });
    await db.collection('berita').createIndex({ title: 'text', excerpt: 'text' });
    console.log(`  📰  berita       : ${beritaData.length} dokumen`);

    // ── Download (200) ────────────────────────────────────────────────────────
    const dlData = generateDownload(200);
    await db.collection('download').insertMany(dlData);
    await db.collection('download').createIndex({ category: 1 });
    await db.collection('download').createIndex({ uploadDate: -1 });
    await db.collection('download').createIndex({ title: 'text', description: 'text' });
    console.log(`  📥  download     : ${dlData.length} dokumen`);

    // ── Galeri Foto (200) ─────────────────────────────────────────────────────
    const fotoData = generateGaleriFoto(200);
    await db.collection('galeri_foto').insertMany(fotoData);
    await db.collection('galeri_foto').createIndex({ album: 1 });
    await db.collection('galeri_foto').createIndex({ createdAt: -1 });
    console.log(`  🖼️   galeri_foto  : ${fotoData.length} dokumen`);

    // ── Galeri Video (150) ────────────────────────────────────────────────────
    const videoData = generateGaleriVideo(150);
    await db.collection('galeri_video').insertMany(videoData);
    await db.collection('galeri_video').createIndex({ category: 1 });
    await db.collection('galeri_video').createIndex({ createdAt: -1 });
    console.log(`  🎬  galeri_video : ${videoData.length} dokumen`);

    // ── Kegiatan (150) ────────────────────────────────────────────────────────
    const kegData = generateKegiatan(150);
    await db.collection('kegiatan').insertMany(kegData);
    await db.collection('kegiatan').createIndex({ category: 1 });
    await db.collection('kegiatan').createIndex({ status: 1 });
    await db.collection('kegiatan').createIndex({ date: -1 });
    console.log(`  📅  kegiatan     : ${kegData.length} dokumen`);

    const total = beritaData.length + dlData.length + fotoData.length + videoData.length + kegData.length;
    console.log(`\n✅  Selesai! Total ${total} data berhasil dimasukkan ke "${DB_NAME}"`);

  } catch (err) {
    console.error('❌  Error:', err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
