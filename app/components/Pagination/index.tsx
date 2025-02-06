import React from 'react';

interface PaginationProps {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ itemsPerPage, totalItems, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    if (totalPages <= 1) return null; // Cacher la pagination si une seule page

    return (
        <nav className="flex justify-center mt-8">
            <ul className="flex items-center gap-2">
                <li>
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-2 text-gray-700 bg-white border rounded-md 
                                    hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed`}
                        aria-label="Page précédente">
                        ←
                    </button>
                </li>

                {pageNumbers.map((number) => (
                    <li key={number}>
                        <button
                            onClick={() => onPageChange(number)}
                            className={`px-4 py-2 rounded-md border transition 
                                        ${currentPage === number
                                            ? 'bg-black text-white font-semibold' 
                                            : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                        >
                            {number}
                        </button>
                    </li>
                ))}

                <li>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-2 text-gray-700 bg-white border rounded-md 
                                    hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed`}
                        aria-label="Page suivante"
                    >
                        →
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;