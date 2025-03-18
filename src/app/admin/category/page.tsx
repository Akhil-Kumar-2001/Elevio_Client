'use client'

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AdminSidebar from '@/components/admin/adminsidebar';
import { getCategories, createCategory, updateCategoryStatus, deleteCategory } from '@/app/service/admin/adminApi';
import Table from '@/components/table';
import ConfirmModal from '@/components/admin/confirmModal';
import Pagination from '@/components/admin/paginaiton';

const CategoryPage = () => {
    interface CategoryType {
        _id: string;
        name: string;
        status: number;  // 1 for Active, -1 for Blocked
        createdAt: string;
        statusText?: string;
    }

    const [category, setCategory] = useState<CategoryType[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    // Pagination
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    // Confirmation modals
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<{ id: string, status: number, name: string } | null>(null);

    // Delete confirmation modal
    const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
    const [selectedDeleteCategory, setSelectedDeleteCategory] = useState<{ id: string, name: string } | null>(null);

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

    // Fetch categories
    const fetchCategory = async () => {
        setLoading(true);
        try {
            const response = await getCategories(currentPage, 5);
            if (response && response.success) {
                const formattedCategories = response.data.categories.map((cat: CategoryType) => ({
                    ...cat,
                    statusText: cat.status === 1 ? "Active" : "Blocked",
                }));
                setCategory(formattedCategories);
                setTotalPages(Math.ceil(response.data.totalRecord / 5));
            }
        } catch (error) {
            toast.error("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    // Handle block/unblock
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

    const confirmBlockUnblock = async () => {
        if (!selectedCategory) return;

        try {
            const newStatus = selectedCategory.status === 1 ? -1 : 1;
            const response = await updateCategoryStatus(selectedCategory.id);

            if (response && response.success) {
                toast.success(newStatus === 1 ? 'Category unblocked successfully' : 'Category blocked successfully');
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

    // Handle delete category
    const handleDeleteCategory = (categoryId: string, categoryName: string) => {
        setSelectedDeleteCategory({ id: categoryId, name: categoryName });
        setIsDeleteConfirmModalOpen(true);
    };

    const confirmDeleteCategory = async () => {
        if (!selectedDeleteCategory) return;

        try {
            const response = await deleteCategory(selectedDeleteCategory.id);
            if (response && response.success) {
                toast.success(response.message);
                setCategory(category.filter(cat => cat._id !== selectedDeleteCategory.id));
            }
        } catch (error) {
            toast.error("Failed to delete category");
        } finally {
            setIsDeleteConfirmModalOpen(false);
            setSelectedDeleteCategory(null);
        }
    };

    // Handle create category
    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) {
            toast.error('Category name is required');
            return;
        }

        try {
            let response = await createCategory(newCategoryName);
            if (response.success) {
                toast.success(response.message);
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
                        <button className="bg-black border border-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
                            onClick={() => setIsModalOpen(true)}>Add Category</button>
                    </div>

                    <Table
                        columnArray={tableColumn}
                        dataArray={category}
                        actions={true}
                        onBlockUser={handleBlockUnblockClick}
                        onDeleteCategory={handleDeleteCategory}
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

            {/* Confirm Modal for Block/Unblock */}
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={confirmBlockUnblock}
                title={selectedCategory?.status === 1 ? 'Block Category' : 'Unblock Category'}
                message={`Are you sure you want to ${selectedCategory?.status === 1 ? 'block' : 'unblock'} "${selectedCategory?.name}"?`}
                confirmText={selectedCategory?.status === 1 ? 'Block' : 'Unblock'}
            />

            {/* Confirm Modal for Delete */}
            <ConfirmModal
                isOpen={isDeleteConfirmModalOpen}
                onClose={() => setIsDeleteConfirmModalOpen(false)}
                onConfirm={confirmDeleteCategory}
                title="Delete Category"
                message={`Are you sure you want to delete "${selectedDeleteCategory?.name}"?`}
                confirmText="Delete"
            />
        </div>
    );
};

export default CategoryPage;
