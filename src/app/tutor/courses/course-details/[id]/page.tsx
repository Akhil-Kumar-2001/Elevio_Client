'use client'

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/tutor/navbar';
import TutorSidebar from '@/components/tutor/tutorSidebar';
import { getCourseDetails, updateCourse, getCategories } from '@/app/service/tutor/tutorApi';
import { toast } from 'react-toastify';
import { Course, Category } from '@/types/types';
import Image from 'next/image';
import { Camera } from 'lucide-react';
import axios from 'axios';

const CourseDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const [course, setCourse] = useState<Course | null>(null);
  const [editedCourse, setEditedCourse] = useState<Partial<Course> | null>(null);
  const [courseId, setCourseId] = useState<string | null>(null);

  // Image upload states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Hardcoded Cloudinary cloud name - replace with your own
  const CLOUDINARY_CLOUD_NAME = "dhhzuean5";

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await getCourseDetails(id as string);
      console.log('Fetched course details:', response); // Debug log
      if (response && response.success) {
        const newCourseData = { ...response.data }; // Deep copy
        setCourse(newCourseData);
        setEditedCourse(newCourseData);
        console.log('Updated course state:', newCourseData); // Debug log
      } else {
        toast.error('Failed to fetch course details');
        router.push('/tutor/courses');
      }
    } catch (error) {
      console.error('Error fetching course details:', error);
      router.push('/tutor/courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      if (response && response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  useEffect(() => {
    if (id) {
      setCourseId(id as string);
      fetchCourseDetails();
      fetchCategories();
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedCourse(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (editMode) {
      setEditedCourse({ ...course }); // Reset to original course data
      setImagePreview(null);
    }
    setEditMode(!editMode);
  };

  const uploadToCloudinary = async (file: File) => {
    try {
      setImageUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "tutor_documents");
      formData.append("folder", "course_thumbnails");

      const uploadResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(progress);
            }
          }
        }
      );

      return uploadResponse.data.secure_url;
    } catch (error) {
      console.error("Error uploading course thumbnail:", error);
      toast.error("Failed to upload course thumbnail. Please try again.");
      throw new Error("Failed to upload course thumbnail");
    } finally {
      setImageUploading(false);
      setUploadProgress(0);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);

      try {
        const imageUrl = await uploadToCloudinary(file);
        setEditedCourse(prev => ({
          ...prev,
          imageThumbnail: imageUrl
        }));
      } catch (error) {
        console.log(`Error while uploading course thumbnail to Cloudinary: ${error}`);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editedCourse) return;

    setSubmitting(true);
    try {
      const courseToUpdate = { ...editedCourse };
      if (typeof courseToUpdate.category === 'object' && courseToUpdate.category?._id) {
        courseToUpdate.category = courseToUpdate.category._id;
      }

      const response = await updateCourse(id as string, courseToUpdate as Course);
      console.log('Update response:', response); // Debug log
      if (response && response.success) {
        toast.success('Course updated successfully');
        
        // Immediately update the course state with editedCourse to reflect changes in UI
        const updatedCourse = { ...course, ...courseToUpdate } as Course;
        setCourse(updatedCourse);
        setEditedCourse(updatedCourse); // Sync editedCourse with the updated data
        
        // Re-fetch from server to ensure consistency (optional, but keeps data in sync)
        await fetchCourseDetails();
        
        setEditMode(false);
        setImagePreview(null);
      } else {
        toast.error('Failed to update course');
      }
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Failed to update course');
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryName = (category: any) => {
    if (!category) return "Uncategorized";
    if (typeof category === "string") return "Uncategorized";
    return category.name || "Uncategorized";
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-10 bg-white">
        <Navbar />
      </div>

      <div className="flex pt-16 h-full">
        <div className="fixed left-0 top-16 bottom-0 z-10 bg-white">
          <TutorSidebar />
        </div>

        <div className="flex-1 ml-64 bg-white w-full">
          <div className="h-full overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-medium text-gray-800">Course Details</h1>
              <button
                onClick={() => router.push('/tutor/courses')}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
                type="button"
              >
                Back to Courses
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p>Loading course details...</p>
              </div>
            ) : course ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative">
                  <div className="w-full h-60 relative">
                    <Image
                      src={imagePreview || editedCourse?.imageThumbnail || "/api/placeholder/1200/300"}
                      alt={editedCourse?.title || "Course thumbnail"}
                      layout="fill"
                      objectFit="cover"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {editMode && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="bg-white p-4 rounded-md">
                        <input
                          type="file"
                          id="course-image"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          disabled={imageUploading}
                        />
                        <label
                          htmlFor="course-image"
                          className="bg-white text-blue-600 px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-blue-600 hover:text-white transition-colors duration-300 flex items-center gap-2"
                        >
                          {imageUploading ? "Uploading..." : (
                            <>
                              <Camera className="w-4 h-4" />
                              Change Thumbnail
                            </>
                          )}
                        </label>
                      </div>

                      {imageUploading && uploadProgress > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gray-200 h-2">
                          <div
                            className="bg-blue-600 h-full"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {editMode ? (
                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title
                          <input
                            type="text"
                            name="title"
                            value={editedCourse?.title || ''}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </label>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Subtitle
                          <input
                            type="text"
                            name="subtitle"
                            value={editedCourse?.subtitle || ''}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </label>
                      </div>

                      <div className="flex items-center gap-4 mb-5">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                            <select
                              name="category"
                              value={typeof editedCourse?.category === 'object' ?
                                editedCourse?.category?._id :
                                editedCourse?.category || ''}
                              onChange={handleInputChange}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                              {categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                  {category.name}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>

                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price (₹)
                            <input
                              type="number"
                              name="price"
                              value={editedCourse?.price || 0}
                              onChange={handleInputChange}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              min="0"
                              required
                            />
                          </label>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
                        <textarea
                          name="description"
                          value={editedCourse?.description || ''}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          rows={5}
                        />
                      </div>

                      <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Course Status</h2>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${course.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                        >
                          {course.status}
                        </span>
                      </div>

                      <div className="flex space-x-4">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-green-300"
                        >
                          {submitting ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                          type="button"
                          onClick={handleEditToggle}
                          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <h1 className="text-3xl font-bold text-gray-900 mb-1">{course.title}</h1>
                      <p className="text-gray-600 mb-5">{course.subtitle}</p>

                      <div className="flex items-center gap-4 mb-5">
                        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                          {getCategoryName(course.category)}
                        </span>
                        <span className="text-2xl text-black font-bold">₹{course.price}</span>
                      </div>

                      <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
                        <p className="text-gray-700">{course.description}</p>
                      </div>

                      <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Course Status</h2>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${course.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                        >
                          {course.status}
                        </span>
                      </div>

                      <div className="flex space-x-4">
                        <button
                          type="button"
                          onClick={handleEditToggle}
                          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-700"
                        >
                          Edit Course Details
                        </button>
                        <button
                          type="button"
                          onClick={() => router.push(`/tutor/courses/course-details/section/${course._id}`)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                          Manage Content
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-64">
                <p>Course not found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;