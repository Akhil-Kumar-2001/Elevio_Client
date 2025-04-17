"use client";

import { getDashboradDetails, getMonthlyIncome, getStudentSCount } from '@/app/service/tutor/tutorApi';
import Navbar from '@/components/tutor/navbar';
import TutorSidebar from '@/components/tutor/tutorSidebar';
import { IDashboardDetails } from '@/types/types';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const InstructorDashboard = () => {
  const [dashboardData, setDashboardData] = useState<IDashboardDetails>();
  const [monthlyIncome, setMonthlyIncome] = useState<{ name: string, income: number }[]>([]);
  const [studentsCount, setStudentsCount] = useState<{ name: string, students: number }[]>([]);
  const [expanded, setExpanded] = useState<boolean>(true); // Sync with TutorSidebar

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

  const fetchDashboardDetails = async () => {
    try {
      const response = await getDashboradDetails();
      if (response.success) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.log("Error while fetching dashboard details", error);
    }
  };

  const fetchMonthlyIncome = async () => {
    try {
      const response = await getMonthlyIncome();
      if (response.success) {
        setMonthlyIncome(response.data);
      }
    } catch (error) {
      console.log("Error while fetching monthly income", error);
    }
  };

  const fetchStudentsCount = async () => {
    try {
      const response = await getStudentSCount();
      if (response.success) {
        setStudentsCount(response.data);
      }
    } catch (error) {
      console.log("Error while fetching students count by course", error);
    }
  };

  useEffect(() => {
    fetchDashboardDetails();
    fetchMonthlyIncome();
    fetchStudentsCount();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 z-10 bg-white">
        <Navbar />
      </div>

      <div className="flex pt-16 min-h-screen bg-white">
        <div className="fixed left-0 top-16 bottom-0 z-10 bg-white">
          <TutorSidebar expanded={expanded} setExpanded={setExpanded} />
        </div>

        <div className={`flex-1 p-6 bg-white transition-all duration-300 ${expanded ? 'pl-64' : 'pl-24'}`}>
          <h1 className="text-2xl font-medium mb-6 text-gray-800">Instructor Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
              <div className="text-sm text-gray-600 mb-2">Total courses</div>
              <div className="text-2xl font-bold text-gray-800">{dashboardData?.courseCount}</div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
              <div className="text-sm text-gray-600 mb-2">Total Students</div>
              <div className="text-2xl font-bold text-gray-800">{dashboardData?.totalStudents}</div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
              <div className="text-sm text-gray-600 mb-2">Total Earnings</div>
              <div className="text-2xl font-bold text-green-600">₹ {dashboardData?.totalIncome}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
              <h2 className="text-sm font-medium mb-4 text-gray-800">Monthly Income</h2>
              <div className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyIncome}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 2500]} ticks={[0, 500, 1000, 1500, 2000, 2500]} />
                    <Tooltip formatter={(value) => [`₹${value}`, 'Income']} />
                    <Legend />
                    <Bar dataKey="income" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
              <h2 className="text-sm font-medium mb-4 text-gray-800">Students by Course</h2>
              <div className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={studentsCount}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="students"
                      nameKey="name"
                      label={({ name, percent }) => {
                        const isLongName = name.length > 15;
                        return isLongName ? `${name.substring(0, 12)}... ${(percent * 100).toFixed(0)}%` : `${name}: ${(percent * 100).toFixed(0)}%`;
                      }}
                    >
                      {studentsCount.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [`${value} students`, props.payload.name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 bg-white">
            <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
              <div className="text-sm font-medium mb-1 text-gray-800">Create new course</div>
              <div className="text-xs text-gray-600 mb-3">Start creating a new course for your students</div>
              <Link href={"/tutor/courses/createcourse"} className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded">
                Create Course
              </Link>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
              <div className="text-sm font-medium mb-1 text-gray-800">View All courses</div>
              <div className="text-xs text-gray-600 mb-3">Manage your existing courses</div>
              <Link href={"/tutor/courses"} className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded">
                View Courses
              </Link>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
              <div className="text-sm font-medium mb-1 text-gray-800">View Earnings</div>
              <div className="text-xs text-gray-600 mb-3">Check your earnings</div>
              <Link href={`/tutor/earnings`} className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1 rounded">
                View Earnings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;