import Navbar from '@/components/tutor/navbar';
import TutorSidebar from '@/components/tutor/tutorSidebar';
import { Eye, Plus } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const InstructorDashboard = () => {
  const courses = [
    { id: 1, name: "Introduction to JavaScript", category: "Programming", status: "Published", students: 5 },
    { id: 2, name: "Advanced React Development", category: "Web Development", status: "Published", students: 3 },
    { id: 3, name: "UI/UX Design Principles", category: "Design", status: "Pending", students: 2 },
    { id: 4, name: "Data Science Fundamentals", category: "Data", status: "Published", students: 2 }
  ];

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Main Content Area with Sidebar and Content */}
      <div className="flex flex-grow">
        {/* Sidebar */}
        <TutorSidebar />

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-medium text-gray-800">Course List</h1>
            <Link href={"/tutor/courses/createcourse"} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-700">
              <Plus size={16} />
              <span>Add Course</span>
            </Link>
          </div>


          <div className="bg-white rounded-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="py-3 px-4 text-left font-medium text-gray-700">Course Name</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-700">Category</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-700">Status</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-700">Students</th>
                  <th className="py-3 px-4 text-center font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800">{course.name}</td>
                    <td className="py-3 px-4 text-gray-600">{course.category}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${course.status === "Published"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                        }`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{course.students}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center">
                        <button className="p-1 rounded hover:bg-gray-100" title="View Course">
                          <Eye size={18} className="text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;