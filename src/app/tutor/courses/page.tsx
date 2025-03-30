'use client'

import Navbar from '@/components/tutor/navbar';
import TutorSidebar from '@/components/tutor/tutorSidebar';
import Table from '../../../components/tutor/tutorTable';
import Pagination from '@/components/tutor/pagenation';
import { Eye, Plus } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { getCourses, getCategories } from '@/app/service/tutor/tutorApi';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/tutorAuthStore';

const Courses = () => {

  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]); 
  const {user} = useAuthStore()
  const tutorId = user?.id

  // ✅ Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      if (response && response.success) {
        setCategories(response.data); 
      }
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  // ✅ Fetch courses from API
  const fetchCourses = async () => {
    setLoading(true);
    try {
      if(!tutorId){
        console.log("tutor id is no availabe")
        return
      }
      const response = await getCourses(tutorId,currentPage, 5);
      if (response && response.success) {
        setCourses(response.data.courses);
        setTotalPages(Math.ceil(response.data.totalRecord / 5));
      }
    } catch (error) {
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch categories and courses when component mounts
  useEffect(() => {
    fetchCategories();
    fetchCourses();
  }, [currentPage]);

  const viewProfile = (courseId: string) => {
    router.push(`/tutor/courses/course-details/${courseId}`)
  };

  // ✅ Updated category field to display category name instead of ID
  const columns = [
    { field: 'title', header: 'Course Name' },
    { 
      field: 'category', 
      header: 'Category', 
      render: (row: any) => {
        const categoryName = categories.find(cat => cat._id === row.category)?.name || 'Unknown';
        return <span>{categoryName}</span>;
      }
    },
    {
      field: 'status',
      header: 'Status',
      render: (row: any) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${row.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-white">
      <Navbar />
      <div className="flex flex-grow">
        <TutorSidebar />
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-medium text-gray-800">Course List</h1>
            <Link href={'/tutor/courses/createcourse'} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-700">
              <Plus size={16} />
              <span>Add Course</span>
            </Link>
          </div>
          <Table columnArray={columns} dataArray={courses} pageRole={'course-details'} pageFunction={viewProfile} />
          <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
        </div>
      </div>
    </div>
  );
};

export default Courses;
