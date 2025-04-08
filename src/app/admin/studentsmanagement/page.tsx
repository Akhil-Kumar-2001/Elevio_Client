'use client'

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Table from '../../../components/table';
import { getStudents, updateStudentStatus } from '@/app/service/admin/adminApi';
import AdminSidebar from '@/components/admin/adminsidebar';
import ConfirmModal from '@/components/admin/confirmModal';
import Pagination from '@/components/admin/paginaiton';


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
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1);

  const tableColumn = [
    { header: "Name", field: "username" },
    { header: "Email", field: "email" },
    { header: "Role", field: "role" },
    { header: "Joined Date", field: "createdAt" }
  ];

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const studentData = await getStudents(currentPage, 5);
      if (studentData && studentData.success) {
        setStudents(studentData.data.students);
        setTotalPages(Math.ceil(studentData.data.totalRecord / 5));
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
      console.log(error)
      toast.error('Failed to update student status');
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Default modal props that always returns the required fields
  const modalTitle = selectedStudent?.status === 1 ? 'Block Student' : 'Unblock Student';
  const modalMessage = selectedStudent?.status === 1
    ? 'Are you sure you want to block this student? They will not be able to access the platform.'
    : 'Are you sure you want to unblock this student? They will regain access to the platform.';
  const modalConfirmText = selectedStudent?.status === 1 ? 'Block' : 'Unblock';

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-black text-white p-4 border-b border-gray-700 flex justify-between items-center">
        <div className="text-xl font-bold">Elevio</div>
        {/* <div>...</div> */}
      </div>

      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />

        <div className="flex-1 bg-black text-white overflow-auto">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="space-x-8 border-b border-gray-700">
                <button className="text-lg font-medium border-b-2 border-white pb-2 mr-4 text-white">All Students</button>
              </div>
              {loading && <div className="text-gray-400">Loading...</div>}
            </div>

            <Table
              columnArray={tableColumn}
              dataArray={students}
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