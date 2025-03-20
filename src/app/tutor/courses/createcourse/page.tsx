'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import TutorSidebar from '@/components/tutor/tutorSidebar';
import Navbar from '@/components/tutor/navbar';
import axios from 'axios';
import { createCourse, getCategories } from '@/app/service/tutor/tutorApi';
import useAuthStore from '@/store/tutorAuthStore';

const AddCourseForm = () => {
  const router = useRouter();
  const { user } = useAuthStore();

  type Category = {
    _id: string;
    name: string;
  };

  interface CourseData {
    tutorId: string;
    title: string;
    subtitle: string;
    price: number;
    category: string;
    imageThumbnail: string;
    description: string;
  }

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState(''); // Added subtitle state
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageThumbnail, setImageThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [description, setDescription] = useState('');

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      console.log('Error fetching categories:', error);
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
      setImageThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleCreate = async () => {
    if (!title || !subtitle || !category || !price || !imageThumbnail || !description || !user?.id) return;

    try {
      const formData = new FormData();
      formData.append('file', imageThumbnail);
      formData.append('upload_preset', 'tutor_documents');

      const cloudinaryRes = await axios.post(
        'https://api.cloudinary.com/v1_1/dhhzuean5/image/upload',
        formData
      );

      const courseData: CourseData = {
        tutorId: user.id,
        title,
        subtitle, // Added subtitle field
        price: Number(price),
        category,
        imageThumbnail: cloudinaryRes.data.secure_url,
        description,
      };

      console.log('Course Data:', courseData);
      await createCourse(courseData);
      router.push('/tutor/courses');
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 h-[calc(100vh-64px)]">
        <div className="w-64 bg-white">
          <TutorSidebar />
        </div>
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="flex justify-center items-center min-h-full py-8">
            <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold text-black text-center mb-6">Add New Course</h1>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    className="w-full px-4 py-2 border text-gray-600 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200" 
                    placeholder="Enter course name" 
                  />
                </div>
                
                {/* New Subtitle Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Subtitle</label>
                  <input 
                    type="text" 
                    value={subtitle} 
                    onChange={(e) => setSubtitle(e.target.value)} 
                    className="w-full px-4 py-2 border text-gray-600 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200" 
                    placeholder="Enter course subtitle" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Price ($)</label>
                  <input 
                    type="number" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    className="w-full px-4 py-2 border text-gray-600 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200" 
                    placeholder="Enter course price" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)} 
                    className="w-full px-4 py-2 border text-gray-600 border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-200 appearance-none"
                  >
                    <option value="" disabled>Select a category</option>
                    {categories.map((cat) => (
                      <option className="text-black" key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Thumbnail</label>
                  <div className="w-full h-60 border-2 border-dashed border-gray-300 flex items-center justify-center rounded-md overflow-hidden bg-gray-100 relative">
                    {thumbnailPreview ? (
                      <img src={thumbnailPreview} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-500">Click to upload thumbnail</span>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleThumbnailChange} 
                      className="absolute w-full h-full opacity-0 cursor-pointer" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Description</label>
                  <textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    className="w-full px-4 py-2 border text-gray-600 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 resize-none h-24" 
                    placeholder="Enter course description"
                  />
                </div>
                <div className="flex justify-end space-x-4 pt-4">
                  <button onClick={handleCancel} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                  <button onClick={handleCreate} className="px-4 py-2 bg-black rounded-md text-white hover:bg-gray-800" disabled={!title || !subtitle || !category || !price || !imageThumbnail || !description}>Create Course</button>
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
