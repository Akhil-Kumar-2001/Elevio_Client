// import React, { useState, useEffect } from 'react';
// import {addToCart, addToWishlist, getPurchasedCourses, getTopRatedCourses } from '../../app/service/user/userApi'; // Adjust path to your API file
// import { FrontendCourse, ICourse } from '@/types/types'; // Adjust path to your types file
// import useAuthStore from '@/store/userAuthStore';
// import { useCartCountStore } from '@/store/cartCountStore';
// import { toast } from 'react-toastify';
// import { useRouter } from 'next/navigation'; // Import useNavigate hook
// import Image from 'next/image';

// // Ensure FrontendCourse type includes _id
// interface ExtendedFrontendCourse extends FrontendCourse {
//   _id: string; // Add _id to the type
// }

// const TopRated = () => {
//   const router = useRouter();
//   const [courses, setCourses] = useState<ExtendedFrontendCourse[]>([]);
//   const [purchasedCourses, setPurchasedCourses] = useState<string[]>([]); // Store purchased course IDs
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [hoveredIndex, setHoveredIndex] = useState<number | null>(null); // Track which card is being hovered
//   const { user } = useAuthStore();
//   const { incrementCartCount,incrementWishlistCount } = useCartCountStore();
//   const userId = user?.id;

//   const fetchCourses = async () => {
//     try {
//       const response = await getTopRatedCourses();
//       const mappedCourses: ExtendedFrontendCourse[] = response.data.map((course: ICourse) => ({
//         _id: course._id, // Map the _id from the API response
//         title: course.title,
//         rating: course.avgRating, // Hardcoded since not in ICourse
//         students: course.purchasedStudents.length ,
//         price: course.price,
//         image: course.imageThumbnail,
//         totalReviews:course.totalReviews
//       }));
//       setCourses(mappedCourses.slice(0, 4)); // Limit to 4 courses
//       setLoading(false);
//     } catch (err) {
//       console.log(err);
//       setError('Failed to load courses');
//       setLoading(false);
//     }
//   };

//   const fetchPurchasedCourses = async () => {
//     if (!userId) {
//       console.log("User id is not available");
//       return;
//     }
//     try {
//       const response = await getPurchasedCourses(userId);
//       if (response.success) {
//         const purchasedCourseIds = response.data.map((course: ICourse) => course._id);
//         setPurchasedCourses(purchasedCourseIds); // Store only the _id of purchased courses
//       }
//     } catch (error) {
//       console.log("Error while getting Purchased Courses:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCourses();
//     if (userId) {
//       fetchPurchasedCourses(); // Fetch purchased courses only if user is logged in
//     }
//   }, [userId]);

//   const handleAddToCart = async (courseId: string) => {
//     if (!userId) {
//       setError('You must be logged in to add a course to the cart');
//       return;
//     }
//     try {
//       const response = await addToCart(userId, courseId);
//       if (response) {
//         toast.success(response.message);
//         incrementCartCount();
//       }
//     } catch (error) {
//       console.log("Error adding course to cart:", error);
//       setError('Failed to add course to cart');
//     }
//   };

//   const handleWishlist = async(courseId:string) => {
//     // toast.info("Wish list feature Coming Soon....");
//     try {
//       const response = await addToWishlist(courseId);
//       if (response.success) {
//         toast.success(response.message);
//         incrementWishlistCount();

//       }
//     } catch (error) {
//       console.log("Error adding course to wishlist:", error);
//       // setError('Failed to add course to wishlist');
      
//     }
//   };

//   // New function to handle navigation to course details page
//   const navigateToCourseDetails = (courseId: string) => {
//     router.push(`/coursePreview/${courseId}`);
//   };

//   if (loading) {
//     return (
//       <div className="w-full px-16 my-20">
//         <h2 className="text-2xl font-semibold text-gray-800 mb-6">Top Rated Courses</h2>
//         <p>Loading courses...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="w-full px-16 my-20">
//         <h2 className="text-2xl font-semibold text-gray-800 mb-6">Top Rated Courses</h2>
//         <p className="text-red-500">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full px-16 my-20">
//       {/* Header with "See More" link */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-semibold text-gray-800">Top Rated Courses</h2>
//         {/* <a
//           href="/courses"
//           className="text-blue-600 font-medium hover:text-blue-800 transition-colors"
//         >
//           See More
//         </a> */}
//       </div>

//       {/* Course Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {courses.map((course, index) => {
//           const isPurchased = purchasedCourses.includes(course._id);

//           return (
//             <div
//               key={index}
//               className="relative bg-white rounded-lg shadow-md overflow-hidden"
//               onMouseEnter={() => setHoveredIndex(index)}
//               onMouseLeave={() => setHoveredIndex(null)}
//             >
//               <div className="relative w-full h-40 cursor-pointer" onClick={() => navigateToCourseDetails(course._id)}>
//                 <Image
//                   src={course.image}
//                   alt={course.title}
//                   layout="fill"
//                   objectFit="cover"
//                   className="rounded-t-lg"
//                 />
//               </div>
//               {/* Card Content */}
//               <div className="p-4">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
//                   {course.title}
//                 </h3>
//                 {hoveredIndex === index && !isPurchased ? (
//                   // Hover State: Show Add to Cart button and Wishlist icon only if not purchased
//                   <div className="flex items-center space-x-2">
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation(); // Prevent navigation when clicking the button
//                         handleAddToCart(course._id);
//                       }}
//                       className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
//                     >
//                       Add to cart
//                     </button>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation(); // Prevent navigation when clicking the button
//                         handleWishlist(course._id);
//                       }}
//                       className="p-2 border border-purple-600 rounded-full hover:bg-purple-100 transition-colors"
//                       aria-label="Add to Wishlist"
//                     >
//                       <svg
//                         className="w-5 h-5 text-purple-600"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
//                         />
//                       </svg>
//                     </button>
//                   </div>
//                 ) : (
//                   // Default State or Purchased State: Show rating, students, and price
//                   <>
//                     <div className="flex items-center mb-2">
//                       <span className="text-yellow-500 mr-1">★</span>
//                       <span className="text-gray-600">
//                         {course.rating}{' '}
//                         <span className="text-gray-500">({course.totalReviews} students)</span>
//                       </span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-gray-800 font-medium">
//                         ₹{course.price.toFixed(2)}
//                       </span>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default TopRated;





