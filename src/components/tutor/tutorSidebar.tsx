"use client";

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  FiGrid, 
  FiFileText, 
  FiUsers, 
  FiMessageSquare, 
  FiDollarSign, 
  FiCalendar, 
  FiLogOut, 
  FiChevronLeft, 
  FiChevronRight 
} from "react-icons/fi";
import useAuthStore from '@/store/tutorAuthStore';
import { toast } from 'react-toastify';

// Define the prop types for TutorSidebar
interface TutorSidebarProps {
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const menuItems = [
  { name: "Dashboard", icon: FiGrid, path: "/tutor/dashboard" },
  { name: "Course", icon: FiFileText, path: "/tutor/courses" },
  { name: "Students", icon: FiUsers, path: "/tutor/students" },
  { name: "Message", icon: FiMessageSquare, path: "/tutor/chat" },
  { name: "Earning", icon: FiDollarSign, path: "/tutor/earnings" },
  { name: "Scheduled session", icon: FiCalendar, path: "/tutor/sessions" },
];

const TutorSidebar = ({ expanded, setExpanded }: TutorSidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuthStore();

  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSidebarState = localStorage.getItem("sidebarExpanded");
      setExpanded(storedSidebarState ? JSON.parse(storedSidebarState) : true);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) setExpanded(false);
      else setExpanded(JSON.parse(localStorage.getItem("sidebarExpanded") ?? "true"));
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded((prev) => {
      const newState = !prev;
      localStorage.setItem("sidebarExpanded", JSON.stringify(newState));
      return newState;
    });
  };

  const handleLogout = async() => {
  try {
    await logout();
    localStorage.removeItem('authUserCheck');
    toast.success('Logged out successfully!');
    router.push('/tutor/login');
  } catch (error) {
    console.log('Logout error:', error);
    toast.error('Failed to log out. Please try again.');
  }
  };

  return (
    <aside 
      className={`h-full border-r border-gray-200 bg-white transition-all duration-300 
        ${expanded ? 'w-56' : 'w-16'}`}
    >
      <div className="flex flex-col items-center md:items-start h-full relative">
        <div 
          className={`flex items-center justify-between w-full px-4 py-4 cursor-pointer 
            ${pathname === "/tutor/dashboard" ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          onClick={() => router.push('/tutor/dashboard')}
        >
          <div className="flex items-center">
            <FiGrid className="w-6 h-6" />
            {expanded && <span className="ml-3 text-sm font-bold">Dashboard</span>}
          </div>
          {!isMobile && (
            <button className="ml-auto" onClick={toggleSidebar}>
              {expanded ? <FiChevronLeft className="w-5 h-5" /> : <FiChevronRight className="w-5 h-5" />}
            </button>
          )}
        </div>

        {menuItems.slice(1).map(({ name, icon: Icon, path }) => (
          <div
            key={name}
            className={`flex items-center w-full px-4 py-4 cursor-pointer transition-all 
              ${pathname.startsWith(path) ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={() => router.push(path)}
          >
            <Icon className="w-6 h-6" />
            {expanded && <span className="ml-3 text-sm font-bold">{name}</span>}
          </div>
        ))}

        <div
          className="flex items-center w-full px-4 py-4 text-gray-700 transition duration-300 ease-in-out 
            hover:bg-red-500 hover:bg-opacity-20 hover:text-red-400 cursor-pointer"
          onClick={handleLogout}
        >
          <FiLogOut className="w-6 h-6" />
          {expanded && <span className="ml-3 text-sm font-bold">Logout</span>}
        </div>
      </div>
    </aside>
  );
};

export default TutorSidebar;