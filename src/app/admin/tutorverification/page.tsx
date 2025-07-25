'use client'

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Table from '../../../components/table';
import { getPendingTutors, } from '@/app/service/admin/adminApi';
import AdminSidebar from '@/components/admin/adminsidebar';
import { useRouter } from 'next/navigation';
import Pagination from '@/components/admin/paginaiton';
import Link from 'next/link';


const TutorManagement = () => {
  const router = useRouter()
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
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1);

  const tableColumn = [
    { header: "Name", field: "username" },
    { header: "Email", field: "email" },
    { header: "Role", field: "role" },
    { header: "Status", field: "isVerified" }
  ];

  const fetchTutors = async () => {
    setLoading(true);
    try {
      const tutorData = await getPendingTutors(currentPage, 5);
      if (tutorData && tutorData.success) {
        setTutors(tutorData.data.data);
        setTotalPages(Math.ceil(tutorData.data.totalRecord / 5));
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to fetch tutors');
    } finally {
      setLoading(false);
    }
  };

  const viewProfile = (tutorId: string) => {
    router.push(`/admin/tutor-details/${tutorId}`)
  }

  useEffect(() => {
    fetchTutors();
  }, [currentPage]);

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-black text-white p-4 border-b border-gray-700 flex justify-between items-center">
      <Link href={`/admin/dashboard`} className="text-xl font-bold">Elevio</Link>      </div>

      <div className="flex flex-1 overflow-hidden">

        <div>
          <AdminSidebar />
        </div>

        <div className="flex-1 bg-black text-white overflow-auto">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="space-x-8 border-b border-gray-700">
                <button className="text-lg font-medium border-b-2 border-white pb-2 mr-4 text-white">Verification list</button>
              </div>
              {loading && <div className="text-gray-400">Loading...</div>}
            </div>

            <Table
              columnArray={tableColumn}
              dataArray={tutors.map(tutor => ({
                ...tutor,
                isVerified: tutor.status === 1 ? 'Verified' : 'Pending'
              }))}
              pageRole={'tutor-profile'}
              pageFunction={viewProfile}
            />
             <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorManagement