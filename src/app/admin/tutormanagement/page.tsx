'use client'

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Table from '../../../components/table';
import { getTutors, updateTutorStatus } from '@/app/service/admin/adminApi';
import AdminSidebar from '@/components/adminsidebar';


const TutorManagement = () => {

  interface TutorType {
    _id: string;
    username: string;
    email: string;
    status: number;
    role:string;
    createdAt:string;
}

  const [tutors, setTutors] = useState<TutorType[]>([]);
  const [loading, setLoading] = useState(false);

  const tableColumn = [
    { header: "Name", field: "username" },
    { header: "Email", field: "email" },
    { header: "Role", field: "role" },
    { header: "Joined Date", field: "createdAt" }
  ];

  const fetchTutors = async () => {
    setLoading(true);
    try {
      const tutorData = await getTutors();
      if (tutorData && tutorData.success) {
        setTutors(tutorData.data);
      }
    } catch (error) {
      toast.error('Failed to fetch tutors');
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUnblockUser = async (userId: string, currentStatus: number) => {
    try {
        const newStatus = currentStatus === 1 ? -1 : 1;
        const response = await updateTutorStatus(userId);
        
        if (response && response.success) {
            toast.success(newStatus === 1 ? 'Tutor unblocked successfully' : 'Tutor blocked successfully');
            setTutors(tutors.map(tutor => 
                tutor._id === userId ? { ...tutor, status: newStatus } : tutor
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

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-black text-white p-4 border-b border-gray-700 flex justify-between items-center">
        <div className="text-xl font-bold">Elevio</div>
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
              dataArray={tutors} 
              actions={true}
              onBlockUser={handleBlockUnblockUser}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorManagement