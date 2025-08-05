'use client'

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/tutor/navbar';
import TutorSidebar from '@/components/tutor/tutorSidebar';
import { getCourseDetails, updateCourse, getCategories } from '@/app/service/tutor/tutorApi';
import { toast } from 'react-toastify';
import { Course, Category, ICategory } from '@/types/types';
import Image from 'next/image';
import { Camera, Edit, FileText, CheckCircle, ArrowLeft, Eye } from 'lucide-react';
import axios from 'axios';

const CourseDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // State for modal visibility
  const [expanded, setExpanded] = useState<boolean>(true); // Sync with TutorSidebar


  const [course, setCourse] = useState<Course | null>(null);
  const [editedCourse, setEditedCourse] = useState<Partial<Course> | null>(null);
  const [courseId, setCourseId] = useState<string | null>(null);

  // Image upload states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Hardcoded Cloudinary cloud name - replace with your own
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await getCourseDetails(id as string);
      if (response && response.success) {
        const newCourseData = { ...response.data };
        setCourse(newCourseData);
        setEditedCourse(newCourseData);
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
      console.log(error)
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
      formData.append("upload_preset", "Course_Thumbnail");
      formData.append("folder", "Course-Thumbnail");

      const uploadResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
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


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) setImagePreview(event.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!editedCourse) return;

  setSubmitting(true);

  try {
    // Prepare FormData for file upload + trimmed data fields
    const formData = new FormData();
    formData.append('id', id as string);

    // List of allowed fields to send
    const allowedFields = ["title", "subtitle", "price", "description", "category", "status"];

    allowedFields.forEach((field) => {
      const value = (editedCourse as any)[field]; // ts workaround

      if (value !== undefined && value !== null) {
        if (field === "category" && typeof value === "object" && value._id) {
          formData.append(field, value._id);
        } else {
          formData.append(field, value.toString());
        }
      }
    });

    // Append image file only if selected
    if (imageFile) formData.append('imageThumbnail', imageFile);

    const response = await updateCourse(formData);

    if (response && response.success) {
      toast.success('Course updated successfully');
      await fetchCourseDetails();
      setEditMode(false);
      setImageFile(null);
      setImagePreview(null);
    } else {
      toast.error('Failed to update course');
    }
  } catch (error) {
    toast.error('Failed to update course');
  } finally {
    setSubmitting(false);
  }
};



  const handleListCourse = async () => {
    if (!course || !courseId) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('id', courseId);

      // Append all course fields - or at minimum update status
      Object.entries(course).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'category' && typeof value === 'object' && '_id' in value) {
            formData.append(key, (value as any)._id);
          } else {
            formData.append(key, value as any);
          }
        }
      });

      // Overwrite status to "listed"
      formData.set('status', 'listed')

      const response = await updateCourse(formData);

      if (response && response.success) {
        toast.success('Course listed successfully');
        const updatedCourseData = { ...course, status: 'listed' };
        setCourse(updatedCourseData);
        setEditedCourse(updatedCourseData);
        await fetchCourseDetails();
      } else {
        toast.error('Failed to list course');
      }
    } catch (error) {
      console.error('Error listing course:', error);
      toast.error('Failed to list course');
    } finally {
      setSubmitting(false);
    }
  };


  // Function to show the confirmation modal
  const handleShowConfirmModal = () => {
    setShowConfirmModal(true);
  };

  // Function to close the confirmation modal
  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
  };

  // Function to confirm and list the course
  const handleConfirmListCourse = async () => {
    handleCloseConfirmModal(); // Close the modal
    await handleListCourse(); // Proceed with listing the course
  }

  const getCategoryName = (category: ICategory) => {
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
          <TutorSidebar expanded={expanded} setExpanded={setExpanded} />
        </div>

        {/* <div className="flex-1 ml-64 bg-white w-full"> */}
        <div className={`flex-1 bg-white w-ful transition-all duration-300 ${expanded ? 'pl-64' : 'pl-24'}`}>

          <div className="h-full overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-medium text-gray-800">Course Details</h1>
              <div className="group relative">
                <button
                  onClick={() => router.push('/tutor/courses')}
                  className="p-2.5 bg-gray-500 text-white rounded-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors duration-200"
                  type="button"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 top-12 right-0 bg-gray-500 text-white text-xs rounded py-1 px-3 whitespace-nowrap z-50 min-w-max">
                  Back to Courses
                  <div className="absolute top-[-4px] right-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-500" />
                </div>
              </div>
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
                          className="bg-white text-blue-600 px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-blue-600 hover:text-white transition-colors duration-200 flex items-center gap-2"
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
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          rows={5}
                        />
                      </div>

                      <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Course Status</h2>
                        <div className="group relative inline-block">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${course.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : course.status === 'accepted'
                                ? 'bg-blue-100 text-blue-800'
                                : course.status === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                          >
                            {course.status}
                          </span>
                          {course.status === 'rejected' && course.rejectedReason && (
                            <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 top-1/2 left-full ml-3 -translate-y-1/2 bg-red-600 text-white text-sm rounded-lg p-4 w-80 z-50">
                              <p className="whitespace-pre-wrap leading-relaxed">{course.rejectedReason}</p>
                              <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-full w-0 h-0 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-red-600" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="px-6 py-2.5 bg-green-600 text-white font-medium text-sm rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-green-300 transition-colors duration-200"
                        >
                          {submitting ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                          type="button"
                          onClick={handleEditToggle}
                          className="px-6 py-2.5 bg-gray-600 text-white font-medium text-sm rounded-lg shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
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
                          {typeof course.category === 'object' ? getCategoryName(course.category) : "Uncategorized"}
                        </span>
                        <span className="text-2xl text-black font-bold">₹{course.price}</span>
                      </div>

                      <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
                        <p className="text-gray-700">{course.description}</p>
                      </div>

                      <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Course Status</h2>
                        <div className="group relative inline-block">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${course.status === 'listed'
                              ? 'bg-green-100 text-green-800'
                              : course.status === 'accepted'
                                ? 'bg-blue-100 text-blue-800'
                                : course.status === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                          >
                            {course.status}
                          </span>
                          {course.status === 'rejected' && course.rejectedReason && (
                            <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 top-1/2 left-full ml-3 -translate-y-1/2 bg-red-600 text-white text-sm rounded-lg p-4 w-80 z-50">
                              <p className="whitespace-pre-wrap leading-relaxed">{course.rejectedReason}</p>
                              <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-full w-0 h-0 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-red-600" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <div className="group relative">
                          <button
                            type="button"
                            onClick={handleEditToggle}
                            className="p-2.5 bg-gray-800 text-white rounded-full shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 transition-colors duration-200"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 -top-10 left-0 bg-gray-800 text-white text-xs rounded py-1 px-3 whitespace-nowrap z-50 min-w-max">
                            Edit Course Details
                            <div className="absolute bottom-[-4px] left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800" />
                          </div>
                        </div>

                        <div className="group relative">
                          <button
                            type="button"
                            onClick={() => router.push(`/tutor/courses/course-details/section/${course._id}`)}
                            className="p-2.5 bg-blue-600 text-white rounded-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                          >
                            <FileText className="w-5 h-5" />
                          </button>
                          <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 -top-10 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs rounded py-1 px-3 whitespace-nowrap z-50 min-w-max">
                            Manage Content
                            <div className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-blue-600" />
                          </div>
                        </div>

                        <div className="group relative">
                          <button
                            type="button"
                            onClick={() => router.push(`/tutor/courses/preview/${course._id}`)}
                            className="p-2.5 bg-purple-600 text-white rounded-full shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-200"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 -top-10 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white text-xs rounded py-1 px-3 whitespace-nowrap z-50 min-w-max">
                            Preview Course
                            <div className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-purple-600" />
                          </div>
                        </div>

                        {course.status === 'accepted' && (
                          <div className="group relative">
                            <button
                              type="button"
                              onClick={handleShowConfirmModal} // Show the confirmation modal instead of directly listing
                              disabled={submitting}
                              className="p-2.5 bg-green-600 text-white rounded-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-green-300 transition-colors duration-200"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 -top-10 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs rounded py-1 px-3 whitespace-nowrap z-50 min-w-max">
                              {submitting ? 'Listing...' : 'List Course'}
                              <div className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-green-600" />
                            </div>
                          </div>
                        )}
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

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Confirm Listing</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to list this course? This action will make the course publicly available.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseConfirmModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmListCourse}
                disabled={submitting}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-green-300 transition-colors duration-200"
              >
                {submitting ? 'Listing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetailPage;