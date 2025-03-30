import React from "react";

interface PaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
    // Generate array of page numbers to display
    const getPageNumbers = () => {
        // For smaller total pages, show all
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        
        // For larger sets, show a window around current page
        let pages = [1];
        
        // Calculate range to show around current page
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        
        // Add ellipsis if needed before middle pages
        if (start > 2) {
            pages.push(-1); // -1 represents ellipsis
        }
        
        // Add middle pages
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        
        // Add ellipsis if needed after middle pages
        if (end < totalPages - 1) {
            pages.push(-2); // -2 represents the second ellipsis
        }
        
        // Add last page if not already included
        if (totalPages > 1) {
            pages.push(totalPages);
        }
        
        return pages;
    };

    return (
        <div className="flex justify-center mt-10 mb-6">
            <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage <= 1}
                    className={`flex items-center justify-center w-10 h-10 rounded-full
                    ${currentPage <= 1 
                        ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 hover:from-purple-100 hover:to-indigo-100 shadow-sm border border-purple-100'}`}
                    aria-label="Previous page"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map((page, index) => (
                    page < 0 ? (
                        // Render ellipsis
                        <span key={`ellipsis-${index}`} className="w-10 h-10 flex items-center justify-center text-gray-500">
                            ...
                        </span>
                    ) : (
                        // Render page button
                        <button
                            key={`page-${page}`}
                            onClick={() => onPageChange(page)}
                            className={`w-10 h-10 rounded-full font-medium transition-all ${
                                currentPage === page
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md' 
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                            }`}
                            aria-label={`Page ${page}`}
                            aria-current={currentPage === page ? 'page' : undefined}
                        >
                            {page}
                        </button>
                    )
                ))}

                {/* Next Button */}
                <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage >= totalPages}
                    className={`flex items-center justify-center w-10 h-10 rounded-full
                    ${currentPage >= totalPages 
                        ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 hover:from-purple-100 hover:to-indigo-100 shadow-sm border border-purple-100'}`}
                    aria-label="Next page"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Pagination;