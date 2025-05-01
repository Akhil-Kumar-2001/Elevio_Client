'use client'

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Table from '../../../components/table';
import { getTutorsWallets, getTutorsList } from '@/app/service/admin/adminApi';
import AdminSidebar from '@/components/admin/adminsidebar';
import { useRouter } from 'next/navigation';
import Pagination from '@/components/admin/paginaiton';
import Link from 'next/link';

const TutorEarnings = () => {
  const router = useRouter();
  
  interface TutorType {
    _id: string;
    username: string;
    email: string;
    status: number;
    role: string;
    createdAt: string;
  }

  interface WalletType {
    _id: string;
    tutorId: string;
    balance: number;
    totalEarnings: number;
    totalWithdrawn: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }

  interface CombinedDataType {
    _id: string;
    tutorId: string;
    name: string;
    email: string;
    balance: number;
    totalEarnings: number;
    totalWithdrawn: number;
    [key: string]: string | number; // Add index signature
  }

  const [combinedData, setCombinedData] = useState<CombinedDataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const tableColumn = [
    { header: "Name", field: "name" },
    { header: "Email", field: "email" },
    { header: "Total Earnings", field: "totalEarnings" },
    { header: "Total Withdrawn", field: "totalWithdrawn" },
    { header: "Balance", field: "balance" }
  ];

  const fetchTutorsWallets = async () => {
    setLoading(true);
    try {
      // Get wallets data
      const walletData = await getTutorsWallets(currentPage, 5);
      if (walletData && walletData.success) {
        setTotalPages(Math.ceil(walletData.data.totalRecord / 5));
        
        // Get all tutors for matching
        const tutorData = await getTutorsList();
        if (tutorData && tutorData.success) {
          
          // Combine wallet and tutor data
          const combined = walletData.data.wallets.map((wallet: WalletType) => {
            const tutor = tutorData.data.find((t: TutorType) => t._id === wallet.tutorId);
            return {
              _id: wallet._id,
              tutorId: wallet.tutorId,
              name: tutor ? tutor.username : 'Unknown',
              email: tutor ? tutor.email : 'Unknown',
              balance: wallet.balance,
              totalEarnings: wallet.totalEarnings,
              totalWithdrawn: wallet.totalWithdrawn
            };
          });
          
          setCombinedData(combined);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch tutor earnings data');
    } finally {
      setLoading(false);
    }
  };

  const viewProfile = (tutorId: string) => {
    router.push(`/admin/tutor-profile/${tutorId}`);
  };

  useEffect(() => {
    fetchTutorsWallets();
  }, [currentPage]);

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-black text-white p-4 border-b border-gray-700 flex justify-between items-center">
      <Link href={`/admin/dashboard`} className="text-xl font-bold">Elevio</Link>      </div>

      <div className="flex flex-1 overflow-hidden">
        <div>
          <AdminSidebar />
        </div>

        <div className="flex-1 bg-black text-white overflow-auto">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="space-x-8 border-b border-gray-700">
                <button className="text-lg font-medium border-b-2 border-white pb-2 mr-4 text-white">Tutor Earnings</button>
              </div>
              {loading && <div className="text-gray-400">Loading...</div>}
            </div>

            <Table
              columnArray={tableColumn}
              dataArray={combinedData}
              pageRole={'tutor-earnings-profile'} // Use new pageRole
              pageTutorEarningsFunction={viewProfile} // Pass viewProfile to new prop
            />
            <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorEarnings;