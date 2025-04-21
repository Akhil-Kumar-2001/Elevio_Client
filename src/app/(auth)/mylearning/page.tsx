'use client'

import React, { useEffect, useState } from 'react';
import { BookOpen, Clock, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/student/navbar';
import Footer from '@/components/student/footer';
import useAuthStore from '@/store/userAuthStore';
import { ICourse, IProgress } from '@/types/types';
import { getProgress, getPurchasedCourses } from '@/app/service/user/userApi';
import Image from 'next/image';

const MyLearning = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, IProgress>>({});
  const { user } = useAuthStore();
  const userId = user?.id;

  const purchasedCourses = async () => {
    if (!userId) {
      console.log("User id is not available");
      return;
    }
    try {
      const response = await getPurchasedCourses(userId);
      if (response.success) {
        setCourses(response.data);
      }
    } catch (error) {
      console.log("Error while getting Purchased Courses:", error);
    }
  };

  const fetchProgressForCourses = async () => {
    if (!courses.length) return;
    try {
      const progressPromises = courses.map(course =>
        getProgress(course._id).then(response => ({
          courseId: course._id,
          progress: response?.success ? response.data : null
        }))
      );
      const progressResults = await Promise.all(progressPromises);
      const progressData = progressResults.reduce((acc, { courseId, progress }) => {
        if (progress) {
          acc[courseId] = progress;
        }
        return acc;
      }, {} as Record<string, IProgress>);
      setProgressMap(progressData);
    } catch (error) {
      console.error("Error fetching progress for courses:", error);
    }
  };

  useEffect(() => {
    purchasedCourses();
  }, [userId]);

  useEffect(() => {
    fetchProgressForCourses();
  }, [courses]);

  const NavigateToCourse = (courseId: string) => {
    router.push(`/coursePreview/${courseId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Header */}
      <header className="bg-gradient-to-r pt-20 from-blue-50 to-blue-100 shadow-md">
        <div className="w-full px-16 py-6">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            My Learning
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-16 py-10">
        {(courses ?? []).length === 0 ? (
          <div className="text-center text-gray-600 py-10">
            No courses purchased yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => {
              const courseProgress = progressMap[course._id];
              const progressPercentage = courseProgress?.progressPercentage || 0;

              return (
                <div
                  key={course._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="relative h-48">
                    <Image
                      src={course.imageThumbnail}
                      alt={course.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: 'cover' }}
                      className="rounded-t-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white text-sm font-medium">
                      {Math.round(progressPercentage)}% Complete
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-gray-600 font-medium">Progress</span>
                        <span className="font-semibold text-blue-600">
                          {Math.round(progressPercentage)}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-700 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Course Stats */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>{course.totalDuration} hours</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>{course.avgRating}</span>
                      </div>
                    </div>

                    {/* Continue Learning Button */}
                    <button
                      onClick={() => NavigateToCourse(course._id)}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-2 px-4 rounded-lg shadow-md hover:from-blue-700 hover:to-blue-900 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <BookOpen className="w-4 h-4" />
                      Continue Learning
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyLearning;