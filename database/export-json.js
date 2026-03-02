/**
 * export-json.js
 * Generate 1000 data dummy dan simpan sebagai file JSON
 * Tanpa perlu koneksi MongoDB – bisa diimport dengan mongoimport
 *
 * Cara pakai:
 *   node export-json.js
 *   (Menghasilkan folder ./json-export/*.json)
 */

const fs   = require('fs');
const path = require('path');

// ── helpers ──────────────────────────────────────────────────────────────────
const rnd      = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick     = (arr)      => arr[Math.floor(Math.random() * arr.length)];
const pickMany = (arr, n)   => [...arr].sort(() => 0.5 - Math.random()).slice(0, n);
const rndDate  = (start, end) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const pad      = (n)  => String(n).padStart(2, '0');
const fmtDate  = (d)  =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fmtWIB   = (d)  =>
  `${pad(d.getDate())} ${BULAN_IND[d.getMonth()]} ${d.getFullYear()} ` +
  `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} WIB`;

const BULAN_IND = [
  'Januari','Februari','Maret','April','Mei','Juni',
  'Juli','Agustus','September','Oktober','November','Desember'
];
const START = new Date('2020-01-01');
const END   = new Date('2026-02-28');

// ── template pools ────────────────────────────────────────────────────────────
const KABKOTA = [
  'Padang','Bukittinggi','Solok','Padang Panjang','Sawahlunto',
  'Payakumbuh','Pariaman','Agam','Tanah Datar','Pesisir Selatan',
  'Sijunjung','Pasaman','Lima Puluh Kota','Dharmasraya','Solok Selatan',
  'Pasaman Barat','Kepulauan Mentawai','Padang Pariaman',
];
const AUTHORS = [
  'Admin Dinas Pangan','administrator','administrator2','administrator3',
  'Humas Dinas Pangan','Redaksi PKL','Bidang Ketersediaan','Bidang Distribusi',
  'Bidang Konsumsi','Sekretariat','UPTD BPSMP',
];
const UNSPLASH_BERITA = [
  'photo-1557804506-669a67965ba0','photo-1504754524776-8f4f37790ca0',
  'photo-1542838132-92c53300491e','photo-1609501676725-7186f150d4f5',
  'photo-1511690743698-d9d85f2fbf38','photo-1517842645767-c639042777db',
  'photo-1464226184884-fa280b87c399','photo-1574943320219-553eb213f72d',
  'photo-1530836369250-ef72a3f5cda8','photo-1467453678174-768ec8fc9d55',
  'photo-1591086429944-fafdc9e1c1cd','photo-1560493676-04071c5f467b',
];
const UNSPLASH_FOTO = [
  'photo-1500651230702-0e2d8a49d4ad','photo-1512621776951-a57141f2eefd',
  'photo-1598300042247-d088f8ab3a91','photo-1506484381205-f7945653044d',
];