import React, { useState, useEffect } from 'react';
import { addToCart, addToWishlist, getPurchasedCourses, getTopRatedCourses } from '../../app/service/user/userApi';
import { FrontendCourse, ICourse } from '@/types/types';
import useAuthStore from '@/store/userAuthStore';
import { useCartCountStore } from '@/store/cartCountStore';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Star, ArrowRight, ShoppingCart, Heart } from 'lucide-react';

interface ExtendedFrontendCourse extends FrontendCourse {
  _id: string;
}

const TopRated = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<ExtendedFrontendCourse[]>([]);
  const [purchasedCourses, setPurchasedCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { user } = useAuthStore();
  const { incrementCartCount, incrementWishlistCount } = useCartCountStore();
  const userId = user?.id;

  const fetchCourses = async () => {
    try {
      const response = await getTopRatedCourses();
      const mappedCourses: ExtendedFrontendCourse[] = response.data.map((course: ICourse) => ({
        _id: course._id,
        title: course.title,
        rating: course.avgRating,
        students: course.purchasedStudents.length,
        price: course.price,
        image: course.imageThumbnail,
        totalReviews: course.totalReviews
      }));
      setCourses(mappedCourses.slice(0, 4));
      setLoading(false);
    } catch (err) {
      console.log(err);
      setError('Failed to load courses');
      setLoading(false);
    }
  };

  const fetchPurchasedCourses = async () => {
    if (!userId) {
      console.log("User id is not available");
      return;
    }
    try {
      const response = await getPurchasedCourses(userId);
      if (response.success) {
        const purchasedCourseIds = response.data.map((course: ICourse) => course._id);
        setPurchasedCourses(purchasedCourseIds);
      }
    } catch (error) {
      console.log("Error while getting Purchased Courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
    if (userId) {
      fetchPurchasedCourses();
    }
  }, [userId]);

  const handleAddToCart = async (courseId: string) => {
    if (!userId) {
      setError('You must be logged in to add a course to the cart');
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
    }
  };

  const handleWishlist = async(courseId: string) => {
    try {
      const response = await addToWishlist(courseId);
      if (response.success) {
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

  if (loading) {
    return (
      <div className="w-full px-16 my-10">
        <div className="flex items-center mb-6">
          <div className="w-1 h-8 bg-purple-600 mr-4"></div>
          <h2 className="text-2xl font-semibold text-gray-800">Top Rated Courses</h2>
        </div>
        <p>Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-16 my-10">
        <div className="flex items-center mb-6">
          <div className="w-1 h-8 bg-purple-600 mr-4"></div>
          <h2 className="text-2xl font-semibold text-gray-800">Top Rated Courses</h2>
        </div>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full px-16 my-10">
      {/* Header with "See More" link */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="w-1 h-8 bg-purple-600 mr-4"></div>
          <h2 className="text-2xl font-semibold text-purple-700">Top Rated Courses</h2>
        </div>
        <a
          href="/courses"
          className="text-purple-600 font-medium hover:text-purple-800 transition-colors flex items-center"
        >
          View All Courses
          <ArrowRight className="w-4 h-4 ml-1" />
        </a>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {courses.map((course, index) => {
          const isPurchased = purchasedCourses.includes(course._id);
          const isFirstCourse = index === 0;

          return (
            <div
              key={index}
              className="relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Featured Badge for first course */}
              {isFirstCourse && (
                <div className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full z-10 text-sm font-medium shadow-sm">
                  Featured
                </div>
              )}
              
              {/* Course Rating Badge */}
              <div className="absolute top-3 left-3 bg-white rounded-full px-2 py-1 flex items-center shadow-sm z-10">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500 mr-1" />
                <span className="font-bold text-gray-800">{course.rating ? course.rating.toFixed(1) : "0.0"}</span>
              </div>

              <div 
                className="relative w-full h-48 cursor-pointer" 
                onClick={() => navigateToCourseDetails(course._id)}
              >
                <Image
                  src={course.image}
                  alt={course.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              </div>
              
              {/* Card Content */}
              <div className="p-4">
                <h3 
                  className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 cursor-pointer hover:text-purple-700 transition-colors"
                  onClick={() => navigateToCourseDetails(course._id)}
                >
                  {course.title}
                </h3>
                
                {hoveredIndex === index && !isPurchased ? (
                  // Hover State: Show Add to Cart button and Wishlist icon
                  <div className="flex items-center space-x-2 mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(course._id);
                      }}
                      className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
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
                      <Heart className="w-5 h-5 text-purple-600" />
                    </button>
                  </div>
                ) : (
                  // Default State: Show rating, students, and price
                  <>
                    <div className="flex items-center mb-3">
                      <span className="text-gray-600">
                        {course.totalReviews} {course.totalReviews === 1 ? 'review' : 'reviews'} • {course.students} {course.students === 1 ? 'student' : 'students'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-purple-700">
                        ₹{course.price.toFixed(2)}
                      </span>
                      {isPurchased && (
                        <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded">
                          Purchased
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
    </div>
  );
};

export default TopRated;