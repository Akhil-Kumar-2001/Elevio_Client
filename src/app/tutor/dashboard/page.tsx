'use client'

import {
  getDashboradDetails,
  getMonthlyIncome,
  getStudentSCount,
  getYearlyIncome,
  getIncomeByDateRange,
} from '@/app/service/tutor/tutorApi';
import Navbar from '@/components/tutor/navbar';
import TutorSidebar from '@/components/tutor/tutorSidebar';
import { IDashboardDetails, IncomeData } from '@/types/types';
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
  Cell,
  TooltipProps,
} from 'recharts';
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const income = payload[0].value as number;
    const incomeColor = income > 0 ? 'text-green-600' : 'text-red-600';
    return (
      <div className="bg-white p-2 border border-gray-300 shadow-lg rounded">
        <p className="text-sm font-medium text-gray-900">{`Month: ${label}`}</p>
        <p className={`text-sm font-medium ${incomeColor}`}>{`Income: ₹${income}`}</p>
      </div>
    );
  }
  return null;
};

const InstructorDashboard = () => {
  const [dashboardData, setDashboardData] = useState<IDashboardDetails>();
  const [incomeData, setIncomeData] = useState<{ month?: string; year?: number; income: number }[]>([]);
  const [studentsCount, setStudentsCount] = useState<{ name: string, students: number }[]>([]);
  const [expanded, setExpanded] = useState<boolean>(true);
  const [view, setView] = useState<"monthly" | "yearly" | "custom">("monthly");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [tutorId, setTutorId] = useState<string>("");

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

  const fetchDashboardDetails = async () => {
    try {
      const response = await getDashboradDetails();
      if (response.success) {
        setDashboardData(response.data);
        setTutorId(response.data.tutorId || "someTutorId");
      }
    } catch (error) {
      console.log("Error while fetching dashboard details", error);
    }
  };

  const fetchIncomeData = async (type: "monthly" | "yearly" | "custom", start?: Date, end?: Date) => {
    try {
      let response;
      if (type === "custom" && start && end && tutorId) {
        response = await getIncomeByDateRange(start.toISOString(), end.toISOString());
      } else {
        response = type === "monthly" ? await getMonthlyIncome() : await getYearlyIncome();
      }
      console.log(`${type} income from backend`, response.data);
      if (response.success) {
        if (type === "monthly" || type === "custom") {
          const transformedData = response.data.map((item: IncomeData) => ({
            month: item.month || item.date,
            income: item.income || 0,
          }));
          setIncomeData(transformedData);
        } else {
          setIncomeData(response.data);
        }
      }
    } catch (error) {
      console.log(`Error while fetching ${type} income`, error);
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
    fetchStudentsCount();
    if (view === "custom" && startDate && endDate && tutorId) {
      fetchIncomeData(view, startDate, endDate);
    } else {
      fetchIncomeData(view);
    }
  }, [view, startDate, endDate, tutorId]);

  const formatXAxisTick = (value: string) => {
    if (view === "yearly") {
      return value.toString();
    }
    if (view === "monthly") {
      return value.slice(0, 3);
    }
    const [month, year] = value.split(' ');
    const shortMonth = month.slice(0, 3);
    return `${shortMonth} ${year}`;
  };

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
            <div className="chart-section border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-medium text-gray-800">
                  {view === "monthly" ? "Monthly Income" : view === "yearly" ? "Yearly Income" : "Income (Custom Range)"}
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="select-wrapper">
                    <label htmlFor="view" className="mr-2 text-sm text-gray-700">Select View:</label>
                    <select
                      id="view"
                      value={view}
                      onChange={(e) => setView(e.target.value as "monthly" | "yearly" | "custom")}
                      className="text-sm border rounded text-black px-2 py-1"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                      <option value="custom">Custom Range</option>
                    </select>
                  </div>
                  {view === "custom" && (
                    <div className="custom-date-picker">
                      <div className="flex flex-col">
                        <label className="text-sm text-gray-700">Start Date:</label>
                        <DatePicker
                          selected={startDate}
                          onChange={(date: Date | null) => setStartDate(date)}
                          selectsStart
                          startDate={startDate}
                          endDate={endDate}
                          className="text-sm border rounded px-2 py-1 text-black w-40"
                          placeholderText="Select start date"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm text-gray-700">End Date:</label>
                        <DatePicker
                          selected={endDate}
                          onChange={(date: Date | null) => setEndDate(date)}
                          selectsEnd
                          startDate={startDate}
                          endDate={endDate}
                          minDate={startDate ?? undefined}
                          className="text-sm border rounded px-2 py-1 text-black w-40"
                          placeholderText="Select end date"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="chart-container h-96 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={incomeData}
                    margin={{ top: 10, right: 30, left: 20, bottom: 80 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey={view === "monthly" ? "month" : view === "yearly" ? "year" : "month"}
                      type="category"
                      allowDuplicatedCategory={false}
                      angle={-45}
                      textAnchor="end"
                      height={70}
                      interval="preserveStartEnd"
                      tick={{ fontSize: 12 }}
                      tickFormatter={formatXAxisTick}
                    />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
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