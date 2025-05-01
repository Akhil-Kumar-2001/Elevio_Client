'use client'

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Table from '../../../components/table';
import { getTutors, updateTutorStatus } from '@/app/service/admin/adminApi';
import AdminSidebar from '@/components/admin/adminsidebar';
import ConfirmModal from '@/components/admin/confirmModal';
import Pagination from '@/components/admin/paginaiton';
import Link from 'next/link';

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
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1);

  const tableColumn = [
    { header: "Name", field: "username" },
    { header: "Email", field: "email" },
    { header: "Role", field: "role" },
    { header: "Joined Date", field: "createdAt" }
  ];

  const fetchTutors = async () => {
    setLoading(true);
    try {
      const tutorData = await getTutors(currentPage, 5);
      if (tutorData && tutorData.success) {
        setTutors(tutorData.data.tutors);
        setTotalPages(Math.ceil(tutorData.data.totalRecord / 5));
      }
    } catch (error) {
      toast.error('Failed to fetch tutors');
      console.log(error)
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
      console.log(error)
    }
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  // Modal props
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
              {loading && <div className="text-gray-400">Loading...</div>}
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