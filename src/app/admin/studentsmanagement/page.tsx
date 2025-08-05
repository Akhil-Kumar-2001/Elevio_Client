'use client'

import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import Table from '../../../components/table';
import { getStudents, updateStudentStatus, searchStudents } from '@/app/service/admin/adminApi';
import AdminSidebar from '@/components/admin/adminsidebar';
import ConfirmModal from '@/components/admin/confirmModal';
import Pagination from '@/components/admin/paginaiton';
import Link from 'next/link';
import { debounce } from 'lodash';

const StudentsManagement = () => {
  interface StudentType {
    _id: string;
    username: string;
    email: string;
    status: number;
    role: string;
    createdAt: string;
  }

  const [students, setStudents] = useState<StudentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<{ id: string, status: number } | null>(null);
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
        fetchStudents();
        return;
      }
      setLoading(true);
      try {
        const searchData = await searchStudents(query, currentPage, 7);
        if (searchData && searchData.success) {
          setStudents(searchData.data.data);
          setTotalPages(Math.ceil(searchData.data.totalRecord / 7));
        }
      } catch (error) {
        toast.error('Failed to search students');
        console.log(error);
      } finally {
        setLoading(false);
      }
    }, 500),
    [currentPage]
  );

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const studentData = await getStudents(currentPage, 7);
      if (studentData && studentData.success) {
        setStudents(studentData.data.data);
        setTotalPages(Math.ceil(studentData.data.totalRecord / 7));
      }
    } catch (error) {
      toast.error('Failed to fetch students');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const openConfirmModal = (userId: string, currentStatus: number) => {
    setSelectedStudent({ id: userId, status: currentStatus });
    setModalOpen(true);
  };

  const handleBlockUnblockUser = async () => {
    if (!selectedStudent) return;

    try {
      const response = await updateStudentStatus(selectedStudent.id);

      if (response && response.success) {
        const newStatus = selectedStudent.status === 1 ? -1 : 1;
        toast.success(newStatus === 1 ? 'Student unblocked successfully' : 'Student blocked successfully');
        setStudents(students.map(student =>
          student._id === selectedStudent.id ? { ...student, status: newStatus } : student
        ));
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to update student status');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  useEffect(() => {
    if (!searchQuery) {
      fetchStudents();
    }
  }, [currentPage, searchQuery]);

  const modalTitle = selectedStudent?.status === 1 ? 'Block Student' : 'Unblock Student';
  const modalMessage = selectedStudent?.status === 1
    ? 'Are you sure you want to block this student? They will not be able to access the platform.'
    : 'Are you sure you want to unblock this student? They will regain access to the platform.';
  const modalConfirmText = selectedStudent?.status === 1 ? 'Block' : 'Unblock';

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-black text-white p-4 border-b border-gray-700 flex justify-between items-center">
        <Link href={`/admin/dashboard`} className="text-xl font-bold">Elevio</Link>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />

        <div className="flex-1 bg-black text-white overflow-auto">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="space-x-8 border-b border-gray-700">
                <button className="text-lg font-medium border-b-2 border-white pb-2 mr-4 text-white">All Students</button>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search students..."
                    className="bg-gray-800 text-white border border-gray-600 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-all duration-300 shadow-md hover:shadow-lg"
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
              dataArray={students.map(student => ({
                ...student,
                id: student._id
              }))}
              actions={true}
              onBlockUser={(userId, currentStatus) => openConfirmModal(userId, currentStatus)}
            />
            <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />

            <ConfirmModal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              onConfirm={handleBlockUnblockUser}
              title={modalTitle}
              message={modalMessage}
              confirmText={modalConfirmText}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentsManagement;