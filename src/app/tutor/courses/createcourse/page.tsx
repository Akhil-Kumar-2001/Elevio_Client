'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TutorSidebar from '@/components/tutor/tutorSidebar';
import Navbar from '@/components/tutor/navbar';
import { createCourse, getCategories } from '@/app/service/tutor/tutorApi';
import useAuthStore from '@/store/tutorAuthStore';
import { toast } from 'react-toastify';
import { ICourseData } from '@/types/types';

const AddCourseForm = () => {
  const router = useRouter();
  const { user } = useAuthStore();

  type Category = {
    _id: string;
    name: string;
  };


  // Form fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageThumbnail, setImageThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [description, setDescription] = useState('');
  const [expanded, setExpanded] = useState<boolean>(true);

  // Validation errors
  const [errors, setErrors] = useState({
    title: '',
    subtitle: '',
    price: '',
    category: '',
    imageThumbnail: '',
    description: ''
  });


  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      console.log('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCancel = () => {
    router.push('/tutor/courses');
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // Validate image size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          imageThumbnail: 'Image size should be less than 5MB'
        }));
        return;
      }

      // Validate image type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          imageThumbnail: 'Only JPEG, PNG, and WebP images are allowed'
        }));
        return;
      }

      setImageThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, imageThumbnail: '' }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      title: '',
      subtitle: '',
      price: '',
      category: '',
      imageThumbnail: '',
      description: ''
    };

    // Title validation
    if (!title.trim()) {
      newErrors.title = 'Course name is required';
      isValid = false;
    } else if (title.length < 3) {
      newErrors.title = 'Course name must be at least 3 characters';
      isValid = false;
    } else if (title.length > 100) {
      newErrors.title = 'Course name must be less than 100 characters';
      isValid = false;
    }

    // Subtitle validation
    if (!subtitle.trim()) {
      newErrors.subtitle = 'Course subtitle is required';
      isValid = false;
    } else if (subtitle.length < 3) {
      newErrors.subtitle = 'Course subtitle must be at least 3 characters';
      isValid = false;
    } else if (subtitle.length > 200) {
      newErrors.subtitle = 'Course subtitle must be less than 200 characters';
      isValid = false;
    }

    // Price validation
    if (!price) {
      newErrors.price = 'Course price is required';
      isValid = false;
    } else {
      const priceNumber = Number(price);
      if (isNaN(priceNumber)) {
        newErrors.price = 'Course price must be a valid number';
        isValid = false;
      } else if (priceNumber <= 0) {
        newErrors.price = 'Course price must be greater than zero';
        isValid = false;
      } else if (priceNumber > 9999) {
        newErrors.price = 'Course price must be less than $10,000';
        isValid = false;
      }
    }

    // Category validation
    if (!category) {
      newErrors.category = 'Course category is required';
      isValid = false;
    }

    // Image validation
    if (!imageThumbnail) {
      newErrors.imageThumbnail = 'Course thumbnail is required';
      isValid = false;
    }

    // Description validation
    if (!description.trim()) {
      newErrors.description = 'Course description is required';
      isValid = false;
    } else if (description.length < 20) {
      newErrors.description = 'Course description must be at least 20 characters';
      isValid = false;
    } else if (description.length > 1000) {
      newErrors.description = 'Course description must be less than 1000 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCreate = async () => {
    if (!validateForm() || !user?.id) return;

    try {
      const loadingToastId = toast.loading("Creating course...");

      const courseData: ICourseData = {
        tutorId: user.id,
        title,
        subtitle,
        price: Number(price),
        category,
        description,
        imageThumbnail: imageThumbnail as File,
      };

      const response = await createCourse(courseData);

      toast.dismiss(loadingToastId);

      if (response?.success) {
        toast.success(response.message);
        router.push('/tutor/courses');
      } else {
        toast.error(response?.message || 'Failed to create course');
      }
    } catch (error) {
      toast.dismiss();
      console.error('Error creating course:', error);
      toast.error('An error occurred while creating the course');
    }
  };

  // Handle price input change with validation
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow only numbers and decimal point
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setPrice(value);

      // Clear error if value is valid and greater than zero
      if (value === '' || Number(value) <= 0) {
        setErrors(prev => ({ ...prev, price: '' }));
      }
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 h-[calc(100vh-64px)] mt-14">
        <div className="w-64 bg-white">
          <TutorSidebar expanded={expanded} setExpanded={setExpanded} />
        </div>
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="flex justify-center items-center min-h-full py-8">
            <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold text-black text-center mb-6">Add New Course</h1>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Name *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (e.target.value.trim()) {
                        setErrors(prev => ({ ...prev, title: '' }));
                      }
                    }}
                    className={`w-full px-4 py-2 border text-gray-600 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 ${errors.title ? 'border-red-500' : ''}`}
                    placeholder="Enter course name"
                  />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Subtitle *</label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => {
                      setSubtitle(e.target.value);
                      if (e.target.value.trim()) {
                        setErrors(prev => ({ ...prev, subtitle: '' }));
                      }
                    }}
                    className={`w-full px-4 py-2 border text-gray-600 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 ${errors.subtitle ? 'border-red-500' : ''}`}
                    placeholder="Enter course subtitle"
                  />
                  {errors.subtitle && <p className="text-red-500 text-xs mt-1">{errors.subtitle}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Price ($) *</label>
                  <input
                    type="text"
                    value={price}
                    onChange={handlePriceChange}
                    onBlur={() => {
                      if (price && Number(price) <= 0) {
                        setErrors(prev => ({ ...prev, price: 'Course price must be greater than zero' }));
                      }
                    }}
                    className={`w-full px-4 py-2 border text-gray-600 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 ${errors.price ? 'border-red-500' : ''}`}
                    placeholder="Enter course price"
                    min="0.01"
                    step="0.01"
                  />
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      if (e.target.value) {
                        setErrors(prev => ({ ...prev, category: '' }));
                      }
                    }}
                    className={`w-full px-4 py-2 border text-gray-600 border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-200 appearance-none ${errors.category ? 'border-red-500' : ''}`}
                  >
                    <option value="" disabled>Select a category</option>
                    {categories.map((cat) => (
                      <option className="text-black" key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Thumbnail *</label>
                  <div className={`w-full h-60 border-2 border-dashed ${errors.imageThumbnail ? 'border-red-500' : 'border-gray-300'} flex items-center justify-center rounded-md overflow-hidden bg-gray-100 relative`}>
                    {thumbnailPreview ? (
                      <img src={thumbnailPreview} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-500">Click to upload thumbnail</span>
                    )}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,image/webp"
                      onChange={handleThumbnailChange}
                      className="absolute w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  {errors.imageThumbnail && <p className="text-red-500 text-xs mt-1">{errors.imageThumbnail}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Description *</label>
                  <textarea
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      if (e.target.value.trim()) {
                        setErrors(prev => ({ ...prev, description: '' }));
                      }
                    }}
                    className={`w-full px-4 py-2 border text-gray-600 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 resize-none h-24 ${errors.description ? 'border-red-500' : ''}`}
                    placeholder="Enter course description"
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                  <p className="text-xs text-gray-500 mt-1">{description.length}/1000 characters</p>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreate}
                    className="px-4 py-2 bg-black rounded-md text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={!title || !subtitle || !category || !price || !imageThumbnail || !description || Number(price) <= 0}
                  >
                    Create Course
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCourseForm;