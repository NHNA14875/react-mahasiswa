import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Jika tidak ada data atau hanya 1 halaman, sembunyikan pagination
  if (totalPages <= 1) return null;

  // Membuat deretan angka halaman: [1, 2, 3, ...]
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-between items-center mt-4 px-2">
      <div className="text-sm text-gray-500">
        Halaman <span className="font-bold text-gray-700">{currentPage}</span> dari <span className="font-bold text-gray-700">{totalPages}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm rounded-md bg-white border border-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          Sebelumnya
        </button>
        
        <div className="flex gap-1">
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 flex items-center justify-center text-sm rounded-md border transition-colors ${
                currentPage === page
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm rounded-md bg-white border border-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          Selanjutnya
        </button>
      </div>
    </div>
  );
};

export default Pagination;