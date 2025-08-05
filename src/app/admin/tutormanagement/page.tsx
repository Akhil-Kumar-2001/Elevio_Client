'use client'

import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import Table from '../../../components/table';
import { getTutors, updateTutorStatus, searchTutors } from '@/app/service/admin/adminApi';
import AdminSidebar from '@/components/admin/adminsidebar';
import ConfirmModal from '@/components/admin/confirmModal';
import Pagination from '@/components/admin/paginaiton';
import Link from 'next/link';
import { debounce } from 'lodash';

const TutorManagement = () => {
  interface TutorType {
    _id: string;
    username: string;
    email: string;
    status: number;
    role: string;
    createdAt: string;
  }

  const [tutors, setTutors] = useState<TutorType[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<{ id: string, status: number } | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const tableColumn = [
    { header: "Name", field: "username" },
    { header: "Email", field: "email" },
    { header: "Role", field: "role" },
    { header: "Joined Date", field: "createdAt" }
  ];

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        fetchTutors();
        return;
      }
      setLoading(true);
      try {
        const searchData = await searchTutors(query, currentPage, 7);
        if (searchData && searchData.success) {
          setTutors(searchData.data.data);
          setTotalPages(Math.ceil(searchData.data.totalRecord / 7));
        }
      } catch (error) {
        toast.error('Failed to search tutors');
        console.log(error);
      } finally {
        setLoading(false);
      }
    }, 500),
    [currentPage]
  );

  const fetchTutors = async () => {
    setLoading(true);
    try {
      const tutorData = await getTutors(currentPage, 7);
      if (tutorData && tutorData.success) {
        setTutors(tutorData.data.data);
        setTotalPages(Math.ceil(tutorData.data.totalRecord / 7));
      }
    } catch (error) {
      toast.error('Failed to fetch tutors');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const openConfirmModal = (userId: string, currentStatus: number) => {
    setSelectedTutor({ id: userId, status: currentStatus });
    setModalOpen(true);
  };

  const handleBlockUnblockUser = async () => {
    if (!selectedTutor) return;

    try {
      const newStatus = selectedTutor.status === 1 ? -1 : 1;
      const response = await updateTutorStatus(selectedTutor.id);

      if (response && response.success) {
        toast.success(newStatus === 1 ? 'Tutor unblocked successfully' : 'Tutor blocked successfully');
        setTutors(tutors.map(tutor =>
          tutor._id === selectedTutor.id ? { ...tutor, status: newStatus } : tutor
        ));
      }
    } catch (error) {
      toast.error('Failed to update tutor status');
      console.log(error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  useEffect(() => {
    if (!searchQuery) {
      fetchTutors();
    }
  }, [currentPage, searchQuery]);

  const modalTitle = selectedTutor?.status === 1 ? 'Block Tutor' : 'Unblock Tutor';
  const modalMessage = selectedTutor?.status === 1
    ? 'Are you sure you want to block this tutor? They will not be able to access the platform.'
    : 'Are you sure you want to unblock this tutor? They will regain access to the platform.';
  const modalConfirmText = selectedTutor?.status === 1 ? 'Block' : 'Unblock';

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-black text-white p-4 border-b border-gray-700 flex justify-between items-center">
        <Link href={`/admin/dashboard`} className="text-xl font-bold">Elevio</Link>
        <div></div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div>
          <AdminSidebar />
        </div>

        <div className="flex-1 bg-black text-white overflow-auto">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="space-x-8 border-b border-gray-700">
                <button className="text-lg font-medium border-b-2 border-white pb-2 mr-4 text-white">All Tutors</button>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search tutors..."
                    className="bg-gray-800 text-white border border-gray-600 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-white w-64 transition-all duration-300 shadow-md hover:shadow-lg"
                  />
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                {loading && (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                )}
              </div>
            </div>

            <Table
              columnArray={tableColumn}
              dataArray={tutors.map(tutor => ({
                ...tutor,
                [tableColumn[0].field]: tutor.username,
                [tableColumn[1].field]: tutor.email,
                [tableColumn[2].field]: tutor.role,
                [tableColumn[3].field]: tutor.createdAt,
              }))}
              actions={true}
              onBlockUser={(userId, currentStatus) => openConfirmModal(userId, currentStatus)}
            />

            <ConfirmModal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              onConfirm={handleBlockUnblockUser}
              title={modalTitle}
              message={modalMessage}
              confirmText={modalConfirmText}
            />
            <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorManagement;