'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  FiGrid, FiFileText, FiUsers, FiMessageSquare, 
  FiDollarSign, FiCalendar, FiLogOut, FiChevronLeft, FiChevronRight 
} from "react-icons/fi";
import useAuthStore from '@/store/tutorAuthStore';
import { toast } from 'react-toastify';

const menuItems = [
  { name: "Dashboard", icon: FiGrid, path: "/tutor/dashboard" },
  { name: "Course", icon: FiFileText, path: "/tutor/courses" },
  { name: "Students", icon: FiUsers, path: "/tutor/students" },
  { name: "Message", icon: FiMessageSquare, path: "/tutor/messages" },
  { name: "Earning", icon: FiDollarSign, path: "/tutor/earnings" },
  { name: "Scheduled session", icon: FiCalendar, path: "/tutor/sessions" },
];

const TutorSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuthStore();

  // const [expanded, setExpanded] = useState<boolean>(true);
  const [expanded, setExpanded] = useState<boolean>(() => {
    return JSON.parse(localStorage.getItem("sidebarExpanded") ?? "true");
  });
  
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Ensure localStorage is accessed only on the client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSidebarState = localStorage.getItem("sidebarExpanded");
      setExpanded(storedSidebarState ? JSON.parse(storedSidebarState) : true);
    }
  }, []);

  // Prevent hydration error by only setting localStorage in useEffect
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768; // Adjust width as needed
      setIsMobile(mobile);
      if (mobile) setExpanded(false); // Auto-collapse on mobile
      else setExpanded(JSON.parse(localStorage.getItem("sidebarExpanded") ?? "true"));
    };

    handleResize(); // Run on mount
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

  const handleLogout = () => {
    logout();
    localStorage.removeItem('authTutorCheck');
    toast.success('Logged out successfully!');
    router.push('/tutor/login');
  };

  return (
    <aside 
      className={`h-screen border-r border-gray-200 bg-white transition-all duration-300 
        ${expanded ? 'w-56' : 'w-16'}`}
    >
      <div className="flex flex-col items-center md:items-start h-full relative">
        {/* Dashboard with Toggle Button (Hidden on Mobile) */}
        <div 
          className={`flex items-center justify-between w-full px-4 py-4 cursor-pointer 
            ${pathname === "/tutor/dashboard" ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          onClick={() => router.push('/tutor/dashboard')}
        >
          <div className="flex items-center">
            <FiGrid className="w-6 h-6" />
            {expanded && <span className="ml-3 text-sm font-bold">Dashboard</span>}
          </div>
          {/* Hide toggle button on mobile */}
          {!isMobile && (
            <button className="ml-auto" onClick={toggleSidebar}>
              {expanded ? <FiChevronLeft className="w-5 h-5" /> : <FiChevronRight className="w-5 h-5" />}
            </button>
          )}
        </div>

        {/* Sidebar Menu Items */}
        {menuItems.slice(1).map(({ name, icon: Icon, path }) => (
          <div
            key={name}
            className={`flex items-center w-full px-4 py-4 cursor-pointer transition-all 
              ${pathname === path ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={() => router.push(path)}
          >
            <Icon className="w-6 h-6" />
            {expanded && <span className="ml-3 text-sm font-bold">{name}</span>}
          </div>
        ))}

        {/* Logout Button */}
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
