'use client'

import React from 'react'
import useAuthStore from '@/store/tutorAuthStore';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';


const page = () => {
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout(); // Clear user authentication state
    localStorage.removeItem('authTutorCheck');
    toast.success('Logged out successfully!');
    router.push('/tutor/login'); // Redirect to login page
  };
  return (
    <div>
      <h1>Hey this is tutor home</h1>
      <button 
        onClick={handleLogout} 
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  )
}

export default page
