'use client';

import { useEffect, useState } from 'react';
import useAuthStore from '@/store/userAuthStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getStudent, cartData } from '../../app/service/user/userApi';
import { useCartCountStore } from '@/store/cartCountStore';

const Navbar = () => {
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [image, setImage] = useState(null);
  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();
  const { cartCount, setCartCount } = useCartCountStore();
  const studentId = user?.id;

  const fetchStudentDetails = async () => {
    if (!studentId) return;
    try {
      setLoading(true);
      const response = await getStudent(studentId);
      if (response.success) {
        setStudent(response.data);
        setImage(response.data.profilePicture || null);
        setInitial(response.data.username?.charAt(0).toUpperCase() || null);
        router.push(`/profile/${studentId}`);
      } else {
        setError('Failed to fetch student details');
      }
    } catch (error) {
      setError('Failed to fetch student details');
    } finally {
      setLoading(false);
    }
  };

  const fetchCartCount = async () => {
    if (!studentId) return;
    try {
      const response = await cartData(studentId);
      setCartCount(response.data.items.length); // Set initial cart count from API
    } catch (error) {
      console.log('Failed to fetch cart data:', error);
    }
  };

  useEffect(() => {
    if (!studentId) return;

    const getImageTutor = async () => {
      try {
        setLoading(true);
        const response = await getStudent(studentId);
        if (response.success) {
          setStudent(response.data);
          setImage(response.data.profilePicture || null);
          setInitial(response.data.username?.charAt(0).toUpperCase() || null);
        } else {
          setError('Failed to fetch profile image');
        }
      } catch (error) {
        setError('Failed to fetch profile image');
      } finally {
        setLoading(false);
      }
    };

    getImageTutor();
    fetchCartCount(); // Fetch initial cart count
  }, [studentId]);

  const wishlistCount = 0;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 px-10 bg-white border-b border-gray-200">
      {/* Logo */}
      <Link href="/home" className="text-2xl font-bold text-gray-800">ELEVIO</Link>

      {/* Search Bar */}
      <div className="mx-4 w-1/3">
        <input
          type="text"
          placeholder="Search for anything..."
          className="w-full px-3 py-2.5 text-sm text-gray-500 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Navigation Links and Profile Photo */}
      <div className="flex items-center space-x-8 pr-4">
        <Link href="/home" className="text-gray-700 hover:text-blue-500">Home</Link>
        <Link href="/mylearning" className="text-gray-700 hover:text-blue-500">My learning</Link>
        <Link href="#" className="text-gray-700 hover:text-blue-500">Contact us</Link>

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

        {/* Profile Photo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={fetchStudentDetails}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && fetchStudentDetails()}
        >
          {loading ? (
            <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
          ) : error ? (
            <div className="bg-blue-100 text-blue-800 rounded-full h-9 w-9 flex items-center justify-center font-semibold">?</div>
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
      </div>
    </nav>
  );
};

export default Navbar;