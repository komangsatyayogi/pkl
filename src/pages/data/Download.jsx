import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useToast } from '../../components/ToastProvider';
import Breadcrumb from '../../components/Breadcrumb';

function Download() {
  const { addToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm]             = useState('');
  const [currentPage, setCurrentPage]           = useState(1);
  const itemsPerPage = 5;

  // State dari API
  const [downloadData, setDownloadData] = useState([]);
  const [categories, setCategories]     = useState(['all']);
  const [totalPages, setTotalPages]     = useState(1);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  // Fetch data dari API setiap kali filter berubah
  useEffect(() => {
    const fetchDownload = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page: currentPage,
          limit: itemsPerPage,
          category: selectedCategory,
          search: searchTerm,
        });
        const res  = await fetch(`/api/download?${params}`);
        if (!res.ok) throw new Error('Gagal mengambil data download');
        const json = await res.json();
        setDownloadData(json.data);
        setTotalPages(json.pagination.totalPages);
        if (json.categories) setCategories(json.categories);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDownload();
  }, [currentPage, selectedCategory, searchTerm]);

  // Reset page ke 1 saat filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  const paginatedDownloads = downloadData;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'PDF':
        return (
          <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        );
      case 'XLSX':
        return (
          <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm6 6a1 1 0 01-1 1H7a1 1 0 110-2h2a1 1 0 011 1zm3-1a1 1 0 100 2h2a1 1 0 100-2h-2z" clipRule="evenodd" />
          </svg>
        );
      case 'DOCX':
        return (
          <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const handleDownload = (file) => {
    // Simulasi download + toast UI
    addToast({
      type: 'success',
      title: 'Mengunduh file',
      description: file.fileName,
    });
  };

  return (
    <>
      <Navbar />
      <Breadcrumb />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h1 className="text-3xl font-bold text-[#0C3823] mb-2">Download Center</h1>
            <p className="text-gray-600">Unduh dokumen, laporan, dan data terkait program Dinas Pangan Provinsi Sumatera Barat</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              {/* Search */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-[#0C3823] mb-4">Pencarian</h3>
                <input
                  type="text"
                  placeholder="Cari dokumen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0C3823] focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-[#0C3823] mb-4">Kategori</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
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
            </div>
            {/* Main Content */}
            <div className="lg:w-3/4">

              {/* Loading State */}
              {loading && (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-gray-200 rounded" />
                        <div className="flex-1 space-y-3">
                          <div className="h-5 bg-gray-200 rounded w-3/4" />
                          <div className="h-4 bg-gray-200 rounded w-full" />
                          <div className="h-4 bg-gray-200 rounded w-1/2" />
                        </div>
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

              {/* File List */}
              {!loading && !error && (
              <div className="space-y-4">
                {paginatedDownloads.map((file) => (
                  <div key={file.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {getFileIcon(file.fileType)}
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-[#0C3823] mb-1">
                            {file.title}
                          </h3>
                          <span className="bg-[#0C3823] text-white px-2 py-1 rounded text-xs">
                            {file.category}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3">
                          {file.description}
                        </p>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            {file.downloadCount} download
                          </span>
                          <span>{file.fileSize}</span>
                          <span>{formatDate(file.uploadDate)}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 font-mono">
                            {file.fileName}
                          </span>
                          <button
                            onClick={() => handleDownload(file)}
                            className="bg-[#0C3823] text-white px-4 py-2 rounded-md hover:bg-[#1B4332] transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0C3823]"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              )} 

              {/* Pagination */}
              {!loading && !error && downloadData.length > 0 && totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 space-x-1">
                  {/* Previous Button */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-[#0C3823] border border-gray-300 hover:bg-[#0C3823] hover:text-white'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {/* Page Numbers */}
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
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          isCurrentPage
                            ? 'bg-[#0C3823] text-white'
                            : 'bg-white text-[#0C3823] border border-gray-300 hover:bg-[#0C3823] hover:text-white'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}

                  {/* Next Button */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-[#0C3823] border border-gray-300 hover:bg-[#0C3823] hover:text-white'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
             
              {/* No Results */}
              {!loading && !error && paginatedDownloads.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada file yang ditemukan</h3>
                  <p className="text-gray-500">Coba ubah kata kunci pencarian atau pilih kategori lain.</p>
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

export default Download;
