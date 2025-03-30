'use client'

import React, { useState, useEffect } from 'react';
import { getListedCourses, addToCart, getCategories } from '@/app/service/user/userApi';
import { FrontendCourse } from '@/types/types';
import useAuthStore from '@/store/userAuthStore';
import { useCartCountStore } from '@/store/cartCountStore';
import { toast } from 'react-toastify';
import Navbar from '@/components/student/navbar';
import CoursesLoading from '@/components/student/coursesLoading';

// Ensure FrontendCourse type includes _id
interface ExtendedFrontendCourse extends FrontendCourse {
  _id: string;
  category?: string; // Add category field
}

const Courses = () => {
  const [courses, setCourses] = useState<ExtendedFrontendCourse[]>([]);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { user } = useAuthStore();
  const { incrementCartCount } = useCartCountStore();

  const userId = user?.id;

  // ✅ Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      if (response && response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  // ✅ Fetch courses and map category names
  const fetchCourses = async () => {
    try {
      const response = await getListedCourses();
      console.log("course data in the component:", response);

      const mappedCourses: ExtendedFrontendCourse[] = response.data.map((course: any) => {
        // Find category name by matching category ID
        const categoryName = categories.find(cat => cat._id === course.category)?.name || 'Unknown';

        return {
          _id: course._id,
          title: course.title,
          rating: 4.8,
          students: course.totalStudents || Math.floor(Math.random() * 1000),
          price: course.price,
          image: course.imageThumbnail,
          category: categoryName // ✅ Assign category name instead of ID
        };
      });

      setCourses(mappedCourses);
      setLoading(false);
    } catch (err) {
      setError('Failed to load courses');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(); // Fetch categories first
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      fetchCourses(); // Fetch courses after categories are available
    }
  }, [categories]);

  const handleAddToCart = async (courseId: string) => {
    if (!userId) {
      setError('You must be logged in to add a course to the cart');
      return;
    }
    try {
      const response = await addToCart(userId, courseId);
      console.log(response);
      if (response) {
        toast.success(response.message);
        incrementCartCount();
      }
    } catch (error) {
      console.log("Error adding course to cart:", error);
      setError('Failed to add course to cart');
    }
  };

  if (loading) {
    return <CoursesLoading />;
  }

  if (error) {
    return (
      <div className="w-full px-16 my-20">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">All Courses</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="px-16 pt-32  py-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">All Courses</h2>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {courses.map((course, index) => (
            <div
              key={index}
              className="relative bg-white rounded-lg shadow overflow-hidden"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Image */}
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-40 object-cover rounded-t-lg"
              />
              {/* Card Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                  {course.title}
                </h3>
                {hoveredIndex === index ? (
                  // Hover State: Show Add to Cart button and Wishlist icon
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleAddToCart(course._id)}
                      className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Add to cart
                    </button>
                    <button
                      className="p-2 border border-purple-600 rounded-full hover:bg-purple-100 transition-colors"
                      aria-label="Add to Wishlist"
                    >
                      <svg
                        className="w-5 h-5 text-purple-600"
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
                    </button>
                  </div>
                ) : (
                  // Default State: Show rating, students, and price
                  <>
                    <div className="flex items-center mb-2">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="text-gray-600">
                        {course.rating}{' '}
                        <span className="text-gray-500">({course.students} students)</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-800 font-medium">
                        ₹{course.price.toFixed(2)}
                      </span>
                      {course.category && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {course.category}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No courses available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
