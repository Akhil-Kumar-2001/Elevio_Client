import React from "react";

interface PaginationProps {

    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        
        // For small number of pages, show all
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first few pages
            for (let i = 1; i <= 3; i++) {
                if (i <= totalPages) pages.push(i);
            }
            
            // Show ">" for next page set if needed
            if (totalPages > 3) {
                pages.push('>');
            }
        }
        
        return pages;
    };

    return (
    <div className="flex justify-center mt-6 mb-4"> {/* Center the pagination */}
        <div className="flex">
            {/* Previous button for larger screens */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="hidden md:flex items-center justify-center h-10 w-10 bg-gray-900 text-white border border-gray-800 rounded-l hover:bg-gray-800 disabled:opacity-50 disabled:hover:bg-gray-900"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                </svg>
            </button>
            
            {/* Page numbers */}
            {getPageNumbers().map((page, index) => (
                page === '>' ? (
                    <button
                        key={`next-set`}
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        className="flex items-center justify-center h-10 w-10 bg-gray-900 text-white border border-gray-800 hover:bg-gray-800 disabled:opacity-50"
                    >
                        &gt;
                    </button>
                ) : (
                    <button
                        key={`page-${page}`}
                        onClick={() => typeof page === 'number' && onPageChange(page)}
                        className={`flex items-center justify-center h-10 w-10 border border-gray-800 ${
                            currentPage === page
                                ? 'bg-blue-600 text-white font-medium'
                                : 'bg-gray-900 text-white hover:bg-gray-800'
                        }`}
                    >
                        {page}
                    </button>
                )
            ))}
            
            {/* Next button for larger screens */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="hidden md:flex items-center justify-center h-10 w-10 bg-gray-900 text-white border border-gray-800 rounded-r hover:bg-gray-800 disabled:opacity-50 disabled:hover:bg-gray-900"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                </svg>
            </button>
        </div>
    </div>
);

};

export default Pagination;

