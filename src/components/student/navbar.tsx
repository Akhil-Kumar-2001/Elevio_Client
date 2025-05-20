
'use client';

import { useEffect, useState, useRef } from 'react';
import useAuthStore from '@/store/userAuthStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getStudent, cartData, wishlistData } from '../../app/service/user/userApi';
import { useCartCountStore } from '@/store/cartCountStore';
import { toast } from 'react-toastify';
import {
  HomeIcon,
  BookOpenIcon,
  AcademicCapIcon,
  InformationCircleIcon,
  CalendarIcon,
  Bars3Icon,
  UserIcon,
  ChatBubbleLeftIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [image, setImage] = useState(null);
  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuthStore();
  const { cartCount, setCartCount } = useCartCountStore();
  const { wishlistCount, setWishlistCount } = useCartCountStore();
  const studentId = user?.id;
  const { logout } = useAuthStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  console.log(student);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('authUserCheck');
    toast.success('Logged out successfully!');
    router.push('/login');
  };

  const fetchCartCount = async () => {
    if (!studentId) return;
    try {
      const response = await cartData(studentId);
      if (response.success) {
        setCartCount(response.data.items.length);
      }
    } catch (error) {
      console.log('Failed to fetch cart data:', error);
    }
  };

  const fetchWishlistCount = async () => {
    try {
      const response = await wishlistData();
      if (response.success) {
        setWishlistCount(response.data.length);
      }
    } catch (error) {
      console.log('Failed to fetch wishlist data:', error);
    }
  };

  useEffect(() => {
    if (!studentId) return;

    const getImageStudent = async () => {
      try {
        setLoading(true);
        const response = await getStudent();
        if (response.success) {
          setStudent(response.data);
          setImage(response.data.profilePicture || null);
          setInitial(response.data.username?.charAt(0).toUpperCase() || null);
        } else {
          setError('Failed to fetch profile image');
        }
      } catch (error) {
        console.log(error);
        setError('Failed to fetch profile image');
      } finally {
        setLoading(false);
      }
    };

    getImageStudent();
    fetchCartCount();
    fetchWishlistCount();
  }, [studentId]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (
        isDropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        isMobileMenuOpen &&
        target.closest('.mobile-menu') === null &&
        target.closest('.mobile-menu-button') === null
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen, isMobileMenuOpen]);

  return (
    <>
      <style jsx global>{`
        @keyframes dropdown-open {
          0% {
            transform: scale(0.95);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-dropdown-open {
          animation: dropdown-open 0.2s ease-out forwards;
        }
      `}</style>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 px-12 bg-white border-b border-gray-200">
        {/* Logo */}
        <Link href="/home" className="flex items-center">
          <div className="flex items-center">
            <div className="relative flex items-center justify-center w-10 h-10 bg-blue-500 rounded-md shadow-md mr-2 transform rotate-12 transition-transform duration-200 hover:scale-105">
              <span className="text-white font-bold text-xl transform -rotate-12">E</span>
            </div>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-gray-800 tracking-tight">ELE</span>
              <span className="text-2xl font-bold text-blue-500 tracking-tight">VIO</span>
            </div>
          </div>
        </Link>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-gray-700 hover:text-blue-500 focus:outline-none mobile-menu-button transition-transform duration-200 hover:scale-110"
            aria-label="Toggle menu"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links and Icons (Desktop) */}
        <div className="hidden md:flex md:items-center">
          <div className="flex items-center space-x-6">
            <Link
              href="/home"
              className="flex items-center text-gray-700 hover:text-blue-500 transition-all duration-200 hover:scale-105 hover:underline"
            >
              <HomeIcon className="w-5 h-5 mr-1" />
              Home
            </Link>
            <Link
              href="/mylearning"
              className="flex items-center text-gray-700 hover:text-blue-500 transition-all duration-200 hover:scale-105 hover:underline"
            >
              <BookOpenIcon className="w-5 h-5 mr-1" />
              My Learning
            </Link>
            <Link
              href="/courses"
              className="flex items-center text-gray-700 hover:text-blue-500 transition-all duration-200 hover:scale-105 hover:underline"
            >
              <AcademicCapIcon className="w-5 h-5 mr-1" />
              Courses
            </Link>
            <Link
              href="/about"
              className="flex items-center text-gray-700 hover:text-blue-500 transition-all duration-200 hover:scale-105 hover:underline"
            >
              <InformationCircleIcon className="w-5 h-5 mr-1" />
              About
            </Link>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-6 ml-10">
            <div className="relative">
              <Link
                href="/wishlist"
                className="text-gray-700 hover:text-blue-500 transition-all duration-200 hover:scale-110 hover:opacity-80"
                aria-label="Wishlist"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </Link>
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </div>

            <div className="relative">
              <Link
                href="/cart"
                className="text-gray-700 hover:text-blue-500 transition-all duration-200 hover:scale-110 hover:opacity-80"
                aria-label="Cart"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </Link>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>

            <div className="relative profile-dropdown" ref={dropdownRef}>
              <div
                className="flex items-center bg-blue-50 rounded-full h-10 cursor-pointer overflow-hidden transition-all duration-200 hover:bg-blue-100 hover:scale-105 hover:shadow-md"
                onClick={toggleDropdown}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && toggleDropdown(e)}
                aria-label="Open profile menu"
              >
                <div className="flex-shrink-0">
                  {loading ? (
                    <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                  ) : error ? (
                    <div className="bg-blue-100 text-blue-800 rounded-full h-10 w-10 flex items-center justify-center font-semibold">
                      ?
                    </div>
                  ) : image ? (
                    <Image
                      src={image}
                      alt="Tutor Profile"
                      width={40}
                      height={40}
                      className="rounded-full w-10 h-10 object-cover"
                    />
                  ) : (
                    <div
                      className="bg-blue-100 text-blue-800 rounded-full h-10 w-10 flex items-center justify-center font-semibold"
                      aria-label={`Profile initial: ${initial || 'Unknown'}`}
                    >
                      {initial || '?'}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-center w-10 h-10">
                  <Bars3Icon className="w-5 h-5 text-gray-600" />
                </div>
              </div>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-2xl py-2 z-50 transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-dropdown-open">
                  <Link
                    href={`/profile/${studentId}`}
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-sm font-medium transition-colors duration-200 rounded-md mx-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDropdownOpen(false);
                    }}
                  >
                    <UserIcon className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                  <hr className="my-2 border-gray-200 mx-2" />
                  <Link
                    href="/chat"
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-sm font-medium transition-colors duration-200 rounded-md mx-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDropdownOpen(false);
                    }}
                  >
                    <ChatBubbleLeftIcon className="w-4 h-4 mr-2" />
                    Messages
                  </Link>
                  <hr className="my-2 border-gray-200 mx-2" />
                  <div
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-sm font-medium transition-colors duration-200 rounded-md mx-2 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLogout();
                      setIsDropdownOpen(false);
                    }}
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                    Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-lg py-4 z-40 mobile-menu">
            <div className="flex flex-col items-center space-y-4">
              <input
                type="text"
                placeholder="Search for anything..."
                className="w-11/12 px-4 py-3 text-base text-gray-500 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ height: '40px' }}
              />
              <Link
                href="/home"
                className="flex items-center text-gray-700 hover:text-blue-500 text-lg transition-all duration-200 hover:scale-105 hover:underline"
                onClick={toggleMobileMenu}
              >
                <HomeIcon className="w-5 h-5 mr-2" />
                Home
              </Link>
              <Link
                href="/mylearning"
                className="flex items-center text-gray-700 hover:text-blue-500 text-lg transition-all duration-200 hover:scale-105 hover:underline"
                onClick={toggleMobileMenu}
              >
                <BookOpenIcon className="w-5 h-5 mr-2" />
                My Learning
              </Link>
              <Link
                href="/courses"
                className="flex items-center text-gray-700 hover:text-blue-500 text-lg transition-all duration-200 hover:scale-105 hover:underline"
                onClick={toggleMobileMenu}
              >
                <AcademicCapIcon className="w-5 h-5 mr-2" />
                Courses
              </Link>
              <Link
                href="/about"
                className="flex items-center text-gray-700 hover:text-blue-500 text-lg transition-all duration-200 hover:scale-105 hover:underline"
                onClick={toggleMobileMenu}
              >
                <InformationCircleIcon className="w-5 h-5 mr-2" />
                About
              </Link>
              <Link
                href="/sessions"
                className="flex items-center text-gray-700 hover:text-blue-500 text-lg transition-all duration-200 hover:scale-105 hover:underline"
                onClick={toggleMobileMenu}
              >
                <CalendarIcon className="w-5 h-5 mr-2" />
                Sessions
              </Link>
              <hr className="w-11/12 my-2" />
              <Link
                href="/wishlist"
                className="flex items-center text-gray-700 hover:text-blue-500 text-lg transition-all duration-200 hover:scale-105"
                onClick={toggleMobileMenu}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                Wishlist
                {wishlistCount > 0 && (
                  <span className="ml-2 bg-purple-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link
                href="/cart"
                className="flex items-center text-gray-700 hover:text-blue-500 text-lg transition-all duration-200 hover:scale-105"
                onClick={toggleMobileMenu}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Cart
                {cartCount > 0 && (
                  <span className="ml-2 bg-purple-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <div className="relative w-11/12 profile-dropdown" ref={dropdownRef}>
                <div
                  className="flex justify-center items-center bg-blue-50 rounded-full h-10 cursor-pointer overflow-hidden transition-all duration-200 hover:bg-blue-100 hover:scale-105 hover:shadow-md"
                  onClick={toggleDropdown}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && toggleDropdown(e)}
                  aria-label="Open profile menu"
                >
                  <div className="flex-shrink-0">
                    {loading ? (
                      <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                    ) : error ? (
                      <div className="bg-blue-100 text-blue-800 rounded-full h-10 w-10 flex items-center justify-center font-semibold">
                        ?
                      </div>
                    ) : image ? (
                      <Image
                        src={image}
                        alt="Tutor Profile"
                        width={40}
                        height={40}
                        className="rounded-full w-10 h-10 object-cover"
                      />
                    ) : (
                      <div
                        className="bg-blue-100 text-blue-800 rounded-full h-10 w-10 flex items-center justify-center font-semibold"
                        aria-label={`Profile initial: ${initial || 'Unknown'}`}
                      >
                        {initial || '?'}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-center w-10 h-10">
                    <Bars3Icon className="w-5 h-5 text-gray-600" />
                  </div>
                </div>
                {isDropdownOpen && (
                  <div className="w-full bg-white border border-gray-100 rounded-xl shadow-2xl py-2 mt-2 z-50 transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-dropdown-open">
                    <Link
                      href={`/profile/${studentId}`}
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-base font-medium transition-colors duration-200 rounded-md mx-2 text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDropdownOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <UserIcon className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                    <hr className="my-2 border-gray-200 mx-2" />
                    <Link
                      href="/chat"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-base font-medium transition-colors duration-200 rounded-md mx-2 text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDropdownOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <ChatBubbleLeftIcon className="w-4 h-4 mr-2" />
                      Messages
                    </Link>
                    <hr className="my-2 border-gray-200 mx-2" />
                    <div
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-base font-medium transition-colors duration-200 rounded-md mx-2 text-center cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLogout();
                        setIsDropdownOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                      Logout
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;