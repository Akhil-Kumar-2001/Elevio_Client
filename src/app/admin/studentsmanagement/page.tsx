'use client'

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Table from '../../../components/table';
import { getStudents, updateStudentStatus } from '@/app/service/admin/adminApi';
import AdminSidebar from '@/components/adminsidebar';

const StudentsManagement = () => {

  // const TutorManagement = () => {

  interface StudentType {
    _id: string;
    username: string;
    email: string;
    status: number;
    role:string;
    createdAt:string;
}
  const [students, setStudents] = useState<StudentType[]>([]);
  const [loading, setLoading] = useState(false);

  const tableColumn = [
    { header: "Name", field: "username" },
    { header: "Email", field: "email" },
    { header: "Role", field: "role" },
    { header: "Joined Date", field: "createdAt" }
  ];


  const fetchStudents = async () => {
    setLoading(true);
    try {
      const studentData = await getStudents();
      if (studentData && studentData.success) {
        setStudents(studentData.data);
      }
    } catch (error) {
      toast.error('Failed to fetch students');
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUnblockUser = async (userId: string, currentStatus: number) => {
    try {
        const newStatus = currentStatus === 1 ? -1 : 1;
        const response = await updateStudentStatus(userId);
        
        if (response && response.success) {
            toast.success(newStatus === 1 ? 'Student unblocked successfully' : 'Student blocked successfully');
            setStudents(students.map(student => 
                student._id === userId ? { ...student, status: newStatus } : student
            ));
        }
    } catch (error) {
        toast.error('Failed to update student status');
    }
};


  useEffect(() => {
    fetchStudents();
  }, []);

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
              onBlockUser={handleBlockUnblockUser}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentsManagement