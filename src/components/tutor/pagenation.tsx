import React from "react";

interface PaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
    return (
        <div className="flex justify-center items-center gap-2 mt-6 mb-4 w-full max-w-xs mx-auto">
            {/* Left Section: Previous Button */}
            <div>
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-full border border-gray-400 hover:bg-gray-800 disabled:opacity-50 transition"
                >
                    {"<"}
                </button>
            </div>

            {/* Center Section: Current Page */}
            <div>
                <span className="w-8 h-8 flex items-center justify-center bg-white text-black font-semibold rounded-full border border-gray-400 shadow-md">
                    {currentPage}
                </span>
            </div>

            {/* Right Section: Next Button */}
            <div>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-full border border-gray-400 hover:bg-gray-800 disabled:opacity-50 transition"
                >
                    {">"}
                </button>
            </div>
        </div>
    );
};

export default Pagination;
