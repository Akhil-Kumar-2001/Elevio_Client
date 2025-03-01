import Navbar from '@/components/tutor/navbar';
import TutorSidebar from '@/components/tutor/tutorSidebar';
import withAuth from '@/HOC/tutorProtectedRoutes';
import React from 'react';

const InstructorDashboard = () => {
  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Top Navigation Bar */}
      <Navbar  />
      
      {/* Main Content Area with Sidebar and Content */}
      <div className="flex flex-grow">

        {/* Sidebar - Increased width from w-36 to w-56 */}
        <TutorSidebar />
        
        {/* Main Content */}
        <div className="flex-grow p-6 bg-white">
          <h1 className="text-xl font-medium mb-6 text-gray-800">Instructor Dashboard</h1>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            {/* Total courses card */}
            <div className="border border-gray-200 rounded p-4 bg-white">
              <div className="text-sm text-gray-600 mb-2">Total courses</div>
              <div className="text-xl font-medium text-gray-800">4</div>
            </div>
            
            {/* Total Students card */}
            <div className="border border-gray-200 rounded p-4 bg-white">
              <div className="text-sm text-gray-600 mb-2">Total Students</div>
              <div className="text-xl font-medium text-gray-800">12</div>
            </div>
            
            {/* Total Earnings card */}
            <div className="border border-gray-200 rounded p-4 bg-white">
              <div className="text-sm text-gray-600 mb-2">Total Earnings</div>
              <div className="text-xl font-medium text-gray-800">₹ 7250</div>
            </div>
          </div>
          
          {/* Action Cards */}
          <div className="grid grid-cols-3 gap-6">
            {/* Create new course card */}
            <div className="border border-gray-200 rounded p-4 bg-white">
              <div className="text-sm font-medium mb-1 text-gray-800">Create new course</div>
              <div className="text-xs text-gray-600 mb-3">Start creating a new course for your students</div>
              <button className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded">
                Create Course
              </button>
            </div>
            
            {/* View All courses card */}
            <div className="border border-gray-200 rounded p-4 bg-white">
              <div className="text-sm font-medium mb-1 text-gray-800">View All courses</div>
              <div className="text-xs text-gray-600 mb-3">Manage your existing courses</div>
              <button className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded">
                View Courses
              </button>
            </div>
            
            {/* View Earnings card */}
            <div className="border border-gray-200 rounded p-4 bg-white">
              <div className="text-sm font-medium mb-1 text-gray-800">View Earnings</div>
              <div className="text-xs text-gray-600 mb-3">Check your earnings</div>
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1 rounded">
                View Earnings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard