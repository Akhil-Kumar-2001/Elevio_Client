'use client'

import React from 'react'
import useAuthStore from '@/store/userAuthStore';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';


const Homepage = () => {
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout(); // Clear user authentication state
    localStorage.removeItem('authUserCheck');
    toast.success('Logged out successfully!');
    router.push('/login'); // Redirect to login page
  };
  return (
    <div>
      <h1>Hey this is home</h1>
      <button 
        onClick={handleLogout} 
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  )
}

export default Homepage
