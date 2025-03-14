'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import TutorSidebar from '@/components/tutor/tutorSidebar';
import Navbar from '@/components/tutor/navbar';

const AddCourseForm = () => {
  const router = useRouter();
  const [courseName, setCourseName] = useState('');
  const [category, setCategory] = useState('');

  const categories = [
    'Programming', 'Web Development', 'Design', 'Data', 
    'Marketing', 'Business', 'Photography', 'Music'
  ];

  const handleCancel = () => {
    router.push('/tutor/courses');
  };

  const handleCreate = () => {
    console.log('Creating course:', { courseName, category });
    router.push('/tutor/courses/add-section');
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <TutorSidebar />

        {/* Main Content */}
        <div className="flex flex-1 justify-center items-center bg-gray-50">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6 relative">
            <div className="flex items-center mb-6">
              {/* <button 
                onClick={handleCancel}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft size={20} />
                <span>Back to Courses</span>
              </button> */}
            </div>

            <h1 className="text-2xl font-bold text-black text-center mb-6">Add New Course</h1>

            <div className="space-y-6">
              {/* Course Name */}
              <div>
                <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-1">
                  Course Name
                </label>
                <input
                  type="text"
                  id="courseName"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter course name"
                />
              </div>

              {/* Category Selection */}
              <div className="relative">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-black z-50"
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  className="px-4 py-2 bg-black rounded-md text-white hover:bg-gray-800"
                  disabled={!courseName || !category}
                >
                  Create Course
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCourseForm;
