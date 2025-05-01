"use client";

import Navbar from "@/components/tutor/navbar";
import React, { useEffect, useState } from "react";
import { GraduationCap, Briefcase, Code, X, Edit, Camera } from "lucide-react";
import { getTutor, updateTutor } from "@/app/service/tutor/tutorApi";
import useAuthStore from "@/store/tutorAuthStore";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";

const ProfileSettings = () => {
  interface TutorType {
    username: string;
    email: string;
    profile: {
      bio?: string;
      profilePicture?: string;
      qualification?: string;
      experience?: string;
      skills?: string[];
      documents?: {
        fileUrl: string;
        type: "id_verification" | "experience_certificate" | string;
      }[];
    };
  }

  const { user } = useAuthStore();
  const tutorId = user?.id;

  const [tutor, setTutor] = useState<TutorType | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<TutorType>({
    username: "",
    email: "",
    profile: {
      bio: "",
      profilePicture: "",
      qualification: "",
      experience: "",
      skills: [],
    },
  });
  const [newSkill, setNewSkill] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Hardcoded Cloudinary cloud name
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  useEffect(() => {
    const fetchTutorDetails = async () => {
      try {
        if (!tutorId) return;
        const response = await getTutor(tutorId);
        setTutor(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error("Failed to fetch tutor details:", error);
      }
    };

    fetchTutorDetails();
  }, [tutorId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [name]: value,
      },
    }));
  };

  console.log(imageFile)

  // Upload image to Cloudinary
  const uploadToCloudinary = async (file: File) => {
    try {
      setImageUploading(true);
      setUploadProgress(0);

      // Create a FormData instance
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "Profile_Picture"); 
      formData.append("folder", "tutor_profiles"); 

      // Upload to Cloudinary
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

      // Return the secure URL of the uploaded file
      return uploadResponse.data.secure_url;
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast.error("Failed to upload profile picture. Please try again.");
      throw new Error("Failed to upload profile picture");
    } finally {
      setImageUploading(false);
      setUploadProgress(0);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      // Create a preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);

      try {
        // Upload to Cloudinary immediately when file is selected
        const imageUrl = await uploadToCloudinary(file);

        // Update formData with the Cloudinary URL
        setFormData(prev => ({
          ...prev,
          profile: {
            ...prev.profile,
            profilePicture: imageUrl
          }
        }));
        console.log("profile photo uploaded successfully")
      } catch (error) {
        console.log(`Error while uploading profile picture to cloudinary ${error}`)
      }
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          skills: [...(prev.profile.skills || []), newSkill.trim()],
        },
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        skills: prev.profile.skills?.filter(skill => skill !== skillToRemove) || [],
      },
    }));
  };

  const handleSaveChanges = async () => {
    try {
      if(tutorId)
      await updateTutor(tutorId, formData);
      setTutor(formData);
      setEditMode(false);
      setImagePreview(null);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10 pt-28">
        {/* Profile Settings - With zoom out effect */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6 transform transition-transform duration-500 hover:scale-95 hover:shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Profile Settings</h2>
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors duration-300 hover:scale-105 transform"
              >
                <span className="flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </span>
              </button>
            ) : (
              <div className="space-x-2">
                <button
                  onClick={handleSaveChanges}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors duration-300 hover:shadow-lg"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setFormData(tutor!);
                    setImagePreview(null);
                  }}
                  className="bg-gray-400 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-500 transition-colors duration-300"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="flex items-start space-x-6">
            {/* Profile Picture with enhanced hover effects */}
            <div className="w-36 h-36 rounded-full overflow-hidden flex-shrink-0 group relative cursor-pointer">
              <Image
                src={imagePreview || formData.profile.profilePicture || "/api/placeholder/144/144"}
                alt="Profile"
                width={144}
                height={144}
                className="w-full h-full object-cover rounded-full transition-transform duration-300 group-hover:scale-110"
              />

              {editMode && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <input
                    type="file"
                    id="profile-image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={imageUploading}
                  />
                  <label
                    htmlFor="profile-image"
                    className="bg-white text-blue-600 px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-blue-600 hover:text-white transition-colors duration-300 flex items-center gap-2"
                  >
                    {imageUploading ? "Uploading..." : (
                      <>
                        <Camera className="w-4 h-4" />
                        Change Photo
                      </>
                    )}
                  </label>
                </div>
              )}

              {/* Show upload progress */}
              {imageUploading && uploadProgress > 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-gray-200 h-2">
                  <div
                    className="bg-blue-600 h-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
            </div>

            {/* Profile Details */}
            <div className="flex-grow">
              <div className="grid grid-cols-2 gap-6 mb-4">
                {/* Full Name */}
                <div className="hover:bg-gray-50 p-2 rounded-md transition-colors duration-300">
                  <div className="text-sm text-gray-500 mb-1">Full Name</div>
                  {editMode ? (
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="border px-3 text-gray-600 py-2 w-full rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    />
                  ) : (
                    <div className="text-lg text-black font-medium">{tutor?.username || "N/A"}</div>
                  )}
                </div>

                {/* Email */}
                <div className="hover:bg-gray-50 p-2 rounded-md transition-colors duration-300">
                  <div className="text-sm text-gray-500 mb-1">Email Address</div>
                  {editMode ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="border px-3 text-gray-600 py-2 w-full rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                      readOnly={true}
                    />
                  ) : (
                    <div className="text-lg text-black">{tutor?.email || "N/A"}</div>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="hover:bg-gray-50 p-2 rounded-md transition-colors duration-300">
                <div className="text-sm text-gray-500 mb-1">Bio</div>
                {editMode ? (
                  <textarea
                    name="bio"
                    value={formData.profile.bio || ""}
                    onChange={handleProfileChange}
                    className="border px-3 text-gray-600 py-2 w-full rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-700">{tutor?.profile?.bio || "No bio available."}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Professional Information - With zoom out effect */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6 transform transition-transform duration-500 hover:scale-95 hover:shadow-xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Professional Information</h2>
          <div className="grid grid-cols-2 gap-6">
            {/* Qualification */}
            <div className="p-3 hover:bg-gray-50 rounded-lg transition-colors duration-300">
              <div className="flex items-center space-x-2 text-blue-600 mb-2">
                <GraduationCap className="w-6 h-6" />
                <span className="font-medium text-gray-700">Qualification</span>
              </div>
              {editMode ? (
                <input
                  type="text"
                  name="qualification"
                  value={formData.profile.qualification || ""}
                  onChange={handleProfileChange}
                  className="border px-3 py-2 w-full text-gray-600 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                />
              ) : (
                <p className="text-gray-700">{tutor?.profile?.qualification || "Not provided"}</p>
              )}
            </div>

            {/* Experience */}
            <div className="p-3 hover:bg-gray-50 rounded-lg transition-colors duration-300">
              <div className="flex items-center space-x-2 text-blue-600 mb-2">
                <Briefcase className="w-6 h-6" />
                <span className="font-medium text-gray-700">Experience</span>
              </div>
              {editMode ? (
                <input
                  type="text"
                  name="experience"
                  value={formData.profile.experience || ""}
                  onChange={handleProfileChange}
                  className="border px-3 text-gray-600 py-2 w-full rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                />
              ) : (
                <p className="text-gray-700">{tutor?.profile?.experience || "Not provided"}</p>
              )}
            </div>
          </div>
        </div>

        {/* Skills - in a separate card with zoom out effect */}
        <div className="bg-white shadow-sm rounded-lg p-6 transform transition-transform duration-500 hover:scale-95 hover:shadow-xl">
          <div className="flex items-center space-x-2 text-blue-600 mb-4">
            <Code className="w-6 h-6" />
            <span className="font-medium text-gray-700">Skills</span>
          </div>

          {editMode ? (
            <div>
              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill..."
                  className="border px-3 py-2 text-gray-600 flex-grow rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                />
                <button
                  onClick={handleAddSkill}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors duration-300 hover:scale-105 transform"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.profile.skills?.map((skill, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-100 px-3 py-1 rounded-full flex items-center space-x-1 hover:bg-gray-200 transition-colors duration-300 group"
                  >
                    <span className="text-gray-600">{skill}</span>
                    <button 
                      onClick={() => handleRemoveSkill(skill)} 
                      className="text-gray-600 group-hover:text-red-500 transition-colors duration-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tutor?.profile?.skills?.length ? (
                tutor.profile.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="bg-gray-200 px-3 py-1 text-black rounded-full text-sm hover:bg-blue-100 hover:text-blue-600 transition-colors duration-300 cursor-default hover:scale-105 transform"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No skills listed</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;