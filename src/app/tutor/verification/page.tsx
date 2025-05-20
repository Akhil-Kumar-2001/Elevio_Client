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
import Navbar from "@/components/tutor/header";

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
  skills: string[] | string;
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
  const router = useRouter();

  const document1Url = watch("document1Url");
  const document2Url = watch("document2Url");

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;
  

  const handleSkillsChange = (selectedOptions: MultiValue<SkillOption>) => {
    setSelectedSkills(selectedOptions);
    setValue("skills", selectedOptions.map((option) => option.value), {
      shouldValidate: true,
    });
  };

  const uploadToCloudinary = async (file: File, docType: string) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "tutor_documents");
      formData.append("folder", "tutor_documents");

      const uploadResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/dhhzuean5/upload`,
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

      return uploadResponse.data.secure_url;
    } catch (error) {
      console.error(`Error uploading ${docType}:`, error);
      throw new Error(`Failed to upload ${docType}`);
    }
  };

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
      toast.error("Failed to upload document. Please try again.");
    } finally {
      setUploadProgress(prev => ({ 
        ...prev, 
        [docType]: 0
      }));
    }
  };

  const onSubmit = async (data: TutorFormData) => {
    if (!user) {
      toast.error("User ID is missing. Please log in again.");
      return;
    }
    setIsLoading(true);
    try {
      const formData: TutorVerificationFormData = {
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
        isVerified: "pending"
      };
      console.log(formData);

      const response = await verifyTutor(formData);
      console.log(response);
      if (response.success === true) {
        toast.success(response.message);
        router.push('/tutor/pending-page');
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit verification documents. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12">
      <Navbar />
      <div className="max-w-4xl w-full mx-auto p-8  mt-14 bg-white rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Tutor Verification</h2>
        <p className="text-gray-600 mb-8">Please complete the form below to submit your verification documents.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Bio Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio *</label>
            <textarea 
              {...register("bio")} 
              className="w-full border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-800 resize-none"
              placeholder="Write a short bio about yourself..." 
              rows={5}
            />
            {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio.message?.toString()}</p>}
          </div>

          {/* Qualification & Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Educational Qualification *</label>
              <input 
                {...register("qualification")} 
                className="w-full border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-800"
                placeholder="Enter your qualifications"
              />
              {errors.qualification && <p className="text-red-500 text-sm mt-1">{errors.qualification.message?.toString()}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience *</label>
              <input 
                {...register("experience")} 
                className="w-full border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-800"
                placeholder="Enter your experience"
              />
              {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience.message?.toString()}</p>}
            </div>
          </div>

          {/* Skills Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Skills & Expertise *</label>
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
                  borderColor: "#d1d5db",
                  padding: "8px",
                  borderRadius: "8px",
                  boxShadow: "none",
                  "&:hover": { borderColor: "#3b82f6" },
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: "#1f2937",
                }),
                multiValue: (provided) => ({
                  ...provided,
                  backgroundColor: "#e5e7eb",
                  borderRadius: "4px",
                }),
                multiValueLabel: (provided) => ({
                  ...provided,
                  color: "#1f2937",
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isSelected ? "#3b82f6" : "white",
                  color: state.isSelected ? "white" : "#1f2937",
                  "&:hover": {
                    backgroundColor: "#f3f4f6",
                    color: "#1f2937",
                  },
                }),
              }}
            />
            {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills.message?.toString()}</p>}
          </div>
          {/* Document Uploads */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Documents *</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-3 border border-gray-300 p-4 rounded-lg text-gray-800 cursor-pointer hover:bg-gray-50 transition">
                  <FaFileAlt className="text-blue-500" /> 
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
                    <div className="bg-blue-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress.document1}%` }}></div>
                  </div>
                )}
                {errors.document1Url && <p className="text-red-500 text-sm mt-1">{errors.document1Url.message?.toString()}</p>}
              </div>
              
              <div>
                <label className="flex items-center gap-3 border border-gray-300 p-4 rounded-lg text-gray-800 cursor-pointer hover:bg-gray-50 transition">
                  <FaFileAlt className="text-blue-500" /> 
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
                    <div className="bg-blue-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress.document2}%` }}></div>
                  </div>
                )}
                {errors.document2Url && <p className="text-red-500 text-sm mt-1">{errors.document2Url.message?.toString()}</p>}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
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