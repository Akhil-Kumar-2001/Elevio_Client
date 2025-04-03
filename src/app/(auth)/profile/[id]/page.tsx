
'use client'

import React, { useEffect, useState, useRef } from 'react';
import {
  BookOpen,
  GraduationCap,
  MessageSquare,
  Calendar,
  ChevronRight,
  LogOut,
  Edit,
  Lock,
  Save,
  X,
  Star,
  Clock
} from 'lucide-react';
import useAuthStore from '@/store/userAuthStore';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/student/navbar';
import { toast } from 'react-toastify';
import { getStudent, getSubscription, updateStudent } from '@/app/service/user/userApi';
import Spinner from '@/components/spinner';

// Define the Student interface
interface Student {
  username: string;
  email: string;
  status: number;
  role: string;
  enrolledCourseCount: number;
  profilePicture: string | null;
}

// Define the Subscription interface
interface Subscription {
  _id: string;
  planId: {
    planName: string;
    duration: {
      value: number;
      unit: string;
    }
    price: number;
    features: string[];
  };
  status: string;
  startDate: Date;
  endDate: Date;
}

const Profile = () => {
  const [activeTab, setActiveTab] = useState('progress');
  const { logout } = useAuthStore();
  const { id } = useParams();
  const router = useRouter();

  const [student, setStudent] = useState<Student | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [initial, setInitial] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [loading, setLoading] = useState(true);
  const [completedCourses, setCompletedCourses] = useState(0);
  const [messages, setMessages] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const CLOUDINARY_CLOUD_NAME = "dhhzuean5";

  const fetchProfileData = async () => {
    console.log("fetchProfileData started with id:", id);
    if (!id || Array.isArray(id)) {
      console.log("Invalid or missing student ID");
      setLoading(false);
      return;
    }

    try {
      // Fetch student data
      console.log("Fetching student data...");
      const studentResponse = await getStudent(id);
      console.log("Student response:", studentResponse);
      if (studentResponse.success) {
        setStudent(studentResponse.data);
        setImage(studentResponse.data.profilePicture || null);
        setInitial(studentResponse.data.username?.charAt(0).toUpperCase() || null);
        setEditedName(studentResponse.data.username);
      } else {
        console.log("Student fetch failed:", studentResponse);
        throw new Error('Failed to fetch student data');
      }

      // Fetch subscription data
      console.log("Fetching subscription data...");
      try {
        const subscriptionResponse = await getSubscription(id);
        console.log("Subscription response:", subscriptionResponse);
        if (subscriptionResponse.success && subscriptionResponse.data) {
          setSubscription(subscriptionResponse.data);
        } else {
          console.log("No subscription data found");
          setSubscription(null);
        }
        setCompletedCourses(3); // Placeholder
        setMessages(2); // Placeholder
      } catch (subError) {
        console.log("Subscription fetch failed (non-critical):", subError);
        setSubscription(null); // Subscription is optional
      }
    } catch (error) {
      console.error("Critical error in fetchProfileData:", error);
      router.push('/not-found');
    } finally {
      console.log("Setting loading to false");
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("useEffect triggered with id:", id);
    if (id) {
      fetchProfileData();
    } else {
      console.log("No id provided, setting loading to false");
      setLoading(false);
    }
  }, [id]);

  const currentCourses = [
    { name: "Advanced Web Development", progress: 75 },
    { name: "Data Structure", progress: 50 },
    { name: "Machine Learning Basics", progress: 50 }
  ];

  const getDaysRemaining = () => {
    if (!subscription || subscription.status !== 'active' || !subscription.endDate) {
      return 0;
    }
    const endDate = new Date(subscription.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('authUserCheck');
    toast.success('Logged out successfully!');
    router.push('/login');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedName(student?.username || '');
    setImage(student?.profilePicture || null);
  };

  const handleSaveEdit = async () => {
    if (!student || !id || Array.isArray(id)) return;

    if (!editedName.trim()) {
      toast.error('Name cannot be empty.');
      return;
    }

    const updatedData = {
      username: editedName,
      profilePicture: image,
    };

    try {
      const response = await updateStudent(id, updatedData);
      if (response.success) {
        const updatedStudent = { ...student, username: editedName, profilePicture: image };
        setStudent(updatedStudent);
        setInitial(editedName.charAt(0).toUpperCase());
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.log("Failed to update profile:", error);
      toast.error('Failed to update profile.');
    }
  };

  const handleResetPassword = () => {
    router.push(`/passwordreset?email=${student?.email}`);
  };

  const handleImageClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'tutor_documents');
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await response.json();
      if (data.secure_url) {
        setImage(data.secure_url);
        toast.success('Profile photo uploaded successfully!');
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      console.log("Failed to upload image to Cloudinary:", error);
      toast.error('Failed to upload profile photo.');
    }
  };

  console.log("Rendering with loading:", loading, "student:", student);

  if (loading) {
    return <Spinner />;
  }

  if (!student) {
    return <div className="min-h-screen flex items-center justify-center">No student data found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto pt-32 px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-6">
              <div
                className={`relative ${isEditing ? 'cursor-pointer' : ''}`}
                onClick={handleImageClick}
              >
                {image ? (
                  <img
                    src={image}
                    alt={student.username}
                    className="h-24 w-24 rounded-full object-cover border-4 border-blue-100"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center border-4 border-blue-100">
                    <span className="text-3xl font-semibold text-white">
                      {getInitials(student.username)}
                    </span>
                  </div>
                )}
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                    <span className="text-white text-base">Upload</span>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                  accept="image/*"
                />
              </div>
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="text-2xl font-bold text-gray-900 border-b border-gray-300 focus:outline-none focus:border-blue-600"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-gray-900">{student.username}</h1>
                )}
                <p className="text-gray-500">{student.email}</p>
                {subscription ? (
                  <div className="mt-2 flex items-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        subscription.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {subscription.status === 'active' ? 'Active Subscription' : 'Inactive Subscription'}
                    </span>
                    {subscription.status === 'active' && (
                      <span className="ml-2 text-sm text-gray-600">
                        {getDaysRemaining()} days remaining
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      No Active Subscription
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex space-x-2 mt-4 md:mt-0">
              {isEditing ? (
                <>
                  <button
                    className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors relative group"
                    onClick={handleSaveEdit}
                  >
                    <Save className="h-5 w-5" />
                    <span className="absolute right-0 top-[-2.5rem] bg-green-600 text-white text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Save
                    </span>
                  </button>
                  <button
                    className="p-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors relative group"
                    onClick={handleCancelEdit}
                  >
                    <X className="h-5 w-5" />
                    <span className="absolute right-0 top-[-2.5rem] bg-gray-600 text-white text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Cancel
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition-colors relative group"
                    onClick={handleEdit}
                  >
                    <Edit className="h-5 w-5" />
                    <span className="absolute right-0 top-[-2.5rem] bg-gray-800 text-white text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Edit Profile
                    </span>
                  </button>
                  <button
                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors relative group"
                    onClick={handleResetPassword}
                  >
                    <Lock className="h-5 w-5" />
                    <span className="absolute right-0 top-[-2.5rem] bg-blue-600 text-white text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Reset Password
                    </span>
                  </button>
                  <button
                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors relative group"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="absolute right-0 top-[-2.5rem] bg-red-600 text-white text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Logout
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>

          {subscription && subscription.status === 'active' && (
            <div className="mt-6">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl overflow-hidden shadow-lg">
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <Star className="h-6 w-6 text-yellow-300 mr-2" />
                        <h3 className="text-xl font-semibold text-white">{subscription.planId.planName}</h3>
                      </div>
                      <p className="text-blue-100 mt-1">
                        {subscription.planId.duration.value} {subscription.planId.duration.unit}
                        {subscription.planId.duration.value > 1 ? 's' : ''} subscription
                      </p>
                    </div>
                    <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-white mr-1" />
                        <span className="text-white text-sm font-medium">{getDaysRemaining()} days left</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white bg-opacity-10 px-5 py-3 flex justify-between items-center">
                  <div className="text-white text-sm">
                    <span>Started: </span>
                    <span className="font-medium">{new Date(subscription.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="text-white text-sm">
                    <span>Expires: </span>
                    <span className="font-medium">{new Date(subscription.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-blue-200 p-2 rounded-lg">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="ml-3 text-gray-700 font-medium">Courses Enrolled</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">{student.enrolledCourseCount || 0}</span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-green-200 p-2 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="ml-3 text-gray-700 font-medium">Completed</span>
                </div>
                <span className="text-2xl font-bold text-green-600">{completedCourses}</span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-purple-200 p-2 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className="ml-3 text-gray-700 font-medium">Messages</span>
                </div>
                <span className="text-2xl font-bold text-purple-600">{messages}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex space-x-4 border-b mb-6">
            <button
              className={`pb-4 px-4 font-medium ${
                activeTab === 'progress'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('progress')}
            >
              Progress
            </button>
            <button
              className={`pb-4 px-4 font-medium ${
                activeTab === 'schedule'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('schedule')}
            >
              Schedule
            </button>
          </div>

          {activeTab === 'progress' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Current Courses</h3>
              {currentCourses.map((course, index) => (
                <div key={index} className="bg-gray-50 p-5 rounded-xl hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-900">{course.name}</span>
                    <span className="text-sm font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {course.progress}% complete
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Classes</h3>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((_, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-5 rounded-xl hover:shadow-md transition-shadow border border-gray-100"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Advanced Web Development</p>
                        <p className="text-sm text-gray-500 mt-1">Chapter {index + 4}: React Hooks</p>
                        <p className="text-xs text-blue-600 mt-2">Today, 2:00 PM - 3:30 PM</p>
                      </div>
                      <button className="flex items-center text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
                        <span className="mr-2">Join</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;