// ── BERITA ────────────────────────────────────────────────────────────────────
const BERITA_CATS     = ['Program','Kegiatan','Prestasi','Workshop','Inovasi','Berita','Pengumuman','Informasi'];
const BERITA_TAGS     = ['ketahanan pangan','pangan lokal','pertanian','B2SA','KRPL','LDPM','harga pangan','distribusi','sertifikasi','keamanan pangan','stunting','Sumbar','BAPANAS','Bulog','bantuan benih','produksi padi','cadangan pangan','SKPG','Demapan','lumbung pangan','diversifikasi'];
const BERITA_PREFIXES = ['Dinas Pangan Sumbar','Pemerintah Provinsi Sumatera Barat','Badan Pangan Nasional','Tim Ketahanan Pangan','UPTD BPSMP Sumbar','Bidang Distribusi Pangan','Bidang Ketersediaan Pangan','Bidang Konsumsi Pangan'];
const BERITA_BODIES   = [
  'Gelar Sosialisasi Program Ketahanan Pangan','Melaksanakan Rapat Optimalisasi Realisasi Kegiatan',
  'Raih Penghargaan Stabilisasi Pasokan dan Harga Pangan','Luncurkan Program Kawasan Rumah Pangan Lestari',
  'Adakan Workshop Diversifikasi Pangan Lokal','Distribusikan Bantuan Benih Padi Unggulan kepada Petani',
  'Monitoring Stok Beras di Gudang Bulog','Selenggarakan Festival Pangan Nusantara',
  'Evaluasi Capaian Program Lumbung Pangan','Tingkatkan Kapasitas SDM melalui Bimbingan Teknis',
  'Koordinasi Lintas Sektor dalam Stabilisasi Harga Pangan','Berhasil Turunkan Angka Kerawanan Pangan',
  'Publikasikan Neraca Pangan Provinsi Sumatera Barat','Dorong Konsumsi Pangan B2SA di Masyarakat',
  'Verifikasi Data Cadangan Pangan Masyarakat','Implementasikan Sistem Informasi Harga Pangan Online',
  'Kembangkan Demplot Pertanian Organik','Pantau Perkembangan Harga Komoditas Pangan Strategis',
  'Edukasi Masyarakat tentang Keamanan Pangan','Sertifikasi Produk Pangan Olahan Lokal',
  'Adakan Pelatihan Pengolahan Hasil Pertanian','Rakor Penanganan Kerawanan Pangan Daerah Terpencil',
  'Apresiasi Kelompok Tani Berprestasi Tingkat Provinsi','Dorong Pengembangan Pangan Fungsional Berbasis Lokal',
  'Lakukan Uji Mutu Beras di Pasar Tradisional','Fasilitasi Akses Pembiayaan untuk Usaha Pangan Lokal',
  'Launching Aplikasi Pemantauan Harga Pangan Real-Time','Rapat Koordinasi TPID Bahas Stabilisasi Pangan',
];
const BERITA_EXCERPTS = [
  'Program ini bertujuan untuk meningkatkan ketahanan pangan di Provinsi Sumatera Barat secara berkelanjutan melalui pendekatan partisipatif masyarakat.',
  'Kegiatan tersebut dihadiri oleh perwakilan dari 18 kabupaten/kota di Sumatera Barat untuk membahas berbagai isu terkait pangan.',
  'Dinas Pangan terus berupaya menjaga stabilitas ketersediaan pangan di tengah berbagai tantangan iklim dan dinamika pasar global.',
  'Melalui program ini, diharapkan masyarakat dapat memenuhi kebutuhan pangan secara mandiri dan berkelanjutan.',
  'Pencapaian ini merupakan hasil kerja keras seluruh jajaran Dinas Pangan bersama masyarakat dan pemangku kepentingan di Sumatera Barat.',
  'Inovasi dalam bidang pangan terus dikembangkan untuk mendukung ketahanan pangan nasional sesuai arahan Pemerintah Pusat.',
  'Kegiatan monitoring rutin dilaksanakan untuk memastikan pasokan pangan mencukupi, terutama menjelang hari-hari besar.',
  'Petani dan kelompok tani diberikan pendampingan intensif untuk meningkatkan produktivitas dan kualitas hasil pertanian.',
  'Harga komoditas pangan pokok dipantau secara berkala guna mencegah terjadinya gejolak harga yang merugikan konsumen dan petani.',
  'Workshop ini menghadirkan narasumber berpengalaman di bidang ketahanan pangan untuk berbagi pengetahuan terbaik.',
  'Program bantuan benih unggul disalurkan kepada ribuan petani di seluruh kabupaten/kota Sumatera Barat.',
  'Koordinasi intensif dilakukan bersama pemerintah kabupaten/kota, Bulog, dan asosiasi petani untuk menjaga kestabilan harga.',
  'Gerakan konsumsi pangan B2SA terus digalakkan sebagai upaya peningkatan gizi masyarakat dan pencegahan stunting.',
  'Sertifikasi produk pangan lokal menjadi langkah penting untuk meningkatkan daya saing komoditas Sumatera Barat.',
  'Pemanfaatan teknologi informasi dalam pengelolaan data pangan terus ditingkatkan untuk mendukung pengambilan keputusan.',
];

