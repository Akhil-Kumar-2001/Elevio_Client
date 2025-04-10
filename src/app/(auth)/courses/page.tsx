'use client'

import React, { useState, useEffect } from 'react';
import { Filter, SortAsc, SortDesc, X } from 'lucide-react';
import useAuthStore from '@/store/userAuthStore';
import { useRouter } from 'next/navigation';
import { useCartCountStore } from '@/store/cartCountStore';
import { addToCart, getCategories, getCourses } from '@/app/service/user/userApi';
import { toast } from 'react-toastify';
import Navbar from '@/components/student/navbar';
import CoursesLoading from '@/components/student/coursesLoading';
import Pagination from '@/components/student/pagination';
import Image from 'next/image';

interface ExtendedFrontendCourse {
  _id: string;
  title: string;
  rating: number;
  students: number;
  price: number;
  image: string;
  category?: string;
}

const Courses = () => {
  const router = useRouter()
  const [courses, setCourses] = useState<ExtendedFrontendCourse[]>([]);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);


  const { user } = useAuthStore();
  const { incrementCartCount } = useCartCountStore();

  const userId = user?.id;

  // Load filter preferences from localStorage on initial render
  useEffect(() => {
    const savedFilters = localStorage.getItem('courseFilters');
    if (savedFilters) {
      const parsedFilters = JSON.parse(savedFilters);
      setSelectedCategory(parsedFilters.selectedCategory || 'all');
      setPriceRange(parsedFilters.priceRange || [0, 5000]);
      setSortOrder(parsedFilters.sortOrder || null);
    }
  }, []);

  // Save filter preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('courseFilters', JSON.stringify({
      selectedCategory,
      priceRange,
      sortOrder
    }));
  }, [selectedCategory, priceRange, sortOrder]);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      if (response && response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.log("Error fetching categories:", error);
      toast.error('Failed to fetch categories');
    }
  };

  // Fetch courses and map category names
  const fetchCourses = async () => {
    try {
      const response = await getCourses(currentPage, 8);
      if (response) {
        setTotalPages(Math.floor(response.data.totalRecord / 5));
      }

      const mappedCourses: ExtendedFrontendCourse[] = response.data.courses.map((course: any) => {
        // Find category name by matching category ID
        const categoryName = categories.find(cat => cat._id === course.category)?.name || 'Unknown';

        return {
          _id: course._id,
          title: course.title,
          rating: 4.8, // Default rating or you could add this to your API response
          students: course.totalStudents || Math.floor(Math.random() * 1000),
          price: course.price,
          image: course.imageThumbnail,
          category: categoryName // Assign category name instead of ID
        };
      });

      setCourses(mappedCourses);
      setLoading(false);
    } catch (err) {
      console.log("Error fetching courses:", err);
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
  }, [categories, currentPage]);

  const handleAddToCart = async (courseId: string) => {
    if (!userId) {
      setError('You must be logged in to add a course to the cart');
      toast.error('You must be logged in to add a course to the cart');
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
      toast.error('Failed to add course to cart');
    }
  };

  const handleWishlist = () => {
    toast.info("Wish list feature Coming Soooon....")
  }

  // New function to handle navigation to course details page
  const navigateToCourseDetails = (courseId: string) => {
    router.push(`/coursePreview/${courseId}`);
  };

  // Toggle filter sidebar
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Apply filters to courses
  const filterCourses = () => {
    let filtered = [...courses];

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    // Price filter using range slider values
    filtered = filtered.filter(course =>
      course.price >= priceRange[0] && course.price <= priceRange[1]
    );

    // Sort by name
    if (sortOrder) {
      filtered.sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.title.localeCompare(b.title);
        } else {
          return b.title.localeCompare(a.title);
        }
      });
    }

    return filtered;
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory('all');
    setPriceRange([0, 5000]);
    setSortOrder(null);
  };

  // Handle price range change
  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = parseInt(e.target.value);
    setPriceRange(prev => {
      const newRange = [...prev] as [number, number];
      newRange[index] = value;
      return newRange;
    });
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
      <div className="px-16 pt-32 py-8 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">All Courses</h2>

          {/* Improved Filter button */}
          <button
            onClick={toggleFilters}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
          >
            <Filter size={18} />
            <span className="font-medium">Filters</span>
          </button>
        </div>

        {/* Filter Summary - show active filters */}
        {(selectedCategory !== 'all' || priceRange[0] > 0 || priceRange[1] < 5000 || sortOrder) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedCategory !== 'all' && (
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center border border-purple-100">
                Category: {selectedCategory}
              </div>
            )}

            {(priceRange[0] > 0 || priceRange[1] < 5000) && (
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center border border-purple-100">
                Price: ₹{priceRange[0]} - ₹{priceRange[1]}
              </div>
            )}

            {sortOrder && (
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center border border-purple-100">
                Sort: {sortOrder === 'asc' ? 'A to Z' : 'Z to A'}
              </div>
            )}

            <button
              onClick={resetFilters}
              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center hover:bg-gray-200"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Improved Sidebar Filter Panel */}
        <div
          className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out overflow-y-auto ${showFilters ? 'translate-x-0' : 'translate-x-full'
            }`}
          style={{ paddingTop: '80px' }}  // Add space for the header
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-semibold text-gray-800">Refine Results</h3>
              <button
                onClick={toggleFilters}
                className="text-gray-500 hover:text-gray-700 bg-gray-100 p-2 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-8">
              {/* Improved Category filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none bg-white"
                    style={{
                      backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                      backgroundPosition: "right 0.5rem center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "1.5em 1.5em"
                    }}
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Improved Price range slider */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                </label>

                <div className="space-y-6">
                  {/* Min price */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Min Price</label>
                    <input
                      type="range"
                      min={0}
                      max={5000}
                      step={100}
                      value={priceRange[0]}
                      onChange={(e) => handlePriceRangeChange(e, 0)}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #d1d5db 0%, #8b5cf6 ${(priceRange[0] / 5000) * 100}%, #d1d5db ${(priceRange[0] / 5000) * 100}%)`
                      }}
                    />
                    <div className="w-full flex justify-between text-xs text-gray-500 mt-1">
                      <span>₹0</span>
                      <span>₹5000</span>
                    </div>
                  </div>

                  {/* Max price */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Max Price</label>
                    <input
                      type="range"
                      min={0}
                      max={5000}
                      step={100}
                      value={priceRange[1]}
                      onChange={(e) => handlePriceRangeChange(e, 1)}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(priceRange[1] / 5000) * 100}%, #d1d5db ${(priceRange[1] / 5000) * 100}%)`
                      }}
                    />
                    <div className="w-full flex justify-between text-xs text-gray-500 mt-1">
                      <span>₹0</span>
                      <span>₹5000</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Improved Sort order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort by Name
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortOrder('asc')}
                    className={`flex-1 flex items-center text-gray-700 justify-center gap-2 p-2 border rounded-lg transition-all ${sortOrder === 'asc'
                      ? 'bg-purple-100 border-purple-500 text-purple-700 shadow-sm'
                      : 'hover:bg-gray-50 border-gray-300'
                      }`}
                  >
                    <SortAsc size={16} />
                    A to Z
                  </button>
                  <button
                    onClick={() => setSortOrder('desc')}
                    className={`flex-1 flex items-center text-gray-700 justify-center gap-2 p-2 border rounded-lg transition-all ${sortOrder === 'desc'
                      ? 'bg-purple-100 border-purple-500 text-purple-700 shadow-sm'
                      : 'hover:bg-gray-50 border-gray-300'
                      }`}
                  >
                    <SortDesc size={16} />
                    Z to A
                  </button>
                </div>
              </div>

              {/* Improved Reset Button */}
              <button
                onClick={resetFilters}
                className="w-full px-4 py-3 mt-6 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-colors font-medium shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filterCourses().map((course, index) => (
            <div
              key={index}
              className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Next.js Image component instead of img tag */}
              <div 
                onClick={() => navigateToCourseDetails(course._id)}
                className="relative w-full h-40 cursor-pointer"
              >
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                  className="rounded-t-lg"
                  priority={index < 4} // Only prioritize loading for the first 4 images
                />
              </div>
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
                      className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors"
                    >
                      Add to cart
                    </button>
                    <button
                      onClick={handleWishlist}
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
                        <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
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

        {filterCourses().length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No courses match your filters.</p>
          </div>
        )}
        <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />

      </div>
    </div>
  );
}

export default Courses;