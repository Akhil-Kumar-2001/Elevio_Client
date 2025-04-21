'use client'

import React, { useEffect, useState } from 'react'
import AdminSidebar from '@/components/admin/adminsidebar';
import Link from 'next/link';
import { DashboardData } from '@/types/types';
import { categoryIncome, getDashboardDatad, AdminMontlyIncome, AdminYearlyIncome } from '@/app/service/admin/adminApi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>()
  const [categoryIncomeData, setCategoryIncomeData] = useState<{ name: string, value: number }[]>([])
  const [adminIncomeData, setAdminIncomeData] = useState<{ month?: string, year?: number, income: number }[]>([])
  const [view, setView] = useState<"monthly" | "yearly">("monthly")

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const fetchDashboardData = async () => {
    try {
      const response = await getDashboardDatad();
      console.log("dba dsa", response.data);
      if (response.success) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.log("Error while fetching Dashboard data", error)
    }
  }

  const fetchAdminIncome = async (type: "monthly" | "yearly") => {
    try {
      const response = type === "monthly" ? await AdminMontlyIncome() : await AdminYearlyIncome();
      console.log(`${type} income`, response.data);
      if (response.success) {
        if (type === "monthly") {
          const transformedData = response.data.map((item: any) => ({
            month: item.month,
            income: item.income || 0
          }));
          setAdminIncomeData(transformedData);
        } else {
          setAdminIncomeData(response.data);
        }
      }
    } catch (error) {
      console.log(`Error while fetching admin ${type} income`, error)
    }
  }

  const fetchCategoryIncome = async () => {
    try {
      const response = await categoryIncome();
      console.log("category income", response.data);
      if (response.success) {
        const transformedData = response.data.map((item: { name: string, value: number }) => ({
          name: item.name,
          value: item.value / 100
        }));
        setCategoryIncomeData(transformedData);
      }
    } catch (error) {
      console.log("Error while fetching the category wise income", error)
    }
  }

  useEffect(() => {
    fetchDashboardData();
    fetchCategoryIncome();
    fetchAdminIncome(view);
  }, [])

  useEffect(() => {
    fetchAdminIncome(view);
  }, [view])

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navbar */}
      <div className="bg-black text-white p-4 border-b border-gray-700 flex justify-between items-center">
        <Link href={`/admin/dashboard`} className="text-xl font-bold">Elevio</Link>
        <div></div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />

        {/* Main content */}
        <div className="flex-1 bg-black text-white overflow-auto">
          <div className="p-5">
            <h1 className="text-xl font-semibold mb-4">Admin Dashboard</h1>

            {/* Dashboard Summary Cards - First Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-900 border border-gray-800 rounded-md p-4">
                <div className="text-gray-400 text-xs mb-1">Total Students</div>
                <div className="text-2xl font-bold">{dashboardData?.totalStudents}</div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-md p-4">
                <div className="text-gray-400 text-xs mb-1">Total Tutors</div>
                <div className="text-2xl font-bold">{dashboardData?.totalTutors}</div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-md p-4">
                <div className="text-gray-400 text-xs mb-1">Total Courses</div>
                <div className="text-2xl font-bold">{dashboardData?.totalCourses}</div>
              </div>
            </div>

            {/* Dashboard Summary Cards - Second Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-900 border border-gray-800 rounded-md p-4">
                <div className="text-gray-400 text-xs mb-1">Tutor Total Income</div>
                <div className="text-2xl font-bold">₹ {dashboardData?.tutorTotalIncome}</div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-md p-4">
                <div className="text-gray-400 text-xs mb-1">Admin Total Income</div>
                <div className="text-2xl font-bold">₹ {dashboardData?.adminTotalIncome}</div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-md p-4">
                <div className="text-gray-400 text-xs mb-1">Admin Balance</div>
                <div className="text-2xl font-bold">₹ {dashboardData?.adminBalance}</div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-900 border border-gray-800 rounded-md p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-sm font-medium">{view === "monthly" ? "Admin Monthly Income" : "Admin Yearly Income"}</div>
                  <div>
                    <label htmlFor="view" className="mr-2 text-sm text-gray-400">Select View:</label>
                    <select
                      id="view"
                      value={view}
                      onChange={(e) => setView(e.target.value as "monthly" | "yearly")}
                      className="text-sm border rounded  px-2 py-1 bg-gray-800 text-white"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={adminIncomeData}
                      margin={{ top: 10, right: 30, left: 30, bottom: 30 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis
                        dataKey={view === "monthly" ? "month" : "year"}
                        stroke="#999"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        stroke="#999"
                        domain={[0, 2500]}
                        ticks={[0, 500, 1000, 1500, 2000, 2500]}
                        tickFormatter={(value) => `₹${value}`}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#333', borderColor: '#666' }}
                        labelStyle={{ color: '#fff' }}
                        formatter={(value) => `₹${value}`}
                      />
                      <Legend wrapperStyle={{ paddingTop: 10 }} />
                      <Bar dataKey="income" name={view === "monthly" ? "Monthly Income (₹)" : "Yearly Income (₹)"} fill="#00C49F" barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-md p-4">
                <div className="text-sm font-medium mb-3">Tutors Income Distribution by Category</div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryIncomeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => {
                          const truncatedName = name.length > 10 ? `${name.slice(0, 10)}...` : name;
                          return `${truncatedName}: ${(percent * 100).toFixed(0)}%`;
                        }}
                      >
                        {categoryIncomeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => `₹${value}`}
                        contentStyle={{ backgroundColor: '#333', borderColor: '#666', color: '#fff' }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-900 border border-gray-800 rounded-md p-4">
                <div className="text-sm font-medium mb-1">Manage Students</div>
                <div className="text-gray-400 text-xs mb-3">View and manage all student accounts</div>
                <Link href={`/admin/studentsmanagement`} className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700 transition duration-300">
                  View Students
                </Link>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-md p-4">
                <div className="text-sm font-medium mb-1">Manage Tutors</div>
                <div className="text-gray-400 text-xs mb-3">View and manage tutor accounts</div>
                <Link href={`/admin/tutormanagement`} className="bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-700 transition duration-300">
                  View Tutors
                </Link>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-md p-4">
                <div className="text-sm font-medium mb-1">View Finances</div>
                <div className="text-gray-400 text-xs mb-3">Check financial reports and balance</div>
                <Link href={`/admin/admintransactions`} className="bg-yellow-600 text-white px-3 py-1 text-sm rounded hover:bg-yellow-700 transition duration-300">
                  Financial Reports
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;