function generateBerita(count) {
  return Array.from({ length: count }, (_, idx) => {
    const d = rndDate(START, END);
    const imgId = pick(UNSPLASH_BERITA);
    return {
      id: idx + 1,
      title: `${pick(BERITA_PREFIXES)} ${pick(BERITA_BODIES)} ${rnd(2020, 2026)}`,
      excerpt: pick(BERITA_EXCERPTS),
      content: `<p>${pick(BERITA_EXCERPTS)}</p><p>${pick(BERITA_EXCERPTS)}</p>`,
      image: `https://images.unsplash.com/${imgId}?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80`,
      date: fmtDate(d),
      category: pick(BERITA_CATS),
      author: pick(AUTHORS),
      status: rnd(0, 9) < 9 ? 'published' : 'draft',
      views: rnd(10, 2500),
      tags: pickMany(BERITA_TAGS, rnd(2, 5)),
      createdAt: d.toISOString(),
      updatedAt: d.toISOString(),
    };
  });
}

// ── DOWNLOAD ──────────────────────────────────────────────────────────────────
const DL_CATS     = ['Laporan','Panduan','Data','Formulir','Peraturan','Pedoman','Statistik','Prosedur'];
const DL_FILETYPES = ['PDF','XLSX','DOCX','PPTX','CSV'];
const DL_FILESIZES = ['128 KB','245 KB','512 KB','860 KB','1.2 MB','1.8 MB','2.4 MB','3.0 MB','4.5 MB'];
const DL_TITLE_MAP = {
  'Laporan'  : ['Laporan Ketahanan Pangan','Laporan Kinerja Dinas Pangan','Laporan Distribusi Pangan','Laporan Neraca Bahan Makanan'],
  'Panduan'  : ['Panduan Teknis KRPL','Panduan Pelaksanaan LDPM','Panduan Program Diversifikasi Pangan','Panduan B2SA'],
  'Data'     : ['Data Produksi Padi','Data Harga Pangan Pokok','Data Ketersediaan Pangan','Data SKPG','Data Neraca Pangan'],
  'Formulir' : ['Formulir Permohonan Bantuan Benih','Formulir Registrasi Kelompok Tani','Formulir Pengajuan KRPL'],
  'Peraturan': ['Peraturan Daerah Ketahanan Pangan','Peraturan Gubernur tentang Pangan','SK Kepala Dinas','Pergub Diversifikasi Pangan'],
  'Pedoman'  : ['Pedoman Umum Program Demapan','Pedoman PDRP','Pedoman Sertifikasi Pangan','Pedoman Pengawasan Keamanan Pangan'],
  'Statistik': ['Statistik Pertanian Sumatera Barat','Statistik Harga Komoditas','Statistik Produksi Tanaman Pangan'],
  'Prosedur' : ['SOP Distribusi Bantuan Pangan','SOP Sertifikasi Produk PSAT','SOP Monitoring Harga','Prosedur Pengaduan Layanan'],
};

function generateDownload(count) {
  return Array.from({ length: count }, (_, idx) => {
    const d   = rndDate(START, END);
    const cat = pick(DL_CATS);
    const titleBase = pick(DL_TITLE_MAP[cat]);
    const year = rnd(2018, 2026);
    const ft   = pick(DL_FILETYPES);
    const ext  = ft.toLowerCase();
    return {
      id: idx + 1,
      title: `${titleBase} ${year}`,
      description: `Dokumen resmi ${titleBase.toLowerCase()} yang diterbitkan oleh Dinas Pangan Provinsi Sumatera Barat untuk tahun ${year}.`,
      fileType: ft,
      fileSize: pick(DL_FILESIZES),
      uploadDate: fmtDate(d),
      category: cat,
      downloadCount: rnd(5, 800),
      fileName: `${titleBase.toLowerCase().replace(/\s+/g, '-')}-${year}.${ext}`,
      url: `/files/${titleBase.toLowerCase().replace(/\s+/g, '-')}-${year}.${ext}`,
      createdAt: d.toISOString(),
      updatedAt: d.toISOString(),
    };
  });
}

