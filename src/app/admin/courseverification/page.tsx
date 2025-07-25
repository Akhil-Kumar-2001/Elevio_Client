'use client'

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Table from '../../../components/table';
import { getPendingCourses } from '@/app/service/admin/adminApi';
import AdminSidebar from '@/components/admin/adminsidebar';
import { useRouter } from 'next/navigation';
import { Course } from '@/types/types';
import Pagination from '@/components/admin/paginaiton';
import Link from 'next/link';


const CourseVerification = () => {
  const router = useRouter()

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  // Pagination
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const tableColumn = [
    { header: "Name", field: "title" },
    { header: "Price", field: "price" },
    { header: "Created At", field: "createdAt" },
    { header: "Status", field: "status" }
  ];


  // const fetchCategory = async () => {
  //         setLoading(true);
  //         try {
  
  //             const response = await getCategories(currentPage, 5);
  //             if (response && response.success) {
  //                 const formattedCategories = response.data.categories.map((cat: CategoryType) => ({
  
  //                     ...cat,
  //                     statusText: cat.status === 1 ? "Active" : "Blocked",
  //                 }));
  //                 setCategory(formattedCategories);
  
  //                 setTotalPages(Math.ceil(response.data.totalRecord / 5));
  
  //             }
  //         } catch (error) {
  //             toast.error("Failed to fetch categories");
  //         } finally {
  //             setLoading(false);
  //         }
  //     };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const courseData = await getPendingCourses(currentPage,7);
      if (courseData && courseData.success) {
        setCourses(courseData.data.data);
        setTotalPages(Math.floor(courseData.data.totalRecord / 7));
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to fetch tutors');
    } finally {
      setLoading(false);
    }
  };

  const viewProfile = (tutorId: string) => {
    router.push(`/admin/course-preview/${tutorId}`)
  }

  useEffect(() => {
    fetchCourses();
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
              dataArray={courses.map(course => ({
                ...course,
                status: course.status === 'Active' ? 1 : 0, // Convert status to number
                category: typeof course.category === 'string' ? course.category : course.category.name, // Ensure category is a string
                isBlocked: course.isBlocked ? 'true' : 'false', // Convert isBlocked to string
              }))}
              pageRole={'Course-preview'}
              pageCourseFunction={viewProfile}
            />
            <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />

          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseVerification