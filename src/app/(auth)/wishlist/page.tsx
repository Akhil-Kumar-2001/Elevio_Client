'use client';

import Navbar from '@/components/student/navbar';
import React, { useState, useEffect } from 'react';
import { getWishlistCourses, removeFromWishlist } from '../../service/user/userApi';
import { FrontendCourse, ICourse } from '@/types/types';
import { useCartCountStore } from '@/store/cartCountStore';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import WishlistLoading from '@/components/student/wishlistLoading';

interface ExtendedFrontendCourse extends FrontendCourse {
  _id: string;
}

const WishlistPage = () => {
  const router = useRouter();
  const [wishlistCourses, setWishlistCourses] = useState<ExtendedFrontendCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { decrementWishlistCount } = useCartCountStore();

  const fetchWishlistCourses = async () => {
    try {
      const response = await getWishlistCourses();
      if (response.success) {
        const mappedCourses: ExtendedFrontendCourse[] = response.data.map((course: ICourse) => ({
          _id: course._id,
          title: course.title,
          rating: course.avgRating,
          students: course.purchasedStudents.length,
          price: course.price,
          image: course.imageThumbnail,
          totalReviews: course.totalReviews,
        }));
        setWishlistCourses(mappedCourses);
        setLoading(false);
      } else {
        setError('Failed to load wishlist');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError('Failed to load wishlist');
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (courseId: string) => {
    try {
      const response = await removeFromWishlist(courseId);
      if (response.success) {
        setWishlistCourses((prev) => prev.filter((course) => course._id !== courseId));
        decrementWishlistCount();
        toast.success('Course removed from wishlist');
      } else {
        toast.error('Failed to remove course from wishlist');
      }
    } catch (error) {
      console.error('Error removing course from wishlist:', error);
      toast.error('Failed to remove course from wishlist');
    }
  };

  const navigateToCourseDetails = (courseId: string) => {
    router.push(`/coursePreview/${courseId}`);
  };

  useEffect(() => {
    fetchWishlistCourses();
  }, []);

  if (loading) {
    // return (
    //   <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
    //     <Navbar />
    //     <div className="max-w-7xl mx-auto mt-16">
    //       <h2 className="text-3xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8 drop-shadow-sm">
    //         Your Learning Wishlist
    //       </h2>
    //       <div className="flex justify-center items-center h-64">
    //         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    //       </div>
    //     </div>
    //   </div>
    // );
    <WishlistLoading />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
        <Navbar />
        <div className="max-w-7xl mx-auto mt-16">
          <h2 className="text-3xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8 drop-shadow-sm">
            Your Learning Wishlist
          </h2>
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <Navbar />
      <div className="max-w-7xl mx-auto mt-16">
        <h2 className="text-3xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8 drop-shadow-sm animate-fade-in">
          Your Learning Wishlist
        </h2>
        {wishlistCourses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center animate-slide-up">
            <svg
              className="w-24 h-24 mx-auto text-gray-400 mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Wishlist is Empty</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Discover amazing courses and add them to your wishlist to start your learning journey!
            </p>
            <a
              href="/courses"
              className="inline-block bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors duration-300"
            >
              Explore Courses
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistCourses.map((course, index) => (
              <div
                key={index}
                className="relative bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className="relative w-full h-48 cursor-pointer"
                  onClick={() => navigateToCourseDetails(course._id)}
                >
                  <Image
                    src={course.image}
                    alt={course.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-xl transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2 min-h-[3rem]">
                    {course.title}
                  </h3>
                  {hoveredIndex === index ? (
                    <div className="flex items-center space-x-3 animate-fade-in">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromWishlist(course._id);
                        }}
                        className="p-2 border border-red-500 rounded-full hover:bg-red-50 transition-colors duration-200"
                        aria-label="Remove from Wishlist"
                      >
                        <svg
                          className="w-5 h-5 text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToCourseDetails(course._id);
                        }}
                        className="flex-1 bg-purple-600 text-white py-2.5 rounded-lg hover:bg-purple-700 transition-colors duration-200"
                      >
                        View Course
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center mb-3">
                        <span className="text-yellow-400 mr-1.5">★</span>
                        <span className="text-gray-600 text-sm">
                          {course.rating.toFixed(1)}{' '}
                          <span className="text-gray-500">({course.totalReviews} reviews)</span>
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-800 font-semibold text-lg">
                          ₹{course.price.toFixed(2)}
                        </span>
                        <span className="text-gray-500 text-sm">{course.students} students</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;