'use client'

import React, { useEffect, useState, useRef } from 'react';
import {
  BookOpen,
  GraduationCap,
  MessageSquare,
  Calendar,
  ChevronRight,
  Bell,
  Settings,
  LogOut,
  Edit,
  Lock,
  Save,
  X
} from 'lucide-react';
import useAuthStore from '@/store/userAuthStore';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/student/navbar';
import { toast } from 'react-toastify';
import { getStudent, updateStudent } from '@/app/service/user/userApi';
import Spinner from '@/components/spinner';

// Define the Student interface
interface Student {
  username: string;
  email: string;
  status: number;
  role: string;
  subscription: {
    isActive: boolean;
    startDate: Date;
    endDate: Date;
  };
  freeCourseCount: number;
  profilePicture: string | null;
}

const Profile = () => {
  const [activeTab, setActiveTab] = useState('progress');
  const { logout } = useAuthStore();
  const { id } = useParams();
  const router = useRouter();

  const [student, setStudent] = useState<Student | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [initial, setInitial] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
  const [editedName, setEditedName] = useState(''); // Track edited name
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input

  const CLOUDINARY_CLOUD_NAME = "dhhzuean5";

  const getStudents = async () => {
    if (!id || Array.isArray(id)) {
      console.log("Invalid or missing student ID");
      return;
    }
    try {
      const response = await getStudent(id);
      console.log("student details in profile", response);
      if (response.success) {
        setStudent(response.data);
        setImage(response.data.profilePicture || null);
        setInitial(response.data.username?.charAt(0).toUpperCase() || null);
        setEditedName(response.data.username); // Initialize edited name
      }
    } catch (error) {
      console.log("Failed to fetch student details:", error);
      router.push('/not-found');
    }
  };

  useEffect(() => {
    if (id) {
      getStudents();
    }
  }, [id]);

  const currentCourses = [
    { name: "Advanced Web Development", progress: 75 },
    { name: "Data Structure", progress: 50 },
    { name: "Machine Learning Basics", progress: 50 }
  ];

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
    setEditedName(student?.username || ''); // Reset to original name
    setImage(student?.profilePicture || null); // Reset to original image
  };

  const handleSaveEdit = async () => {
    if (!student || !id || Array.isArray(id)) return;

    // Validate the edited name
    if (!editedName.trim()) {
      toast.error('Name cannot be empty.');
      return;
    }

    // Prepare the updated data
    const updatedData = {
      username: editedName,
      profilePicture: image,
    };

    try {
      // Call the backend API to update the student data
      const response = await updateStudent(id, updatedData);
      if (response.success) {
        // Update the local state with the updated data
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
    // toast.info('Reset password clicked!');
    router.push(`/passwordreset?email=${student?.email}`)
  };

  const handleImageClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Upload to Cloudinary
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

  if (!student) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto pt-32 px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6"> {/* Increased space-x-4 to space-x-6 for better spacing */}
              <div
                className={`relative ${isEditing ? 'cursor-pointer' : ''}`}
                onClick={handleImageClick}
              >
                {image ? (
                  <img
                    src={image}
                    alt={student.username}
                    className="h-24 w-24 rounded-full object-cover" // Increased from h-16 w-16 to h-24 w-24
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center"> {/* Increased from h-16 w-16 to h-24 w-24 */}
                    <span className="text-3xl font-semibold text-blue-600"> {/* Increased from text-xl to text-3xl */}
                      {getInitials(student.username)}
                    </span>
                  </div>
                )}
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                    <span className="text-white text-base"> {/* Increased from text-sm to text-base */}
                      Upload
                    </span>
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
              </div>
            </div>
            <div className="flex space-x-2">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                  <span className="ml-2 text-gray-600">Course Enrolled</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">{student.freeCourseCount}</span>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <GraduationCap className="h-6 w-6 text-green-600" />
                  <span className="ml-2 text-gray-600">Completed</span>
                </div>
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                  <span className="ml-2 text-gray-600">Messages</span>
                </div>
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex space-x-4 border-b mb-6">
            <button
              className={`pb-4 px-4 ${activeTab === 'progress'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500'
                }`}
              onClick={() => setActiveTab('progress')}
            >
              Progress
            </button>
            <button
              className={`pb-4 px-4 ${activeTab === 'schedule'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500'
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
                <div key={index} className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{course.name}</span>
                    <span className="text-sm text-gray-500">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
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
                <Calendar className="h-5 w-5 text-gray-500" />
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Advanced Web Development</p>
                      <p className="text-sm text-gray-500">Chapter {index + 4}: React Hooks</p>
                    </div>
                    <div className="flex items-center text-blue-600">
                      <span className="mr-2">Join</span>
                      <ChevronRight className="h-4 w-4" />
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