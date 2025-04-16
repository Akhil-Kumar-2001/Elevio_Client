'use client'

import React, { useEffect, useState } from 'react';
import { ArrowLeft, Clock, Star, User, ChevronDown, ChevronUp, Play, Check, Lock, ShoppingCart, MessageSquare } from 'lucide-react';
import Navbar from '@/components/student/navbar';
import { useParams, useRouter } from 'next/navigation';
import Footer from '@/components/student/footer';
import useAuthStore from '@/store/userAuthStore';
import { toast } from 'react-toastify';
import { ICourse, ISection, ILecture, TutorType } from '@/types/types';
import Link from 'next/link';
import { createOrder, createReview, getCourseDetails, getLecturesBySection, getReviewsByCourse, getSectionsByCourse, getStudent, getSubscription, getTutor, verifyPayment } from '@/app/service/user/userApi';
import { createChat } from '@/app/service/shared/chatService';

// Define Review interface
interface IReview {
  _id: string;
  courseId: string;
  userId: {
    _id: string;
    username: string;
  };
  rating: number;
  review: string;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

interface Subscription {
  status: string;
  startDate: string;
  endDate: string;
  planId: {
    planName: string;
    price: number;
  };
}

const CoursePreview = () => {
  const router = useRouter();
  const { id } = useParams();
  const [course, setCourse] = useState<ICourse | null>(null);
  const [tutor, setTutor] = useState<TutorType | null>(null);
  const [sections, setSections] = useState<ISection[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [currentLecture, setCurrentLecture] = useState<ILecture | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [userReview, setUserReview] = useState<{ rating: number; review: string }>({ rating: 0, review: '' });
  const [hasReviewed, setHasReviewed] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('Anonymous');
  const [email, setEmail] = useState<string>('');
  const { user } = useAuthStore();
  const userId = user?.id;
  const courseIds = [id as string];

  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (isProcessingPayment) return;
    setIsProcessingPayment(true);
    try {
      if (!userId) {
        toast.error("Please log in to purchase this course");
        return;
      }
      if (!course || !course.price || course.price <= 0) {
        toast.error("Invalid course price");
        return;
      }
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load payment gateway. Please check your network connection.");
        return;
      }
      const order = await createOrder(userId, course.price, courseIds);
      if (!order || !order.data || !order.data.razorpayOrderId) {
        toast.error("Failed to create order. Please try again.");
        return;
      }
      const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!razorpayKeyId) {
        toast.error("Payment system configuration error. Please contact support.");
        console.error("Missing Razorpay Key ID in environment variables");
        return;
      }
      const options: RazorpayOptions = {
        key: razorpayKeyId,
        amount: order.data.amount,
        currency: "INR",
        name: "Elevio Learning",
        description: `Purchase: ${course.title}`,
        order_id: order.data.razorpayOrderId,
        handler: async (response: RazorpayResponse) => {
          try {
            const verification = await verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );
            if (verification.status === "success") {
              toast.success("Course purchased successfully! You now have full access.");
              router.push("/mylearning");
            } else {
              toast.error("Payment verification failed. Please contact support if your payment was processed.");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error("We couldn't verify your payment. Please contact support if your payment was processed.");
          }
        },
        prefill: {
          name: username || "Student Name",
          email: email || "student@example.com",
        },
        theme: {
          color: "#6B46C1",
        },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment process error:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await getCourseDetails(id as string);
      if (response.success) {
        setCourse(response.data);
      } else {
        toast.error(response.message || "Failed to load course details");
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
      toast.error("Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  const fetchTutorDetails = async () => {
    if (!course?.tutorId) return;
    try {
      const tutorData = await getTutor(course.tutorId);
      if (tutorData) {
        setTutor(tutorData.data);
      }
    } catch (error) {
      console.log("Error while retrieving tutor data:", error);
    }
  };

  const fetchCourseSections = async () => {
    try {
      const response = await getSectionsByCourse(id as string);
      if (response.success) {
        setSections(response.data);
        const initialExpandedState: Record<string, boolean> = {};
        response.data.forEach((section: ISection, index: number) => {
          initialExpandedState[section._id.toString()] = index === 0;
        });
        setExpandedSections(initialExpandedState);
        if (response.data.length > 0 && response.data[0].totalLectures > 0) {
          const firstSectionId = response.data[0]._id.toString();
          fetchSectionLectures(firstSectionId, true);
        }
      }
    } catch (error) {
      console.error("Error fetching course sections:", error);
      toast.error("Failed to load course sections");
    }
  };

  const fetchSectionLectures = async (sectionId: string, setFirstAsCurrent = false) => {
    try {
      const response = await getLecturesBySection(sectionId);
      if (response.success) {
        setSections(prev =>
          prev.map(section =>
            section._id.toString() === sectionId
              ? { ...section, lectures: response.data }
              : section
          )
        );
        if (setFirstAsCurrent && response.data.length > 0) {
          setCurrentLecture(response.data[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching lectures:", error);
      toast.error("Failed to load lectures");
    }
  };

  const fetchUsername = async () => {
    try {
      const response = await getStudent();
      if (response.success && response.data.username) {
        setUsername(response.data.username);
        setEmail(response.data.email);
      }
    } catch (error) {
      console.error('Error fetching username:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await getReviewsByCourse(id as string);
      if (response.success) {
        const reviewsWithUser = response.data.map((review: IReview) => ({
          ...review,
          user: {
            username: review.userId.username || 'Anonymous',
          },
        }));
        setReviews(reviewsWithUser || []);
        if (userId) {
          const userHasReviewed = response.data.some((review: IReview) => review.userId._id === userId);
          setHasReviewed(userHasReviewed);
        }
      } else {
        setReviews([]);
      }
    } catch (error) {
      setReviews([]);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !hasPurchased()) {
      toast.error("You must purchase the course to submit a review");
      return;
    }
    if (hasReviewed) {
      toast.error("You have already submitted a review for this course");
      return;
    }
    if (userReview.rating < 1 || userReview.rating > 5) {
      toast.error("Please select a rating between 1 and 5");
      return;
    }
    if (!userReview.review.trim()) {
      toast.error("Please enter a review");
      return;
    }
    try {
      const formData = {
        courseId: id as string,
        userId,
        rating: userReview.rating,
        review: userReview.review,
      };
      const response = await createReview(formData);
      if (response.success) {
        toast.success("Review submitted successfully");
        setHasReviewed(true);
        setReviews([
          ...reviews,
          {
            ...response.data,
            user: { username: response.data.userId?.username || username },
          },
        ]);
        setUserReview({ rating: 0, review: '' });
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    }
  };

  const toggleSection = (sectionId: string, sectionIndex: number) => {
    if (!hasPurchased() && sectionIndex > 0) {
      toast.info("Purchase this course to access all sections");
      return;
    }
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
    if (!expandedSections[sectionId]) {
      const section = sections.find(s => s._id.toString() === sectionId);
      if (section && (!section.lectures || section.lectures.length === 0)) {
        fetchSectionLectures(sectionId);
      }
    }
  };

  const handleLectureSelect = (lecture: ILecture, sectionIndex: number) => {
    if (!hasPurchased() && sectionIndex > 0 && !lecture.isPreview) {
      toast.info("Purchase this course to access all lectures");
      return;
    }
    setCurrentLecture(lecture);
  };

  const hasPurchased = () => {
    if (!course || !userId) return false;
    return course.purchasedStudents?.includes(userId);
  };

  const validateSubscription = async () => {
    try {
      const subscriptionResponse = await getSubscription();
      if (subscriptionResponse.success && subscriptionResponse.data) {
        setSubscription(subscriptionResponse.data);
      } else {
        setSubscription(null);
        console.log("No active subscription found.");
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
      setSubscription(null);
    }
  };

  const hasValidSubscription = () => {
    if (!subscription) return false;
    const currentDate = new Date();
    const endDate = new Date(subscription.endDate);
    return subscription.status === "active" && currentDate <= endDate;
  };

  const getLectureStatus = (lecture: ILecture) => {
    return Math.random() > 0.5 ? "completed" : "not-started";
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const handleChatWithTutor = async () => {
    const response = await createChat(course?.tutorId as string);
    if (response.success) {
      router.push('/chat');
    }
  };

  useEffect(() => {
    if (id) {
      fetchCourseDetails();
      fetchCourseSections();
      fetchReviews();
      validateSubscription();
      fetchUsername();
    }
  }, [id, userId]);

  useEffect(() => {
    if (course) {
      fetchTutorDetails();
    }
  }, [course]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-blue-600 text-xl">Loading course...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-red-600 text-xl">Course not found</div>
      </div>
    );
  }

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex flex-col lg:flex-row w-full pt-16 flex-grow">
        <div className="lg:w-3/4 h-full flex flex-col">
          <div className="relative bg-black w-full" style={{ paddingTop: '56.25%' }}>
            {currentLecture ? (
              <iframe
                src={currentLecture.videoUrl || "/placeholder-video.mp4"}
                className="absolute top-0 left-0 w-full h-full"
                style={{ objectFit: "contain" }}
                allowFullScreen
              ></iframe>
            ) : (
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white">
                Select a lecture to start learning
              </div>
            )}
          </div>

          <div className="p-6 bg-white border-b">
            <Link href="/mylearning" className="flex items-center text-blue-600 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to My Learning
            </Link>

            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
                <p className="text-gray-600 mb-4">{course.subtitle}</p>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-gray-500 mr-1" />
                    <span className="text-gray-700">Tutor: {tutor?.username || "Unknown"}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-gray-700">{averageRating} Rating</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-500 mr-1" />
                    <span className="text-gray-700">{course.totalDuration} hours</span>
                  </div>
                </div>
              </div>

              {!hasPurchased() && (
                <div className="flex flex-col items-end">
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    {formatPrice(course.price)}
                  </div>
                  {course.price && (
                    <div className="text-sm text-gray-500 mb-2 line-through">
                      {formatPrice((course.price * 2) + 1)}
                    </div>
                  )}
                  <button
                    onClick={handlePayment}
                    disabled={isProcessingPayment}
                    className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center ${isProcessingPayment ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {isProcessingPayment ? 'Processing...' : 'Enroll Now'}
                  </button>
                </div>
              )}
            </div>

            {currentLecture && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h2 className="font-semibold text-gray-800">
                  Now Playing: {currentLecture.title}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Duration: {currentLecture.duration} minutes
                </p>
              </div>
            )}

            <div className="mt-4">
              {hasPurchased() ? (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center">
                  <Check className="w-5 h-5 mr-2" />
                  <span>You are enrolled in this course. Full access granted.</span>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md flex items-center">
                  <Lock className="w-5 h-5 mr-2" />
                  <span>Preview available. Purchase to unlock all content.</span>
                </div>
              )}
            </div>

            {hasPurchased() && hasValidSubscription() && (
              <div className="mt-4">
                <button
                  onClick={handleChatWithTutor}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 w-full max-w-xs"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  <span>Chat with Tutor</span>
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 p-6 bg-white border-t">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Student Reviews</h2>

            {hasPurchased() && !hasReviewed ? (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Submit Your Review</h3>
                <form onSubmit={handleReviewSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setUserReview({ ...userReview, rating: star })}
                          className={`w-8 h-8 flex items-center justify-center ${userReview.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          <Star className="w-6 h-6" fill={userReview.rating >= star ? '#FBBF24' : 'none'} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                    <textarea
                      value={userReview.review}
                      onChange={(e) => setUserReview({ ...userReview, review: e.target.value })}
                      className="w-full p-2 border text-gray-800 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      rows={4}
                      placeholder="Share your thoughts about the course..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            ) : hasPurchased() && hasReviewed ? (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-700">You have already submitted a review for this course.</p>
              </div>
            ) : null}

            {reviews.length > 0 ? (
              <>
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${star <= parseFloat(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill={star <= parseFloat(averageRating) ? '#FBBF24' : 'none'}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-lg text-gray-700 font-semibold">{averageRating}</span>
                  <span className="ml-2 text-sm text-gray-600">({reviews.length} reviews)</span>
                </div>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review._id} className="border-b pb-4">
                      <div className="flex items-center mb-2">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                          {review.userId?.username?.slice(0, 2).toUpperCase() || 'AN'}
                        </div>
                        <div className="ml-3">
                          <p className={`font-medium ${review.userId._id === userId ? 'font-semibold underline decoration-1 underline-offset-4 decoration-blue-300 text-gray-700' : 'text-gray-800'}`}>
                            {review.userId?.username || 'Anonymous'}
                          </p>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill={star <= review.rating ? '#FBBF24' : 'none'}
                              />
                            ))}
                            <span className="text-gray-500 text-sm ml-2">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.review}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-gray-600">No reviews yet. Be the first to share your feedback!</p>
            )}
          </div>
        </div>

        <div className="lg:w-1/4 bg-white border-l h-full overflow-y-auto">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800">Course Content</h2>
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>{course.totalSections} sections</span>
              <span>{course.totalLectures} lectures</span>
              <span>{course.totalDuration} hours</span>
            </div>
          </div>

          <div className="divide-y">
            {sections.map((section, sectionIndex) => {
              const sectionId = section._id.toString();
              const isFirstSection = sectionIndex === 0;
              const userCanAccessSection = hasPurchased() || isFirstSection;

              return (
                <div key={sectionId} className="border-b">
                  <button
                    className={`w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors ${!userCanAccessSection ? 'cursor-not-allowed opacity-75' : ''}`}
                    onClick={() => toggleSection(sectionId, sectionIndex)}
                    disabled={!userCanAccessSection}
                  >
                    <div className="flex-1 flex items-center">
                      {!userCanAccessSection && (
                        <Lock className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                      )}
                      <div>
                        <h3 className="font-medium text-gray-800 text-left">{section.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {section.totalLectures} lectures • {section.totalDuration} min
                        </p>
                      </div>
                    </div>
                    {userCanAccessSection ? (
                      expandedSections[sectionId] ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )
                    ) : (
                      <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Locked
                      </div>
                    )}
                  </button>

                  {expandedSections[sectionId] && userCanAccessSection && (
                    <div className="bg-gray-50 py-2">
                      {section.lectures && section.lectures.length > 0 ? (
                        section.lectures.map((lecture) => {
                          const isActive = currentLecture?._id === lecture._id;
                          const lectureStatus = getLectureStatus(lecture);
                          const userCanAccessLecture = hasPurchased() || isFirstSection || lecture.isPreview;

                          return (
                            <button
                              key={lecture._id.toString()}
                              className={`w-full p-3 flex items-center text-left hover:bg-gray-100 transition-colors ${isActive ? 'bg-blue-50' : ''} ${!userCanAccessLecture ? 'cursor-not-allowed opacity-75' : ''}`}
                              onClick={() => handleLectureSelect(lecture, sectionIndex)}
                              disabled={!userCanAccessLecture}
                            >
                              <div className="w-6 flex-shrink-0">
                                {hasPurchased() && lectureStatus === "completed" ? (
                                  <Check className="w-5 h-5 text-green-500" />
                                ) : lecture.isPreview || hasPurchased() || isFirstSection ? (
                                  <Play className="w-5 h-5 text-blue-500" />
                                ) : (
                                  <Lock className="w-5 h-5 text-gray-400" />
                                )}
                              </div>
                              <div className="ml-2 flex-1">
                                <p className={`${isActive ? 'text-blue-600 font-medium' : 'text-gray-800'}`}>
                                  {lecture.title}
                                </p>
                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                  <Clock className="w-3 h-3 mr-1" />
                                  <span>{lecture.duration} min</span>
                                  {lecture.isPreview && (
                                    <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                                      Preview
                                    </span>
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })
                      ) : (
                        <div className="text-center text-gray-500 py-4">
                          No lectures available
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!hasPurchased() && (
            <div className="p-4 bg-blue-50 border-t">
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm text-gray-700">
                  Unlock all {course.totalLectures} lectures
                </p>
                <div className="text-xl font-bold text-gray-900">
                  {formatPrice(course.price)}
                </div>
              </div>
              {course.price && (
                <div className="flex justify-between items-center mb-3">
                  <p className="text-xs text-gray-600">Original price</p>
                  <div className="text-sm text-gray-500 line-through">
                    {formatPrice((course.price * 2) + 1)}
                  </div>
                </div>
              )}
              <button
                onClick={handlePayment}
                disabled={isProcessingPayment}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center ${isProcessingPayment ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {isProcessingPayment ? 'Processing...' : 'Purchase this course'}
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CoursePreview;