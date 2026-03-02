import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../../components/Navbar"
// Fixed navigation links to prevent 404 errors
import Footer from "../../components/Footer"
import QuickSearch from "../../components/QuickSearch"
import { BeritaList } from "../../data/BeritaSection"
function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [    
    {
      id: 1,
  image: "/slide1.png", 
  title: "",
  // description: "Program inovatif untuk meningkatkan ketersediaan, distribusi, dan kualitas pangan"
    },
    {
      id: 2,
  image: "/slide2.png",
  title: "",
  // description: "Mewujudkan ketahanan pangan yang berkelanjutan, aman, dan bergizi untuk masyarakat"
    },    
  ];

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Slider Section */}
      <section className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
        <div className="relative w-full h-full">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              {slide.title && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end">
                  <div className="w-full p-3 sm:p-5 md:p-8">
                    <div className="max-w-5xl mx-auto text-center text-white">
                      <h1 className="text-base sm:text-2xl md:text-4xl lg:text-5xl font-extrabold drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
                        {slide.title}
                      </h1>
                      {slide.description && (
                        <p className="text-xs sm:text-sm md:text-lg lg:text-xl drop-shadow-md mt-2 md:mt-4 opacity-95">
                          {slide.description}
                        </p>
                      )}
                      <div className="mt-3 md:mt-6 flex items-center justify-center gap-3">
                        <Link to="/profil/sekapur-sirih" className="px-3 py-2 md:px-5 md:py-3 bg-footer text-white rounded-lg text-xs md:text-sm font-semibold hover:opacity-90 transition">
                          Lihat Profil
                        </Link>
                        <Link to="/profil/hubungi-kami" className="px-3 py-2 md:px-5 md:py-3 bg-white/10 border border-white/30 text-white rounded-lg text-xs md:text-sm font-semibold hover:bg-white/20 transition">
                          Kontak Kami
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-1 sm:left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-1.5 sm:p-2 md:p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        >
          <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-1 sm:right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-1.5 sm:p-2 md:p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        >
          <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-1 sm:bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1.5 sm:space-x-2 md:space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 border border-white ${
                index === currentSlide 
                  ? 'bg-white' 
                  : 'bg-transparent hover:bg-white hover:bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </section>
      
      {/* Quick Search Section */}
      <QuickSearch />
      
      {/* Profil Singkat & Layanan Kami */}
      <section className="bg-white py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Profil Singkat */}
            <div className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">Profil Singkat</h2>
              <p className="text-gray-700 leading-relaxed mb-5">
                Dinas Pangan Provinsi Sumatera Barat berkomitmen mewujudkan ketahanan pangan
                yang berkelanjutan dan gizi seimbang untuk masyarakat. Kami menjalankan program
                strategis mulai dari ketersediaan, distribusi, hingga keamanan pangan.
              </p>
              <Link to="/profil/sekapur-sirih" className="inline-flex items-center gap-2 px-5 py-3 bg-footer text-white rounded-lg font-semibold hover:opacity-95 transition">
                Lihat Profile
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
              </Link>
            </div>

            {/* Layanan Kami */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-5">Layanan Kami</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link to="/informasi/info-pengadaan" className="group border border-gray-200 rounded-lg p-5 hover:shadow-md transition bg-gradient-to-br from-green-50 to-white">
                  <div className="text-green-700 text-2xl mb-2">📄</div>
                  <div className="font-semibold text-gray-900 mb-1">Info Pengadaan</div>
                  <div className="text-sm text-gray-600">Informasi pengadaan barang dan jasa</div>
                </Link>
                <Link to="/informasi/laporan-kinerja" className="group border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
                  <div className="text-blue-700 text-2xl mb-2">📊</div>
                  <div className="font-semibold text-gray-900 mb-1">Laporan Kinerja</div>
                  <div className="text-sm text-gray-600">Capaian kinerja dinas secara berkala</div>
                </Link>
                <Link to="/media/kegiatan" className="group border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
                  <div className="text-orange-700 text-2xl mb-2">🖼️</div>
                  <div className="font-semibold text-gray-900 mb-1">Galeri Kegiatan</div>
                  <div className="text-sm text-gray-600">Dokumentasi foto dan video kegiatan</div>
                </Link>
                <Link to="/profil/hubungi-kami" className="group border border-gray-200 rounded-lg p-5 hover:shadow-md transition bg-gradient-to-br from-green-50 to-white">
                  <div className="text-red-700 text-2xl mb-2">📞</div>
                  <div className="font-semibold text-gray-900 mb-1">Hubungi Kami</div>
                  <div className="text-sm text-gray-600">Informasi kontak dan alamat</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section - Berita dan Sidebar */}
      <section className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Content - Berita Utama */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2 text-footer pb-2 border-b-2 border-footer">
                  Berita Utama
                </h2>
              </div>
              
              {/* Grid Berita */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {BeritaList.slice(0, 6).map((berita, index) => {
                  // Determine fallback image based on content
                  const getFallbackImage = (title) => {
                    if (title.toLowerCase().includes('rapat') || title.toLowerCase().includes('koordinasi')) {
                      return 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'; // meeting
                    } else if (title.toLowerCase().includes('festival') || title.toLowerCase().includes('pangan')) {
                      return 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'; // food
                    } else if (title.toLowerCase().includes('penghargaan') || title.toLowerCase().includes('award')) {
                      return 'https://images.unsplash.com/photo-1599493758267-c6c884c7071f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'; // award
                    } else if (title.toLowerCase().includes('workshop') || title.toLowerCase().includes('pelatihan')) {
                      return 'https://images.unsplash.com/photo-1531538606174-0f90ff5ffe66?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'; // workshop
                    } else if (title.toLowerCase().includes('sertifikasi') || title.toLowerCase().includes('registrasi')) {
                      return 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'; // documents
                    } else {
                      return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'; // general news
                    }
                  };

                  const fallbackImage = getFallbackImage(berita.title);

                  return (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div
                      className="h-40 bg-gray-100 relative"
                      role="img"
                      aria-label={berita.title}
                      style={{
                        backgroundImage: berita.image ? `url(${berita.image})` : `url(${fallbackImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                      }}
                    >
                      {/* Backup img element untuk mendeteksi error */}
                      <img
                        src={berita.image || fallbackImage}
                        alt={berita.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-0"
                        onError={(e) => {
                          // Ubah background parent jika image gagal load
                          const parent = e.currentTarget.parentElement;
                          parent.style.backgroundImage = `url(${fallbackImage})`;
                          parent.style.backgroundSize = 'cover';
                          parent.style.backgroundColor = '#f3f4f6';
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                        {berita.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                        {berita.excerpt}
                      </p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{berita.date}</span>
                        <span className="bg-blue-500 text-white px-2 py-1 rounded">
                          {berita.category}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">                           
              {/* Pengumuman */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
                <div className="bg-footer text-white p-3">
                  <h3 className="font-semibold">Pengumuman</h3>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    <div className="text-sm">
                      <p className="text-gray-700 mb-1">Agenda Kegiatan</p>
                      <p className="text-xs text-gray-500">Informasi terkini mengenai kegiatan dinas</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-700 mb-1">Pengumuman Pengadaan</p>
                      <p className="text-xs text-gray-500">Info pengadaan barang dan jasa</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-700 mb-1">Info Penting Lainnya</p>
                      <p className="text-xs text-gray-500">Informasi penting untuk masyarakat</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Agenda */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-footer text-white p-3">
                  <h3 className="font-semibold">Agenda</h3>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    <div className="text-sm">
                      <p className="text-gray-700 mb-1">Rapat Koordinasi Pangan</p>
                      <p className="text-xs text-blue-500">28 | Jul | 2025</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-700 mb-1">Sosialisasi Keamanan Pangan</p>
                      <p className="text-xs text-blue-500">30 | Jul | 2025</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-700 mb-1">Monitoring Distribusi Pangan</p>
                      <p className="text-xs text-blue-500">02 | Aug | 2025</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Additional Content Sections (tetap ada) */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* RESEP PANGAN LOKAL */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-footer text-white p-4">
                <h2 className="text-xl font-bold text-white">Resep Pangan Lokal</h2>
              </div>
              <div className="p-6">
                {/* Featured Recipe */}
                <div className="mb-6">
                  <div className="h-40 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center text-orange-800">
                      <div className="text-4xl mb-2">🍽️</div>
                      <div className="text-sm font-semibold">Bingka Kentang</div>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Bingka Kentang</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Bahan: 3 Butir Telur Bebek 1 Sdm Mentega Untuk Olesan Aduk Rata. 75 G Tepung Terigu Berprotein Sedang, Ayak 300 G Kentang, Rebus, Kupas, Haluskan 75 G Gula Pasir...
                  </p>
                </div>
                
                {/* Recipe List */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                    <div className="w-12 h-12 bg-yellow-100 rounded flex items-center justify-center">
                      🥞
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">Pancake Kentang</p>
                      <p className="text-xs text-gray-500">17 Juni 2015 • Berita • 6,928 views</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                    <div className="w-12 h-12 bg-green-100 rounded flex items-center justify-center">
                      🍜
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">Resep Kue Talam</p>
                      <p className="text-xs text-gray-500">02 April 2015 • Berita • 102,767 views</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                    <div className="w-12 h-12 bg-purple-100 rounded flex items-center justify-center">
                      🧁
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">Kue Lumpur Ubi Ungu</p>
                      <p className="text-xs text-gray-500">30 Maret 2015 • Berita • 13,728 views</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ARTIKEL */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-footer text-white p-4">
                <h2 className="text-xl font-bold text-white">Artikel</h2>
              </div>
              <div className="p-6">
                <div className="h-40 bg-gradient-to-br from-orange-200 to-red-300 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center text-white">
                    <div className="text-6xl mb-2">📄</div>
                    <div className="text-sm font-semibold">Artikel Terbaru</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="border-b border-gray-200 pb-3">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Revisi Renstra Dinas Pangan Prov. Sumbar Tahun 2016-2021
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">Berita • 04 Februari 2022 17:24:15 WIB • 1,951 views</p>
                  </div>
                  
                  <div className="border-b border-gray-200 pb-3">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Laporan Kinerja Dinas Pangan Provinsi Sumatera Barat Tahun 2021
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">Berita • 04 Februari 2022 17:24:15 WIB • 1,951 views</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Panduan Keamanan Pangan untuk Masyarakat
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">Berita • 15 Januari 2022 10:30:00 WIB • 2,543 views</p>
                  </div>
                </div>
              </div>
            </div>

            {/* INFORMASI HARGA PANGAN */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-footer text-white p-4">
                <h2 className="text-xl font-bold text-white">Informasi Harga Pangan</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">
                      Daftar Harga Pangan di Titik (Dinas Pangan Sumbar) Tanggal 24 Mei 2018
                    </h3>
                    <p className="text-xs text-blue-600 mb-2">24 Mei 2018 13:14:39 WIB • Berita • 3,618 views</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">
                      Panen, Harga Beras Tetap Tinggi
                    </h3>
                    <p className="text-xs text-green-600 mb-2">24 April 2018 09:54:08 WIB • Berita • 3,845 views</p>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-yellow-800 mb-2">
                      Info Harga Komoditas Pangan Harian
                    </h3>
                    <p className="text-xs text-yellow-600 mb-2">Update setiap hari • Live Data</p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-800 mb-2">
                      Monitoring Harga Pangan Strategis
                    </h3>
                    <p className="text-xs text-purple-600 mb-2">Laporan mingguan • Data Terkini</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>          
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Home
