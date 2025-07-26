'use client'

import Navbar from '@/components/tutor/navbar';
import TutorSidebar from '@/components/tutor/tutorSidebar';
import Table from '../../../components/tutor/tutorTable';
import Pagination from '@/components/tutor/pagenation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useAuthStore from '@/store/tutorAuthStore';
import { getStudents } from '@/app/service/tutor/tutorApi';

// Define the Student interface
interface Student {
  _id: string;
  username: string;
  email: string;
  role: string;
  profilePicture?: string;
}

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [expanded, setExpanded] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuthStore();
  const tutorId = user?.id;

  // Fetch students from API
  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!tutorId) {
        setError('Tutor authentication required. Please log in.');
        console.log("Tutor ID is not available");
        return;
      }
      const response = await getStudents(currentPage, 9);
      if (response && response.success) {
        const studentData = response.data.students || [];
        setStudents(studentData);
        setTotalPages(Math.ceil(response.data.totalRecord / 9));
        if (studentData.length === 0) {
          setError('No students found for this tutor.');
        }
      } else {
        setError('Failed to fetch students. Please try again.');
        toast.error('Failed to fetch students');
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      setError('An error occurred while fetching students.');
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
    };

  useEffect(() => {
    if (tutorId) {
      fetchStudents();
    }
  }, [currentPage, tutorId]); // Add tutorId to dependencies

  // Define Column interface specific to Student
  interface Column {
    field: keyof Student | string;
    header: string;
    render?: (row: Student) => React.ReactNode;
  }

  const columns: Column[] = [
    {
      field: 'profilePicture',
      header: 'Profile Picture',
      render: (row: Student) =>
        row.profilePicture ? (
          <img src={row.profilePicture} alt={row.username} className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <span>N/A</span>
        ),
    },
    { field: 'username', header: 'Username' },
    { field: 'email', header: 'Email' },
    { field: 'role', header: 'Role' },
  ];

  return (
    <div className="flex flex-col h-screen bg-white">
      <Navbar />
      <div className="flex flex-grow mt-16">
        <TutorSidebar expanded={expanded} setExpanded={setExpanded} />
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-medium text-gray-800">Student List</h1>
            {/* Optional: Add a button if needed in the future */}
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : students.length === 0 ? (
            <div>No students available.</div>
          ) : (
            <Table<Student>
              columnArray={columns}
              dataArray={students}
            />
          )}
          {students.length > 0 && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Students;