'use client'

import React, { useState, useEffect } from 'react';
import { Filter, SortAsc, SortDesc, X, Search } from 'lucide-react';
import useAuthStore from '@/store/userAuthStore';
import { useRouter } from 'next/navigation';
import { useCartCountStore } from '@/store/cartCountStore';
import { addToCart, addToWishlist, getCategories, getPurchasedCourses, searchCourse } from '@/app/service/user/userApi';
import { toast } from 'react-toastify';
import Navbar from '@/components/student/navbar';
import CoursesLoading from '@/components/student/coursesLoading';
import Pagination from '@/components/student/pagination';
import Image from 'next/image';
import { ICoursePreview, ICourseSearchServiceDto } from '@/types/types';

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
  const router = useRouter();
  const [courses, setCourses] = useState<ExtendedFrontendCourse[]>([]);
  const [purchasedCourses, setPurchasedCourses] = useState<string[]>([]);
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
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { user } = useAuthStore();
  const { incrementCartCount, incrementWishlistCount } = useCartCountStore();

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

  // Fetch purchased courses
  const fetchPurchasedCourses = async () => {
    if (!userId) {
      console.log("User id is not available");
      return;
    }
    try {
      const response = await getPurchasedCourses(userId);
      if (response.success) {
        const purchasedCourseIds = response.data.map((course: ICoursePreview) => course._id);
        setPurchasedCourses(purchasedCourseIds);
      }
    } catch (error) {
      console.log("Error while getting Purchased Courses:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      console.log('Fetching courses with params:', {
        searchQuery,
        currentPage,
        selectedCategory,
        priceRange,
        sortOrder,
      });
      const response = await searchCourse(searchQuery, currentPage, 8, selectedCategory, priceRange, sortOrder);
      console.log('API Response:', response);
      if (response && response.success) {
        setTotalPages(Math.ceil(response.data.totalRecord / 8));

        const mappedCourses: ExtendedFrontendCourse[] = response.data.data.map((course: ICourseSearchServiceDto) => {
          return {
            _id: course.id,
            title: course.title,
            rating: 4.8,
            students: course.purchasedStudents?.length || Math.floor(Math.random() * 1000),
            price: course.price,
            image: course.imageThumbnail,
            category: course.category || 'Unknown', // Use the category name directly
          };
        });

        setCourses(mappedCourses);
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    if (userId) {
      fetchPurchasedCourses();
    }
  }, [userId]);

  useEffect(() => {
    if (categories.length > 0) {
      fetchCourses();
    }
  }, [categories, currentPage, searchQuery, selectedCategory, priceRange, sortOrder]);

  const handleAddToCart = async (courseId: string) => {
    if (!userId) {
      setError('You must be logged in to add a course to the cart');
      toast.error('You must be logged in to add a course to the cart');
      return;
    }
    try {
      const response = await addToCart(userId, courseId);
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

  const handleWishlist = async (courseId: string) => {
    try {
      const response = await addToWishlist(courseId);
      if (response) {
        toast.success(response.message);
        incrementWishlistCount();
      }
    } catch (error) {
      console.log("Error adding course to wishlist:", error);
    }
  };

  const navigateToCourseDetails = (courseId: string) => {
    router.push(`/coursePreview/${courseId}`);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setPriceRange([0, 5000]);
    setSortOrder(null);
    setSearchQuery('');
  };

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
        {/* Search Bar */}
        <div className="flex justify-center mb-4 -mt-4">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-gray-700"
              style={{ outline: 'none' }} // Inline style to override default outline
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">All Courses</h2>
          <button
            onClick={toggleFilters}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
          >
            <Filter size={18} />
            <span className="font-medium">Filters</span>
          </button>
        </div>

        {(selectedCategory !== 'all' || priceRange[0] > 0 || priceRange[1] < 5000 || sortOrder || searchQuery) && (
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
            {searchQuery && (
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center border border-purple-100">
                Search: {searchQuery}
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

        <div
          className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out overflow-y-auto ${showFilters ? 'translate-x-0' : 'translate-x-full'}`}
          style={{ paddingTop: '80px' }}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                </label>
                <div className="space-y-6">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort by Name
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortOrder('asc')}
                    className={`flex-1 flex items-center text-gray-700 justify-center gap-2 p-2 border rounded-lg transition-all ${sortOrder === 'asc' ? 'bg-purple-100 border-purple-500 text-purple-700 shadow-sm' : 'hover:bg-gray-50 border-gray-300'}`}
                  >
                    <SortAsc size={16} />
                    A to Z
                  </button>
                  <button
                    onClick={() => setSortOrder('desc')}
                    className={`flex-1 flex items-center text-gray-700 justify-center gap-2 p-2 border rounded-lg transition-all ${sortOrder === 'desc' ? 'bg-purple-100 border-purple-500 text-purple-700 shadow-sm' : 'hover:bg-gray-50 border-gray-300'}`}
                  >
                    <SortDesc size={16} />
                    Z to A
                  </button>
                </div>
              </div>

              <button
                onClick={resetFilters}
                className="w-full px-4 py-3 mt-6 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-colors font-medium shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {courses.map((course, index) => {
            const isPurchased = purchasedCourses.includes(course._id);

            return (
              <div
                key={index}
                className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
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
                    priority={index < 4}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  {hoveredIndex === index && !isPurchased ? (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(course._id);
                        }}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors"
                      >
                        Add to cart
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWishlist(course._id);
                        }}
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
            );
          })}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No courses match your filters.</p>
          </div>
        )}
        <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
};

export default Courses;