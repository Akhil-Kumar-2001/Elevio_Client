'use client'

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AdminSidebar from '@/components/admin/adminsidebar';
import { getCategories, createCategory, updateCategoryStatus } from '@/app/service/admin/adminApi';
import Table from '@/components/table';
import ConfirmModal from '@/components/admin/confirmModal';
import Pagination from '@/components/admin/paginaiton';

const CourseDashboard = () => {
    interface CategoryType {
        _id: string;
        name: string;
        status: number;  // 1 for Active, -1 for Blocked
        createdAt: string;
        statusText?: string; // New field for readable status
    }

    const [category, setCategory] = useState<CategoryType[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    // 

    const [data, setData] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    // 


    // State for confirmation modal
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<{ id: string, status: number, name: string } | null>(null);

    const tableColumn = [
        { header: "Name", field: "name" },
        { header: "Created Date", field: "createdAt" },
        {
            header: "Status",
            field: "statusText",
            render: (row: CategoryType) => (
                <span className={row.status === 1 ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>
                    {row.statusText}
                </span>
            )
        }
    ];

    // Fetch categories and format status before setting the state
    const fetchCategory = async () => {
        setLoading(true);
        try {
            const response = await getCategories(currentPage, 10); // 10 items per page
            if (response && response.success) {
                const formattedCategories = response.data.map((cat: CategoryType) => ({
                    ...cat,
                    statusText: cat.status === 1 ? "Active" : "Blocked",
                }));
                setCategory(formattedCategories);
                setTotalPages(response.totalPages); // Update total pages
            }
        } catch (error) {
            toast.error("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };


    // Open confirmation modal instead of directly updating status
    const handleBlockUnblockClick = (categoryId: string, currentStatus: number) => {
        const categoryToUpdate = category.find(cat => cat._id === categoryId);
        if (categoryToUpdate) {
            setSelectedCategory({
                id: categoryId,
                status: currentStatus,
                name: categoryToUpdate.name
            });
            setIsConfirmModalOpen(true);
        }
    };

    // Handle category block/unblock and update the state
    const confirmBlockUnblock = async () => {
        if (!selectedCategory) return;

        try {
            const newStatus = selectedCategory.status === 1 ? -1 : 1;
            const response = await updateCategoryStatus(selectedCategory.id);

            if (response && response.success) {
                toast.success(newStatus === 1 ? 'Category unblocked successfully' : 'Category blocked successfully');

                // Update category state after blocking/unblocking
                setCategory(category.map(cat =>
                    cat._id === selectedCategory.id ? {
                        ...cat,
                        status: newStatus,
                        statusText: newStatus === 1 ? "Active" : "Blocked"
                    } : cat
                ));
            }
        } catch (error) {
            toast.error('Failed to update category status');
        }
    };

    // Handle creating a new category
    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) {
            toast.error('Category name is required');
            return;
        }

        try {
            let response = await createCategory(newCategoryName);
            if (response.success) {
                toast.success(response.message);

                // Update category list without refresh
                setCategory(prevCategories => [
                    ...prevCategories,
                    {
                        _id: response.data._id,
                        name: newCategoryName,
                        createdAt: new Date().toISOString(),
                        status: 1,
                        statusText: "Active"
                    }
                ]);

                setIsModalOpen(false);
                setNewCategoryName("");
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCategory();
    }, [currentPage]);

    // Modal props
    const modalTitle = selectedCategory?.status === 1 ? 'Block Category' : 'Unblock Category';
    const modalMessage = selectedCategory?.status === 1
        ? `Are you sure you want to block the category "${selectedCategory?.name}"?`
        : `Are you sure you want to unblock the category "${selectedCategory?.name}"?`;
    const modalConfirmText = selectedCategory?.status === 1 ? 'Block' : 'Unblock';

    return (
        <div className="flex flex-col h-screen">
            <div className="bg-black text-white p-4 border-b border-gray-700 flex justify-between items-center">
                <div className="text-xl font-bold">Elevio</div>
            </div>
            <div className="flex flex-1 overflow-hidden">
                <AdminSidebar />
                <div className="flex-1 bg-black text-white overflow-auto p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-medium text-white">All Categories</h2>
                        <button
                            className="bg-black border border-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition duration-300"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Add Category
                        </button>
                    </div>

                    <Table
                        columnArray={tableColumn}
                        dataArray={category}
                        actions={true}
                        onBlockUser={handleBlockUnblockClick}
                    />
                    <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
                </div>
            </div>

            {/* Create Category Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-md animate-fade-in z-50">
                    <div className="bg-gray-900 p-6 rounded-2xl shadow-lg w-96 h-[250px] border border-gray-700 flex flex-col justify-between">
                        <h2 className="text-white text-2xl font-semibold">Create New Category</h2>
                        <input
                            type="text"
                            placeholder="Enter category name"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex justify-end space-x-4 mt-4">
                            <button
                                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-300"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                                onClick={handleCreateCategory}
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Using the reusable ConfirmModal for Block/Unblock */}
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => {
                    setIsConfirmModalOpen(false);
                    setSelectedCategory(null);
                }}
                onConfirm={() => {
                    confirmBlockUnblock();
                    setIsConfirmModalOpen(false);
                    setSelectedCategory(null);
                }}
                title={modalTitle}
                message={modalMessage}
                confirmText={modalConfirmText}
            />
        </div>
    );
};

export default CourseDashboard;