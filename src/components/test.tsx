import React from 'react';

const CourseDashboard = () => {
  const courses = [
    { title: "JavaScript", instructor: "Akhil", date: "12/01/2025", price: "₹399" },
    { title: "Web Development", instructor: "Akhil", date: "14/01/2025", price: "₹749" },
    { title: "Python", instructor: "Akhil", date: "04/01/2025", price: "₹1099" }
  ];

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navbar */}
      <div className="bg-black text-white p-4 border-b border-gray-700 flex justify-between items-center">
        <div className="text-xl font-bold">Elevio</div>
        <div>...</div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-black text-white border-r border-gray-700 p-6">
          <nav className="space-y-8">
            <div className="flex items-center space-x-3 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
              <span>Dashboard</span>
            </div>
            
            <div className="flex items-center space-x-3 bg-white bg-opacity-10 p-2 rounded text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5z" /></svg>
              <span>Course</span>
            </div>
            
            <div className="flex items-center space-x-3 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
              <span>Students</span>
            </div>
            
            <div className="flex items-center space-x-3 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
              <span>Message</span>
            </div>
            
            <div className="flex items-center space-x-3 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /></svg>
              <span>Earning</span>
            </div>
            
            <div className="flex items-center space-x-3 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /></svg>
              <span>Scheduled session</span>
            </div>
            
            <div className="flex items-center space-x-3 text-gray-300 mt-40">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
              <span>Logout</span>
            </div>
          </nav>
        </div>
        
        {/* Main content */}
        <div className="flex-1 bg-black text-white overflow-auto">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="space-x-8 border-b border-gray-700">
                <button className="text-lg font-medium border-b-2 border-white pb-2 mr-4 text-white">All Courses</button>
                <button className="text-lg font-medium pb-2 text-gray-400">Drafts</button>
              </div>
              <div className="flex items-center">
                <button className="bg-black border border-gray-700 text-white px-4 py-2 rounded">Create Course</button>
                <div className="ml-4 w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-black">
                  <span>AK</span>
                </div>
              </div>
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
                    <tr key={index} className="border-b border-gray-800">
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
              <button className="bg-black border border-gray-600 text-white px-3 py-1">1</button>
              <button className="bg-gray-800 text-gray-300 px-3 py-1">2</button>
              <button className="bg-gray-800 text-gray-300 px-3 py-1">&gt;</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDashboard;