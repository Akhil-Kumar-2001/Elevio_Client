'use client';

import { useEffect, useState } from 'react';
import useAuthStore from '@/store/userAuthStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getStudent, cartData } from '../../app/service/user/userApi';
import { useCartCountStore } from '@/store/cartCountStore';
import { toast } from 'react-toastify';

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
  const studentId = user?.id;
  const { logout } = useAuthStore();

  // const fetchStudentDetails = async () => {
  //   if (!studentId) return;
  //   try {
  //     setLoading(true);
  //     const response = await getStudent();
  //     if (response.success) {
  //       setStudent(response.data);
  //       setImage(response.data.profilePicture || null);
  //       setInitial(response.data.username?.charAt(0).toUpperCase() || null);
  //       router.push(`/profile/${studentId}`);
  //     } else {
  //       setError('Failed to fetch student details');
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     setError('Failed to fetch student details');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  console.log(student)

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
      if(response.success) {
      setCartCount(response.data.items.length);
      }
    } catch (error) {
      console.log('Failed to fetch cart data:', error);
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
  }, [studentId]);

  const wishlistCount = 0;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = (e:React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (e:MouseEvent) => {
      const target = e.target as Element; // Type assertion to Element
      if (isDropdownOpen && target.closest('.profile-dropdown') === null) {
        setIsDropdownOpen(false);
      }
      if (isMobileMenuOpen && target.closest('.mobile-menu') === null) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen, isMobileMenuOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 px-12 bg-white border-b border-gray-200">
      {/* Logo and Search Bar */}
      <div className="flex items-center">
        <Link href="/home" className="text-2xl font-bold text-gray-800 mr-12">
          ELEVIO
        </Link>
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search for anything..."
            className="w-full px-4 py-3 text-base text-gray-500 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ height: '40px' }}
          />
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          onClick={toggleMobileMenu}
          className="text-gray-700 focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {/* Navigation Links and Icons (Desktop) */}
      <div className="hidden md:flex md:items-center">
        {/* Navigation Links Section */}
        <div className="flex items-center space-x-6">
          <Link href="/home" className="text-gray-700 hover:text-blue-500">
            Home
          </Link>
          <Link href="/mylearning" className="text-gray-700 hover:text-blue-500">
            My learning
          </Link>
          <Link href="/courses" className="text-gray-700 hover:text-blue-500">
            Courses
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-blue-500">
            About
          </Link>
        </div>

        {/* Icons Section with Gap */}
        <div className="flex items-center space-x-6 ml-10">
          {/* Wishlist Icon with Badge */}
          <div className="relative">
            <Link href="/wishlist" className="text-gray-700 hover:text-blue-500">
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

          {/* Cart Icon with Badge */}
          <div className="relative">
            <Link href="/cart" className="text-gray-700 hover:text-blue-500">
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

          {/* Profile Photo with Dropdown */}
          <div className="relative profile-dropdown">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={toggleDropdown}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && toggleDropdown(e)}
            >
              {loading ? (
                <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
              ) : error ? (
                <div className="bg-blue-100 text-blue-800 rounded-full h-9 w-9 flex items-center justify-center font-semibold">
                  ?
                </div>
              ) : image ? (
                <Image
                  src={image}
                  alt="Tutor Profile"
                  width={36}
                  height={36}
                  className="rounded-full w-9 h-9 object-cover"
                />
              ) : (
                <div
                  className="bg-blue-100 text-blue-800 rounded-full h-9 w-9 flex items-center justify-center font-semibold"
                  aria-label={`Profile initial: ${initial || 'Unknown'}`}
                >
                  {initial || '?'}
                </div>
              )}
            </div>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50">
                <Link
                  href={`/profile/${studentId}`}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/chat"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Messages
                </Link>
                <div
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    handleLogout();
                    setIsDropdownOpen(false);
                  }}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-lg py-2 z-40 mobile-menu">
          <div className="flex flex-col items-center space-y-4">
            <input
              type="text"
              placeholder="Search for anything..."
              className="w-11/12 px-4 py-3 text-base text-gray-500 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ height: '40px' }}
            />
            <Link
              href="/home"
              className="text-gray-700 hover:text-blue-500"
              onClick={toggleMobileMenu}
            >
              Home
            </Link>
            <Link
              href="/mylearning"
              className="text-gray-700 hover:text-blue-500"
              onClick={toggleMobileMenu}
            >
              My learning
            </Link>
            <Link
              href="/courses"
              className="text-gray-700 hover:text-blue-500"
              onClick={toggleMobileMenu}
            >
              Courses
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-blue-500"
              onClick={toggleMobileMenu}
            >
              About
            </Link>
            <hr className="w-11/12 my-2" /> {/* Divider for visual separation */}
            <Link
              href="/wishlist"
              className="text-gray-700 hover:text-blue-500"
              onClick={toggleMobileMenu}
            >
              <span>Wishlist</span>
              {wishlistCount > 0 && (
                <span className="ml-1 bg-purple-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              className="text-gray-700 hover:text-blue-500"
              onClick={toggleMobileMenu}
            >
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="ml-1 bg-purple-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={toggleDropdown}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && toggleDropdown(e)}
            >
              {loading ? (
                <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
              ) : error ? (
                <div className="bg-blue-100 text-blue-800 rounded-full h-9 w-9 flex items-center justify-center font-semibold">
                  ?
                </div>
              ) : image ? (
                <Image
                  src={image}
                  alt="Tutor Profile"
                  width={36}
                  height={36}
                  className="rounded-full w-9 h-9 object-cover"
                />
              ) : (
                <div
                  className="bg-blue-100 text-blue-800 rounded-full h-9 w-9 flex items-center justify-center font-semibold"
                  aria-label={`Profile initial: ${initial || 'Unknown'}`}
                >
                  {initial || '?'}
                </div>
              )}
            </div>
            {isDropdownOpen && (
              <div className="w-full bg-white border border-gray-200 rounded-md shadow-lg py-2">
                <Link
                  href={`/profile/${studentId}`}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Profile
                </Link>
                <Link
                  href="/chat"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Messages
                </Link>
                <div
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    handleLogout();
                    setIsDropdownOpen(false);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;