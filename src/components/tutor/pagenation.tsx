import React from "react";

interface PaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
    const getPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="flex justify-center mt-6 mb-4">
            <div className="flex gap-2 bg-black p-1 rounded-lg">
                {/* Previous Button */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="px-3 py-1 text-white rounded-md disabled:opacity-50"
                >
                    {"<"}
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-3 py-1 rounded-md transition ${
                            currentPage === page
                                ? "bg-white text-black font-semibold"
                                : "text-white hover:bg-gray-700"
                        }`}
                    >
                        {page}
                    </button>
                ))}

                {/* Next Button */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="px-3 py-1 text-white rounded-md disabled:opacity-50"
                >
                    {">"}
                </button>
            </div>
        </div>
    );
};

export default Pagination;
