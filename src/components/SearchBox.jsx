import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchBox({ placeholder = "Pencarian Data", className = "", compact = false, size = "md" }) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search page with query parameter
      navigate(`/data/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      alert("Kolom tidak boleh kosong"); // Warning message for empty input
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const sizeClasses = {
    sm: 'text-sm px-3 py-2',
    md: 'text-sm px-4 py-2', 
    lg: 'text-lg px-5 py-3'
  };

  const widthClasses = {
    sm: 'w-40',
    md: compact ? 'w-48' : 'w-64',
    lg: 'w-full'
  };

  return (
    <form onSubmit={handleSearch} className={`relative flex ${className}`}>
      <input 
        type="text" 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        maxLength={100}
        className={`bg-white text-gray-800 placeholder-gray-500 rounded-l focus:outline-none focus:ring-2 focus:ring-green-500 ${sizeClasses[size]} ${widthClasses[size]}`}
      />
      <button 
        type="submit"
        className={`bg-[#1B4332] hover:bg-[#2d5a46] text-white rounded-r flex items-center justify-center transition-colors ${sizeClasses[size]}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </form>
  );
}

export default SearchBox;
