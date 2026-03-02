import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Breadcrumb from "../../components/Breadcrumb";
import { useState, useEffect } from "react";

function Foto() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // State dari API
  const [galleryItems, setGalleryItems] = useState([]);
  const [totalPages, setTotalPages]     = useState(1);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  useEffect(() => {
    const fetchFoto = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ page: currentPage, limit: itemsPerPage });
        const res  = await fetch(`/api/galeri-foto?${params}`);
        const json = await res.json();
        
        if (!res.ok) {
          const errMsg = json.error || `Error: ${res.status}`;
          throw new Error(errMsg);
        }
        
        setGalleryItems(json.data || []);
        setTotalPages(json.pagination?.totalPages || 1);
      } catch (err) {
        console.error('Foto API Error:', err);
        setError(err.message || 'Gagal mengambil data galeri foto');
      } finally {
        setLoading(false);
      }
    };
    fetchFoto();
  }, [currentPage]);

  // Ambil data untuk halaman saat ini (sudah dipaginasi dari API)
  const currentItems = galleryItems;

  // Fungsi untuk mengubah halaman
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll ke atas saat ganti halaman
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
          <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">Gallery</h1>
          <div className="w-24 h-1 bg-green-600 mx-auto mb-6"></div>
          <p className="text-gray-600 text-center max-w-2xl mx-auto">
            Dokumentasi kegiatan dan program-program Dinas Pangan Provinsi Sumatera Barat dalam mendukung ketahanan pangan daerah.
          </p>
        </div>
        {/* Loading State */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium">⚠️ {error}</p>
            <p className="text-red-500 text-sm mt-1">Pastikan server API sudah berjalan di port 5000</p>
          </div>
        )}

        {/* Gallery Grid */}
        {!loading && !error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Image Placeholder */}
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>              
              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-600 mb-3 hover:text-blue-800 cursor-pointer">
                  {item.title}
                </h3>                
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                  {item.description}
                </p>                
                {/* Meta Information (date only) */}
                <div className="text-xs text-gray-500 space-y-1 mb-4">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {item.date}
                  </div>
                </div>
                
                {/* Read More Button */}
                <div className="flex justify-end">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                    read more
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
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
                      ? 'bg-blue-600 text-white'
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
export default Foto;