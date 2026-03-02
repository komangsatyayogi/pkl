import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Breadcrumb from '../../components/Breadcrumb';

function Berita() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const itemsPerPage = 6;

  // State dari API
  const [beritaData, setBeritaData]   = useState([]);
  const [categories, setCategories]   = useState(['all']);
  const [totalPages, setTotalPages]   = useState(1);
  const [totalCount, setTotalCount]   = useState(0);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  // Fetch data dari API setiap kali page / kategori berubah
  useEffect(() => {
    const fetchBerita = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page: currentPage,
          limit: itemsPerPage,
          category: selectedCategory,
        });
        const res  = await fetch(`/api/berita?${params}`);
        if (!res.ok) throw new Error('Gagal mengambil data berita');
        const json = await res.json();
        setBeritaData(json.data);
        setTotalPages(json.pagination.totalPages);
        setTotalCount(json.pagination.total);
        if (json.categories) setCategories(json.categories);
      } catch (err) {
        console.error('API Error:', err);
        setError(`Error: ${err.message || 'Gagal mengambil data berita'}`);
      } finally {
        setLoading(false);
      }
    };
    fetchBerita();
  }, [currentPage, selectedCategory]);

  const currentBerita = beritaData;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <>
      <Navbar />
      <Breadcrumb />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h1 className="text-3xl font-bold text-[#0C3823] mb-2">Berita Dinas Pangan</h1>
            <p className="text-gray-600">Informasi terkini seputar kegiatan dan program Dinas Pangan Provinsi Sumatera Barat</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-[#0C3823] mb-4">Kategori Berita</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        selectedCategory === category
                          ? 'bg-[#0C3823] text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category === 'all' ? 'Semua Kategori' : category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-[#0C3823] text-white rounded-lg p-6">
                <h4 className="font-semibold mb-3">Informasi</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="font-medium">Total Berita:</div>
                    <div>{totalCount} artikel</div>
                  </div>
                  <div>
                    <div className="font-medium">Terakhir Update:</div>
                    <div>{formatDate('2024-01-15')}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              {/* Loading State */}
              {loading && (
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                      <div className="w-full h-48 bg-gray-200" />
                      <div className="p-6 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-1/3" />
                        <div className="h-5 bg-gray-200 rounded w-full" />
                        <div className="h-4 bg-gray-200 rounded w-5/6" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8 text-center">
                  <p className="text-red-600 font-medium">⚠️ {error}</p>
                  <p className="text-red-500 text-sm mt-1">Pastikan server API sudah berjalan di port 3000</p>
                </div>
              )}

              {/* Berita Grid */}
              {!loading && !error && (
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {currentBerita.map((berita) => (
                  <div key={berita.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <img 
                      src={berita.image} 
                      alt={berita.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span className="bg-[#0C3823] text-white px-2 py-1 rounded text-xs">
                          {berita.category}
                        </span>
                        <span>{formatDate(berita.date)}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-[#0C3823] mb-3 line-clamp-2">
                        {berita.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {berita.excerpt}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Oleh: {berita.author}</span>
                        <button className="text-[#0C3823] font-medium text-sm hover:text-[#1B4332] transition-colors">
                          Baca Selengkapnya →
                        </button>
                      </div>
                    </div>
                  </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!loading && !error && totalPages > 1 && (
                <div className="flex justify-center items-center space-x-1 bg-white p-4 rounded-lg shadow-sm">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                  >
                    ←
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
                          <span key={pageNumber} className="px-2 py-1 text-gray-500">
                            …
                          </span>
                        );
                      }
                      return null;
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`px-3 py-1 rounded-md transition-colors ${
                          isCurrentPage
                            ? 'bg-[#0C3823] text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                  >
                    →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Berita;
