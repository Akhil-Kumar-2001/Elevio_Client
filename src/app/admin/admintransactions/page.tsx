'use client'
import React, { useEffect, useState } from 'react'
import AdminSidebar from '@/components/admin/adminsidebar'
import Link from 'next/link'
import { getAdminWallet, getStudentsData } from '@/app/service/admin/adminApi'
import Table from '@/components/table'
import Pagination from '@/components/admin/paginaiton'

interface TransactionType {
  _id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  date: string;
  relatedUserId: string;
  userType: string;
  referenceId: string;
  [key: string]: string | number;}

interface WalletType {
  _id: string;
  email: string;
  balance: number;
  totalRevenue: number;
  totalOutflow: number;
  transactions: TransactionType[];
  isActive: boolean;
  lastTransactionDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface StudentType {
  _id: string;
  username: string;
  email: string;
  status: number;
  role: string;
  createdAt: string;
}

const AdminTransactions = () => {
  const [wallet, setWallet] = useState<WalletType | null>(null);
  const [students, setStudents] = useState<StudentType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Map to quickly look up student by ID
  const studentMap = students.reduce((acc, student) => {
    acc[student._id] = student;
    return acc;
  }, {} as Record<string, StudentType>);

  const fetchAdminWallet = async () => {
    try {
      const response = await getAdminWallet(currentPage,5);
      if (response.success) {
        setWallet(response.data);
        setTotalPages(Math.ceil(response.data.totalRecord / 5));
      }
    } catch (error) {
      console.log("Error while fetching admin wallet", error);
    }
  }

  const fetchStudents = async () => {
    try {
      const response = await getStudentsData();
      if (response.success) {
        setStudents(response.data);
      }
    } catch (error) {
      console.log("Error while fetching students", error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchAdminWallet(), fetchStudents()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  console.log("students data", students)

  // Define table columns
  const columns = [
    {
      field: "date",
      header: "Date",
      render: (row: TransactionType) => formatDate(row.date)
    },
    {
      field: "amount",
      header: "Amount",
      render: (row: TransactionType) => (
        <span className={row.type === 'credit' ? 'text-green-400' : 'text-red-400'}>
          {row.type === 'credit' ? '+' : '-'}₹{row.amount}
        </span>
      )
    },
    {
      field: "type",
      header: "Type",
      render: (row: TransactionType) => (
        <span className={`px-2 py-1 rounded text-xs ${row.type === 'credit' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
          }`}>
          {row.type.toUpperCase()}
        </span>
      )
    },
    {
      field: "relatedUserId",
      header: "Student",
      render: (row: TransactionType) => {
        if (row.userType === "Student") {
          const student = studentMap[row.relatedUserId];
          return student ? student.username : "Unknown Student";
        }
        return "N/A";
      }
    },
    // {
    //   field: "description",
    //   header: "Description",
    //   render: (row: TransactionType) => (
    //     <span className="truncate max-w-xs block">{row.description}</span>
    //   )
    // },
    {
      field: "referenceId",
      header: "Reference ID",
      render: (row: TransactionType) => (
        <span className="text-xs text-gray-400">{row.referenceId.substring(0, 10)}...</span>
      )
    }
  ];

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

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
            <h1 className="text-xl font-semibold mb-4">Admin Transactions</h1>

            {/* Wallet Summary */}
            {wallet && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <h3 className="text-gray-400 text-sm">Current Balance</h3>
                  <p className="text-2xl font-bold text-white">₹{wallet.balance}</p>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <h3 className="text-gray-400 text-sm">Total Revenue</h3>
                  <p className="text-2xl font-bold text-green-400">₹{wallet.totalRevenue}</p>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <h3 className="text-gray-400 text-sm">Total Outflow</h3>
                  <p className="text-2xl font-bold text-red-400">₹{wallet.totalOutflow}</p>
                </div>
              </div>
            )}

            {/* Transactions Table */}
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-400">Loading transaction data...</p>
              </div>
            ) : wallet ? (
              <div>
                <h2 className="text-lg font-medium mb-3">Transaction History</h2>
                <Table<TransactionType>
                  columnArray={columns}
                  dataArray={wallet.transactions}
                />
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No transaction data available</p>
              </div>
            )}
            <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTransactions;