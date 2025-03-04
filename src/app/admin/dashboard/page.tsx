'use client'

import React from 'react'
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import useAuthStore from '@/store/adminAuthStore';
import AdminSidebar from '@/components/adminsidebar';

const CourseDashboard = () => {
  const courses = [
    { title: "JavaScript", instructor: "Akhil", date: "12/01/2025", price: "₹399" },
    { title: "Web Development", instructor: "Akhil", date: "14/01/2025", price: "₹749" },
    { title: "Python", instructor: "Akhil", date: "04/01/2025", price: "₹1099" }
  ];

  const { logout } = useAuthStore();
  const router = useRouter();
  
  return (
    <div className="flex flex-col h-screen">
      {/* Top Navbar */}
      <div className="bg-black text-white p-4 border-b border-gray-700 flex justify-between items-center">
        <div className="text-xl font-bold">Elevio</div>
        <div>...</div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        
        <AdminSidebar />

        {/* Main content */}
        <div className="flex-1 bg-black text-white overflow-auto">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="space-x-8 border-b border-gray-700">
                <button className="text-lg font-medium border-b-2 border-white pb-2 mr-4 text-white">All Courses</button>
                <button className="text-lg font-medium pb-2 text-gray-400 hover:text-white transition duration-300">Drafts</button>
              </div>
              {/* <div className="flex items-center">
                <button className="bg-black border border-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition duration-300">Create Course</button>
              </div> */}
            </div>

            <div className="bg-black border border-gray-700 rounded-sm">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-4">Course Title</th>
                    <th className="text-left p-4">Instructor</th>
                    <th className="text-left p-4">Created Date</th>
                    <th className="text-left p-4">Price</th>
                    <th className="text-left p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  {courses.map((course, index) => (
                    <tr key={index} className="border-b border-gray-800 hover:bg-gray-900 transition duration-300">
                      <td className="p-4">{course.title}</td>
                      <td className="p-4">{course.instructor}</td>
                      <td className="p-4">{course.date}</td>
                      <td className="p-4">{course.price}</td>
                      <td className="p-4">...</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center mt-6 space-x-2">
              <button className="bg-black border border-gray-600 text-white px-3 py-1 hover:bg-gray-800 transition duration-300">1</button>
              <button className="bg-gray-800 text-gray-300 px-3 py-1 hover:bg-gray-700 transition duration-300">2</button>
              <button className="bg-gray-800 text-gray-300 px-3 py-1 hover:bg-gray-700 transition duration-300">&gt;</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDashboard

