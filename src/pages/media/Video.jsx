import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Breadcrumb from "../../components/Breadcrumb";
import { useState, useEffect } from "react";

function Video() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // State dari API
  const [videoItems, setVideoItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ page: currentPage, limit: itemsPerPage });
        const res  = await fetch(`/api/galeri-video?${params}`);
        if (!res.ok) throw new Error('Gagal mengambil data galeri video');
        const json = await res.json();
        setVideoItems(json.data);
        setTotalPages(json.pagination.totalPages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [currentPage]);

  // Data untuk halaman saat ini sudah dipaginasi dari API
  const currentItems = videoItems;

  // Fungsi untuk mengubah halaman
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fungsi untuk halaman berikutnya
  const nextPage = () => {
    if (currentPage < totalPages) {
      paginate(currentPage + 1);
    }
  };

  // Fungsi untuk halaman sebelumnya
  const prevPage = () => {
    if (currentPage > 1) {
      paginate(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Breadcrumb />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">Index Video</h1>
          <div className="w-24 h-1 bg-red-600 mx-auto mb-6"></div>
          <p className="text-gray-600 text-center max-w-2xl mx-auto">
            Koleksi video dokumentasi kegiatan dan program-program Dinas Pangan Provinsi Sumatera Barat.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-5 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium">⚠️ {error}</p>
            <p className="text-red-500 text-sm mt-1">Pastikan server API sudah berjalan di port 3000</p>
          </div>
        )}

        {/* Video Grid */}
        {!loading && !error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Video Thumbnail */}
              <div className="relative h-48 bg-gray-200 flex items-center justify-center">
                <div className="w-16 h-16 bg-gray-400 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                  {item.views}
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="text-xs text-gray-500 mb-2">
                  {item.date}
                </div>
                
                <h3 className="text-lg font-bold text-gray-800 mb-3 hover:text-red-600 cursor-pointer line-clamp-2">
                  {item.title}
                </h3>
                
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                  {item.description}
                </p>
                
                {/* Read More Button */}
                <div className="flex justify-end">
                  <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
                    READ MORE
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <nav className="flex items-center space-x-1">
            <button 
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`px-3 py-2 ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-gray-700 cursor-pointer'}`}
              title="Halaman sebelumnya"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;
              const isCurrentPage = pageNumber === currentPage;
              
              const showPage = 
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2);
              
              if (!showPage) {
                if (pageNumber === currentPage - 3 || pageNumber === currentPage + 3) {
                  return (
                    <span key={pageNumber} className="px-2 py-2 text-gray-500">
                      …
                    </span>
                  );
                }
                return null;
              }

              return (
                <button
                  key={pageNumber}
                  onClick={() => paginate(pageNumber)}
                  className={`px-3 py-2 rounded font-medium ${
                    isCurrentPage
                      ? 'bg-red-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
            
            <button 
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-gray-700 cursor-pointer'}`}
              title="Halaman berikutnya"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </nav>
        </div>
        )}
      </div>    
      <Footer />
    </div>
  );
}

export default Video;
