"use client"
import { getDashboradDetails, getTutorTransactions } from '@/app/service/tutor/tutorApi';
import Navbar from '@/components/tutor/navbar';
import Pagination from '@/components/tutor/pagenation';
import Table from '@/components/tutor/tutorTable'; // Adjust this import path to where your Table component is located
import TutorSidebar from '@/components/tutor/tutorSidebar';
import React, { useEffect, useState } from 'react';
import { IDashboardDetails } from '@/types/types';

// Transaction interface to match your data structure
interface Transaction {
    _id: string;
    amount: number;
    type: string;
    description: string;
    date: string;
    studentId: string;
    referenceId: string;
}

const InstructorEarnings = () => {

    const [dashboardData, setDashboarData] = useState<IDashboardDetails>()
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<boolean>(true); // Sync with TutorSidebar



    // Define columns for the transaction table
    const transactionColumns = [
        {
            field: "date",
            header: "Date",
            render: (row: Transaction) => formatDate(row.date)
        },
        {
            field: "description",
            header: "Description"
        },
        {
            field: "type",
            header: "Type",
            render: (row: Transaction) => (
                <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${row.type === "credit"
                        ? "bg-green-100 text-green-800"
                        : row.type === "withdrawal"
                            ? "bg-blue-100 text-blue-800"
                            : row.type === "refund"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                        }`}
                >
                    {row.type}
                </span>
            )
        },
        {
            field: "amount",
            header: "Amount",
            render: (row: Transaction) => (
                <span className={row.type === "credit" ? "text-green-600" : "text-red-600"}>
                    ₹{row.amount.toFixed(2)}
                </span>
            )
        }
    ];

    // Function to format dates consistently
    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
        });
    };

    const fetchDashboardDetails = async () => {
        try {
            const response = await getDashboradDetails();
            if (response.success) {
                setDashboarData(response.data)
            }
        } catch (error) {
            console.log("Error while fetching monthly income", error);
        }
    }

    const fetchTutorTransaction = async () => {
        try {
            setLoading(true);
            const response = await getTutorTransactions(currentPage, 5); // Pass tutorId
            console.log("tutor transactions", response);
            if (response.success) {
                setTransactions(response.data.transactions);
                // Set totalPages based on total from the response
                setTotalPages(Math.ceil(response.data.total / 5));
            }
        } catch (error) {
            console.log("Error while fetching transactions", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardDetails()
        fetchTutorTransaction();
    }, [currentPage]); // Re-fetch when page changes

    console.log("current page of transaction", currentPage)

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Navigation Bar */}
            <div className="fixed top-0 left-0 right-0 z-10 bg-white">
                <Navbar />
            </div>

            {/* Main Content Area with Sidebar and Content */}
            <div className="flex pt-16 flex-1">
                {/* Fixed Sidebar */}
                <div className="fixed left-0 top-16 bottom-0 z-10 bg-white">
                    <TutorSidebar expanded={expanded} setExpanded={setExpanded} />
                </div>

                {/* Main Content */}
                <div className={`flex-grow p-6 bg-gray-50 flex flex-col min-h-full transition-all duration-300 ${expanded ? `ml-64` :`ml-16`}`}>
                    <h1 className="text-2xl font-medium mb-6 text-gray-800">Instructor Earnings</h1>

                    {/* Transaction Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-sm text-gray-500 mb-1">Total Earnings</h3>
                            <p className="text-2xl font-bold text-green-600">
                                ₹{dashboardData?.totalIncome}
                            </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-sm text-gray-500 mb-1">Transactions</h3>
                            <p className="text-2xl font-bold text-gray-800">{dashboardData?.totalTransactions}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-sm text-gray-500 mb-1">Last Transaction</h3>
                            <p className="text-2xl font-bold text-gray-800">
                                {dashboardData?.lastTransactionDate ? formatDate(dashboardData.lastTransactionDate.toString()) : "N/A"}
                            </p>
                        </div>
                    </div>

                    {/* Transaction Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                        <div className="p-4 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-800">Transaction History</h2>
                        </div>
                        <div className="p-4">
                            {loading ? (
                                <div className="text-center py-8">Loading transactions...</div>
                            ) : (
                                <Table
                                    columnArray={transactionColumns}
                                    dataArray={transactions}
                                    actions={false}
                                />
                            )}
                        </div>
                    </div>

                    {/* Pagination Controls */}
                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    );
};

export default InstructorEarnings;