// ── GALERI FOTO ───────────────────────────────────────────────────────────────
const FOTO_ALBUMS   = ['APN','KRPL','LDPM','Lumbung Pangan','Demapan','Festival Pangan','Monitoring','Workshop','Rapat Koordinasi','Bimtek','Sertifikasi','SKPG'];
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

function generateGaleriFoto(count) {
  return Array.from({ length: count }, (_, idx) => {
    const d     = rndDate(START, END);
    const album = pick(FOTO_ALBUMS);
    const imgId = pick(UNSPLASH_FOTO.concat(UNSPLASH_BERITA));
    return {
      id: idx + 1,
      title: `${pick(FOTO_TITLE_MAP[album])} ${d.getFullYear()}`,
      date: fmtWIB(d),
      author: pick(AUTHORS),
      views: `${rnd(20, 2500)} view`,
      image: `https://images.unsplash.com/${imgId}?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80`,
      description: `Dokumentasi kegiatan ${FOTO_TITLE_MAP[album][0].toLowerCase()} yang dilaksanakan di Provinsi Sumatera Barat pada tahun ${d.getFullYear()}.`,
      album,
      createdAt: d.toISOString(),
      updatedAt: d.toISOString(),
    };
  });
}

// ── GALERI VIDEO ──────────────────────────────────────────────────────────────
const VIDEO_CATS  = ['Sosialisasi','Liputan Kegiatan','Profil','Tutorial','Penghargaan','Berita TV'];
const YT_IDS      = ['dQw4w9WgXcQ','jNQXAC9IVRw','9bZkp7q19f0','kXYiU_JCYtU','OPf0YbXqDm0','Ct6BUPvE2sM','YQHsXMglC9A','60ItHLz5WEA','fRh_vgS2dFE','HgzGwKwLmgM','VYOjWnS4cMY','0KSOMA3QBU0'];
const DURATIONS   = ['02:34','04:12','06:55','08:30','10:07','03:48','05:21','07:16','09:44','11:02','12:33','14:59'];
const VIDEO_TITLES = [
  'Profil Dinas Pangan Provinsi Sumatera Barat','Sosialisasi Program Ketahanan Pangan',
  'Liputan Festival Pangan Nusantara','Tutorial Budidaya Sayuran KRPL',
  'Penghargaan Adhikarya Pangan Nusantara','Berita Perkembangan Harga Pangan',
  'Dokumentasi Kegiatan Monitoring','Penyerahan Bantuan Benih Padi Unggul',
  'Launching Aplikasi Harga Pangan Online','Rapat Koordinasi Stabilisasi Pangan',
  'Profil UPTD BPSMP Sumatera Barat','Evaluasi Akhir Tahun Program Pangan',
  'Bimtek Pengolahan Hasil Pertanian','Gerakan Konsumsi B2SA',
  'Demplot Pertanian Organik Sumbar','Sertifikasi Produk Pangan Lokal',
  'Inovasi Penyimpanan Pascapanen','Sosialisasi Peraturan Pangan Daerah',
  'Workshop Keamanan Pangan','MoU Riset Ketahanan Pangan',
];

function generateGaleriVideo(count) {
  return Array.from({ length: count }, (_, idx) => {
    const d   = rndDate(START, END);
    const ytId = pick(YT_IDS);
    return {
      id: idx + 1,
      title: `${pick(VIDEO_TITLES)} ${d.getFullYear()}`,
      date: fmtWIB(d),
      author: pick(AUTHORS),
      views: rnd(30, 5000),
      thumbnail: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
      youtubeUrl: `https://www.youtube.com/watch?v=${ytId}`,
      embedUrl: `https://www.youtube.com/embed/${ytId}`,
      duration: pick(DURATIONS),
      description: `Video dokumentasi kegiatan Dinas Pangan Provinsi Sumatera Barat – ${pick(VIDEO_CATS)} tahun ${d.getFullYear()}.`,
      category: pick(VIDEO_CATS),
      createdAt: d.toISOString(),
      updatedAt: d.toISOString(),
    };
  });
}

// ── KEGIATAN ──────────────────────────────────────────────────────────────────
const KEG_CATS    = ['KRPL','LDPM','Demapan','Sertifikasi','SKPG','PDRP','Lumbung Pangan','Diversifikasi','B2SA','Monitoring'];
const KEG_STATUS  = ['upcoming','ongoing','completed'];
const KEG_TITLE_MAP = {
  'KRPL'          : ['Pelatihan KRPL Kelompok Wanita Tani','Monitoring KRPL','Lomba KRPL Terbaik','Bimtek KRPL Kabupaten'],
  'LDPM'          : ['Pembinaan LDPM Lumbung Desa','Monitoring LDPM','Evaluasi LDPM Akhir Tahun','Launching LDPM Baru'],
  'Demapan'       : ['Penetapan Desa Mandiri Pangan','Evaluasi Demapan','Workshop Demapan','Pelatihan Fasilitator Demapan'],
  'Sertifikasi'   : ['Registrasi Sertifikasi Produk PSAT','Uji Lab Keamanan Pangan','Penerbitan Sertifikat Pangan'],
  'SKPG'          : ['Pemutakhiran Data SKPG','Rapat Evaluasi SKPG','Sosialisasi Sistem SKPG'],
  'PDRP'          : ['Penyusunan PDRP','Implementasi PDRP','Evaluasi PDRP','Bimtek PDRP Kabupaten'],
  'Lumbung Pangan': ['Pendirian Lumbung Pangan Baru','Pengisian Lumbung Pangan Masyarakat','Monitoring Lumbung Pangan'],
  'Diversifikasi' : ['Gelar Pangan Lokal','Festival Kuliner Nusantara','Lomba Kreasi Pangan Lokal'],
  'B2SA'          : ['Sosialisasi Gerakan B2SA','Demo Masak B2SA','Penilaian Kantin B2SA','Kampanye Pangan Bergizi'],
  'Monitoring'    : ['Inspeksi Harga Pasar','Monitoring Stok Beras','Pengecekan Kualitas Beras','Sidak Pasar Tradisional'],
};

function generateKegiatan(count) {
  return Array.from({ length: count }, (_, idx) => {
    const d   = rndDate(START, END);
    const cat = pick(KEG_CATS);
    const imgId = pick(UNSPLASH_BERITA);
    return {
      id: idx + 1,
      title: `${pick(KEG_TITLE_MAP[cat])} ${d.getFullYear()}`,
      description: `Kegiatan yang dilaksanakan oleh Dinas Pangan Provinsi Sumatera Barat di ${pick(KABKOTA)} pada tahun ${d.getFullYear()}.`,
      date: fmtDate(d),
      location: `${pick(KABKOTA)}, Sumatera Barat`,
      organizer: 'Dinas Pangan Provinsi Sumatera Barat',
      status: pick(KEG_STATUS),
      category: cat,
      participants: rnd(15, 300),
      image: `https://images.unsplash.com/${imgId}?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80`,
      createdAt: d.toISOString(),
      updatedAt: d.toISOString(),
    };
  });
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
const OUT_DIR = path.join(__dirname, 'json-export');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const collections = {
  berita      : generateBerita(300),
  download    : generateDownload(200),
  galeri_foto : generateGaleriFoto(200),
  galeri_video: generateGaleriVideo(150),
  kegiatan    : generateKegiatan(150),
};

let total = 0;
for (const [name, data] of Object.entries(collections)) {
  const filePath = path.join(OUT_DIR, `${name}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`  ✅  ${name.padEnd(14)} : ${data.length} dokumen → ${filePath}`);
  total += data.length;
}
console.log(`\n🎉  Total ${total} data berhasil diekspor ke folder ./json-export/`);
console.log('\nImport ke MongoDB dengan perintah:');
for (const name of Object.keys(collections)) {
  console.log(`  mongoimport --uri "mongodb://localhost:27017" --db dinas_pangan_sumbar --collection ${name} --file json-export/${name}.json --jsonArray`);
}
