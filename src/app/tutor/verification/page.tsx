"use client";

import React, { useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import { MultiValue } from "react-select";
import { FaFileAlt } from "react-icons/fa";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuthStore from "@/store/tutorAuthStore";
import axios from "axios";
import { TutorVerificationFormData } from "@/types/types";
import { verifyTutor } from "@/app/service/tutor/tutorApi";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Navbar from "@/components/tutor/navbar";

const schema = z.object({
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  qualification: z.string().min(2, "Qualification is required"),
  experience: z.string().min(2, "Experience is required"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  document1Url: z.string().url("ID verification document is required"),
  document2Url: z.string().url("Experience certificate is required"),
});

interface SkillOption {
  value: string;
  label: string;
}

interface TutorFormData {
  bio: string;
  qualification: string;
  experience: string;
  skills: string[] | string; // Adjust based on whether skills is an array or string
  document1Url: string;
  document2Url: string;
}

const skillsOptions: SkillOption[] = [
  { value: "JavaScript", label: "JavaScript" },
  { value: "React", label: "React" },
  { value: "Node.js", label: "Node.js" },
  { value: "Python", label: "Python" },
  { value: "Data Structures", label: "Data Structures" },
];

const VerificationForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm({ resolver: zodResolver(schema) });

  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<MultiValue<SkillOption>>([]);
  const [uploadProgress, setUploadProgress] = useState({
    document1: 0,
    document2: 0,
  });

  const { user } = useAuthStore();
  const router = useRouter()

  // Watch the document URLs to update UI when they change
  const document1Url = watch("document1Url");
  const document2Url = watch("document2Url");

  useEffect(() => {
    setIsClient(true);
    // No data fetching here - component will only use input data
  }, []);

  if (!isClient) return null;

  const handleSkillsChange = (selectedOptions: MultiValue<SkillOption>) => {
    setSelectedSkills(selectedOptions);
    setValue("skills", selectedOptions.map((option) => option.value), {
      shouldValidate: true,
    });
  };

  // Handle file upload to Cloudinary
  const uploadToCloudinary = async (file: File, docType: string) => {
    try {
      // Create a FormData instance
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "tutor_documents"); // Set your Cloudinary upload preset
      formData.append("folder", "tutor_documents");

      // Upload to Cloudinary
      const uploadResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/dhhzuean5/upload`,
  // Replace with your Cloudinary cloud name
        formData,
        {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              if (docType === "document1") {
                setUploadProgress(prev => ({ ...prev, document1: progress }));
              } else {
                setUploadProgress(prev => ({ ...prev, document2: progress }));
              }
            }
          }
        }
      );

      // Return the secure URL of the uploaded file
      return uploadResponse.data.secure_url;
    } catch (error) {
      console.error(`Error uploading ${docType}:`, error);
      throw new Error(`Failed to upload ${docType}`);
    }
  };

  // Handle document upload
  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      const file = files[0];
      const url = await uploadToCloudinary(file, docType);
      
      if (docType === "document1") {
        setValue("document1Url", url, { shouldValidate: true });
      } else {
        setValue("document2Url", url, { shouldValidate: true });
      }
    } catch (error) {
      console.error("Document upload error:", error);
      alert("Failed to upload document. Please try again.");
    } finally {
      setUploadProgress(prev => ({ 
        ...prev, 
        [docType]: 0
      }));
    }
  };

  // Handle form submission
  const onSubmit = async (data: TutorFormData) => {
    if (!user) {
      toast.error("User ID is missing. Please log in again.");
      return;
    }
    setIsLoading(true);
    try {
      const formData:TutorVerificationFormData = {
        _id: user.id,
        profile: {
          bio: data.bio,
          qualification: data.qualification,
          experience: data.experience,
          skills: Array.isArray(data.skills) ? data.skills : [data.skills],
          documents: [
            {
              type: "id_verification",
              fileUrl: data.document1Url
            },
            {
              type: "experience_certificate",
              fileUrl: data.document2Url
            }
          ]
        },
        isVerified: "pending" // Change status to pending verification
      };
      console.log(formData)

      // Send data to backend
      const response = await verifyTutor(formData)
      console.log(response)
      if (response.success == true) {
        toast.success(response.message)
        router.push('/tutor/pending-page')
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit verification documents. Please try again.")
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white ">
      <Navbar />
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-black mb-2">Complete Verification</h2>
        <p className="text-gray-600 text-sm mb-4">Submit required documents for basic verification.</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Bio Input */}
          <div className="mb-4">
            <label className="block font-medium text-gray-500">Bio *</label>
            <textarea 
              {...register("bio")} 
              className="w-full border p-2 rounded text-black" 
              placeholder="Write a short bio about yourself..." 
            />
            {errors.bio && <p className="text-red-500 text-sm">{errors.bio.message?.toString()}</p>}
          </div>

          {/* Qualification & Experience */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-medium text-gray-500">Educational Qualification *</label>
              <input {...register("qualification")} className="w-full border p-2 rounded text-black" />
              {errors.qualification && <p className="text-red-500 text-sm">{errors.qualification.message?.toString()}</p>}
            </div>
            <div>
              <label className="block font-medium text-gray-500">Experience *</label>
              <input {...register("experience")} className="w-full border p-2 rounded text-black" />
              {errors.experience && <p className="text-red-500 text-sm">{errors.experience.message?.toString()}</p>}
            </div>
          </div>

          {/* Skills Dropdown */}
          <div className="mb-4">
            <label className="block font-medium text-gray-500">Skills & Expertise *</label>
            <CreatableSelect 
              isMulti 
              options={skillsOptions}
              value={selectedSkills}
              onChange={handleSkillsChange} 
              className="w-full"
              placeholder="Select or type to create a skill"
              styles={{
                control: (provided) => ({
                  ...provided,
                  backgroundColor: "white",
                  color: "black", // Input text color
                  borderColor: "black",
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: "black", // Selected skill text color
                }),
                multiValue: (provided) => ({
                  ...provided,
                  backgroundColor: "#e0e0e0", // Selected skills background
                }),
                multiValueLabel: (provided) => ({
                  ...provided,
                  color: "black", // Selected skills text color
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isSelected ? "#4a90e2" : "white",
                  color: state.isSelected ? "white" : "black",
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                    color: "black",
                  },
                }),
              }}
            />
            {errors.skills && <p className="text-red-500 text-sm">{errors.skills.message?.toString()}</p>}
          </div>

          {/* Document Uploads */}
          <div className="mb-4">
            <label className="block font-medium text-gray-500">Documents *</label>
            <div className="flex gap-4">
              <div className="w-full">
                <label className="flex items-center gap-2 border p-2 rounded w-full text-black cursor-pointer hover:bg-gray-50">
                  <FaFileAlt /> 
                  <span>{document1Url ? "ID Document Uploaded" : "Upload ID Verification"}</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={(e) => handleDocumentUpload(e, "document1")} 
                    accept="image/*,.pdf"
                  />
                </label>
                {uploadProgress.document1 > 0 && uploadProgress.document1 < 100 && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress.document1}%` }}></div>
                  </div>
                )}
                {errors.document1Url && <p className="text-red-500 text-sm">{errors.document1Url.message?.toString()}</p>}
              </div>
              
              <div className="w-full">
                <label className="flex items-center gap-2 border p-2 rounded w-full text-black cursor-pointer hover:bg-gray-50">
                  <FaFileAlt /> 
                  <span>{document2Url ? "Experience Cert Uploaded" : "Upload Experience Certificate"}</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={(e) => handleDocumentUpload(e, "document2")} 
                    accept="image/*,.pdf"
                  />
                </label>
                {uploadProgress.document2 > 0 && uploadProgress.document2 < 100 && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress.document2}%` }}></div>
                  </div>
                )}
                {errors.document2Url && <p className="text-red-500 text-sm">{errors.document2Url.message?.toString()}</p>}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit for Verification"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerificationForm;