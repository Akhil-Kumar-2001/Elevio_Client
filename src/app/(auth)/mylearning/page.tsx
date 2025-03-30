// src/pages/Profile.jsx
'use client'

import React from 'react';
import { BookOpen, Clock, Star } from 'lucide-react';
import Navbar from '@/components/student/navbar';
import Footer from '@/components/student/footer';

interface Course {
  id: number;
  title: string;
  description: string;
  progress: number;
  duration: string;
  rating: number;
  image: string;
}

const courses: Course[] = [
  {
    id: 1,
    title: "Complete Web Development Course",
    description: "Master modern web development with this comprehensive course covering HTML, CSS, JavaScript, and more.",
    progress: 65,
    duration: "48 hours",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&q=80&w=400&h=300",
  },
  {
    id: 2,
    title: "Advanced JavaScript Masterclass",
    description: "Deep dive into advanced JavaScript concepts, design patterns, and modern ES6+ features.",
    progress: 30,
    duration: "32 hours",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1579403124614-197f69d8187b?auto=format&fit=crop&q=80&w=400&h=300",
  },
  {
    id: 3,
    title: "UI/UX Design Fundamentals",
    description: "Learn the principles of user interface and experience design to create beautiful, functional websites.",
    progress: 15,
    duration: "24 hours",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&q=80&w=400&h=300",
  },
];

const Profile = () => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-48">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white text-sm font-medium">
                  {course.progress}% Complete
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
                      {course.progress}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-700 rounded-full transition-all duration-500"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>

                {/* Course Stats */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>{course.rating}</span>
                  </div>
                </div>

                {/* Continue Learning Button */}
                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-2 px-4 rounded-lg shadow-md hover:from-blue-700 hover:to-blue-900 transition-all duration-300 flex items-center justify-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Continue Learning
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;