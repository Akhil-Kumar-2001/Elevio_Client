
'use client';
import { useRouter, usePathname } from 'next/navigation'; // Add usePathname
import { toast } from 'react-toastify';
import { FiGrid, FiUsers, FiCheckCircle, FiCircle, FiFolder, FiLogOut, FiDollarSign } from 'react-icons/fi';
import useAdminAuthStore from '@/store/adminAuthStore';

const AdminSidebar = () => {
  const router = useRouter();
  const pathname = usePathname(); // Get the current pathname
  const { logout } = useAdminAuthStore();

  const menuItems = [
    { label: 'Dashboard', icon: <FiGrid size={24} />, path: '/admin/dashboard' },
    { label: 'Tutor Management', icon: <FiUsers size={24} />, path: '/admin/tutormanagement' },
    { label: 'Students Management', icon: <FiUsers size={24} />, path: '/admin/studentsmanagement' },
    { label: 'Tutor Verification', icon: <FiCheckCircle size={24} />, path: '/admin/tutorverification' },
    { label: 'Course Verification', icon: <FiCheckCircle size={24} />, path: '/admin/courseverification' },
    { label: 'Tutor Earnings', icon: <FiDollarSign size={24} />, path: '/admin/tutorearnings' },
    { label: 'Subscription', icon: <FiCircle size={24} />, path: '/admin/subscription' },
    { label: 'Category', icon: <FiFolder size={24} />, path: '/admin/category' },
  ];

  const handleLogout = () => {
    logout();
    localStorage.removeItem('authUserCheck');
    toast.success('Logged out successfully!');
    router.push('/admin/login');
  };

  return (
    <div className="w-64 bg-black text-white border-r border-gray-700 p-6 flex flex-col min-h-screen">
      {/* Sidebar Navigation */}
      <nav className="space-y-4 flex-1">
        {menuItems.map((item) => (
          <div
            key={item.label}
            className={`flex items-center space-x-3 p-2 rounded transition duration-300 ease-in-out cursor-pointer ${
              pathname === item.path
                ? 'bg-white bg-opacity-20 text-white' // Active style
                : 'text-gray-300 hover:bg-white hover:bg-opacity-10 hover:text-white' // Inactive style
            }`}
            onClick={() => router.push(item.path)}
          >
            {item.icon}
            <span className="whitespace-nowrap">{item.label}</span>
          </div>
        ))}
        {/* Logout Button (Sticks to the Bottom) */}
        <div
          className="flex items-center space-x-3 text-gray-300 p-2 rounded transition duration-300 ease-in-out hover:bg-red-500 hover:bg-opacity-20 hover:text-red-400 cursor-pointer mt-auto"
          onClick={handleLogout}
        >
          <FiLogOut size={24} />
          <span>Logout</span>
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;