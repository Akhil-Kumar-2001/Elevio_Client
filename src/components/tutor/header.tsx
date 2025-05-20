'use client';

import { getTutor } from "@/app/service/tutor/tutorApi";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/tutorAuthStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";

const Navbar = () => {
  interface TutorType {
    _id: string;
    username: string;
    email: string;
    status: number;
    role: string;
    createdAt: string;
    profile?: {
      profilePicture?: string;
    };
  }

  const router = useRouter();
  const [tutor, setTutor] = useState<TutorType | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [demo, setDemo] = useState<string | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);

  // Use Zustand store for auth
  const { user, logout } = useAuthStore();
  const tutorId = user?.id;

  const getImageTutor = async () => {
    if (!tutorId) {
      console.log("Tutor ID is missing! User may not be authenticated.");
      return;
    }
    try {
      const response = await getTutor(tutorId);
      setTutor(response.data);
      setImage(response.data.profile?.profilePicture || null);
      setDemo(response.data.username.charAt(0).toUpperCase());
    } catch (error) {
      console.error("Failed to fetch profile image:", error);
    }
  };

  // Toggle profile menu
  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    localStorage.removeItem('authTutorCheck');
    toast.success('Logged out successfully!');
    router.push('/tutor/login');
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showProfileMenu && !target.closest('.profile-menu') && !target.closest('.profile-icon')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  // Fetch initial data
  useEffect(() => {
    if (tutorId) {
      getImageTutor();
    }
  }, [tutorId]);

  return (
    <nav className="fixed top-0 z-50 w-full flex items-center justify-between px-12 py-3 border-b border-gray-200 bg-white">
      {/* Logo on the left */}
      <div className="flex items-center">
        <h1 className="font-bold text-black text-2xl">Elevio</h1>
      </div>

      {/* Profile on the Right */}
      <div className="flex items-center">
        {/* Profile Picture with Logout Menu */}
        <div className="relative profile-icon">
          <div className="flex items-center cursor-pointer" onClick={handleProfileClick}>
            {image ? (
              <Image
                src={image}
                alt="Tutor Profile"
                width={36}
                height={36}
                className="rounded-full w-9 h-9 object-cover"
              />
            ) : (
              <div className="bg-blue-100 text-blue-800 rounded-full h-9 w-9 flex items-center justify-center font-semibold">
                {demo || ""}
              </div>
            )}
          </div>
          {showProfileMenu && (
            <div className="absolute top-12 right-0 w-56 bg-white rounded-lg shadow-lg z-50 profile-menu overflow-hidden transition-all duration-200 ease-in-out transform origin-top scale-y-95 opacity-0 animate-dropdown">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-sm font-medium text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h3a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Inline CSS for dropdown animation */}
      <style jsx>{`
        @keyframes dropdown {
          from {
            opacity: 0;
            transform: scaleY(0.95);
          }
          to {
            opacity: 1;
            transform: scaleY(1);
          }
        }
        .animate-dropdown {
          animation: dropdown 0.2s ease-in-out forwards;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;