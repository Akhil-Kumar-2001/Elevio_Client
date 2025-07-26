'use client'

import Navbar from '@/components/tutor/navbar';
import TutorSidebar from '@/components/tutor/tutorSidebar';
import Table from '../../../components/tutor/tutorTable';
import Pagination from '@/components/tutor/pagenation';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { getCourses, getCategories } from '@/app/service/tutor/tutorApi';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/tutorAuthStore';

// Define the Course interface
interface Course {
  _id: string;
  title: string;
  category: string;
  status: string;
  name?: string; // Added to align with BaseRow's optional name property
}

const Courses = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [expanded, setExpanded] = useState<boolean>(true);

  const { user } = useAuthStore();
  const tutorId = user?.id;

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      if (response && response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch categories');
    }
  };

  // Fetch courses from API
  const fetchCourses = async (page: number) => {
    setLoading(true);
    try {
      if (!tutorId) {
        console.log("Tutor ID is not available");
        return;
      }
      const response = await getCourses(tutorId, page, 5);
      if (response && response.success) {
        setCourses(response.data.data || []); // Ensure courses is an array
        const totalRecords = response.data.totalRecord || 0;
        const calculatedTotalPages = Math.ceil(totalRecords / 5); // Use Math.ceil to round up
        setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1); // Ensure at least 1 page
      } else {
        setCourses([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch courses');
      setCourses([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories and courses on mount and when tutorId changes
  useEffect(() => {
    if (tutorId) {
      fetchCategories();
      fetchCourses(currentPage);
    }
  }, [tutorId]); // Add tutorId as a dependency

  // Fetch courses when currentPage changes
  useEffect(() => {
    if (tutorId) {
      fetchCourses(currentPage);
    }
  }, [currentPage, tutorId]); // Add currentPage and tutorId as dependencies

  const viewProfile = (courseId: string) => {
    router.push(`/tutor/courses/course-details/${courseId}`);
  };

  // Define Column interface specific to Course
  interface Column {
    field: keyof Course | string;
    header: string;
    render?: (row: Course) => React.ReactNode;
  }

  const columns: Column[] = [
    { field: 'title', header: 'Course Name' },
    {
      field: 'category',
      header: 'Category',
      render: (row: Course) => {
        const categoryName = categories.find(cat => cat._id === row.category)?.name || 'Unknown';
        return <span>{categoryName}</span>;
      },
    },
    {
      field: 'status',
      header: 'Status',
      render: (row: Course) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            row.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
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
      <div className="flex flex-grow mt-16">
        <TutorSidebar expanded={expanded} setExpanded={setExpanded} />
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-medium text-gray-800">Course List</h1>
            <Link
              href={'/tutor/courses/createcourse'}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              <Plus size={16} />
              <span>Add Course</span>
            </Link>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : courses.length === 0 ? (
            <p>No courses available.</p>
          ) : (
            <Table<Course>
              columnArray={columns}
              dataArray={courses}
              pageRole={'course-details'}
              pageFunction={viewProfile}
            />
          )}
          <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
        </div>
      </div>
    </div>
  );
};

export default Courses;