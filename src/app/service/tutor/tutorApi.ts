import axios from "axios";
import { basicType, Course, CourseData, ISectionData, Tutor, TutorType, TutorVerificationFormData, userType } from "@/types/types";
import { toast } from "react-toastify";
import userAxiosInstance from "./tutorAxiosInstance";

const API_URI = process.env.NEXT_PUBLIC_API_URI;

export const handleAxiosError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        console.log("Axios Error:", error.response?.data?.message);
        toast.error(error.response?.data?.message);
    } else {
        // console.error("Unexpected error:", error);
        toast.error("Something went wrong. Please try again.");
    }
};

export const tutorSignup = async (userData: basicType) => {

    if (!API_URI) {
        throw new Error("Api uri not defined");
    }
    try {
        const response = await axios.post(`${API_URI}/tutor/signup`, { ...userData });
        return response.data
    } catch (error: any) {
        toast.error(error?.response?.data?.message);

        // toast.error(error.response)
    }
}

export const otpPost = async (otp: string, email: string) => {
    try {
        const response = await axios.post(`${API_URI}/tutor/verify-otp`, { otp, email });
        console.log(response)
        return response.data;
    }
    catch (error: any) {
        toast.error(error?.response?.data?.message)
    }
}

export const resendOtp = async (email: string) => {
    try {
        const response = await axios.post(`${API_URI}/tutor/resend-otp`, { email })
        return response;
    } catch (error) {
        console.log(error)
    }
}

export const tutorSignin = async (userData: userType) => {
    try {
        const response = await axios.post(`${API_URI}/tutor/signin`, { ...userData }, { withCredentials: true })
        console.log(response)
        return response.data
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.log("Axios Error:", error.response?.data?.message);
            toast.error(error.response?.data?.message);
        } else {
            console.error("Unexpected error:", error);
            toast.error("Something went wrong. Please try again.");
        }
    }
}

export const tutorForgotPassword = async (email: string) => {
    try {
        const response = await axios.post(`${API_URI}/tutor/forgot-password`, { email }, { withCredentials: true })
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const forgotOtpPost = async (otp: string, email: string) => {
    try {
        const response = await axios.post(`${API_URI}/tutor/verify-forgot-otp`, { otp, email });
        return response.data;
    }
    catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const resetPassword = async (password: string, email: string) => {
    try {
        const response = await axios.post(`${API_URI}/tutor/reset-password`, { password, email });
        console.log(response)
        return response.data
    }
    catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const googleSignInApi = async (userData: basicType) => {
    try {
        console.log("Before API call");
        const response = await axios.post(`${API_URI}/tutor/callback`, userData, { withCredentials: true });
        console.log("API Response:", response);  // Check if response contains tokens
        return response.data;
    } catch (error: unknown) {
        console.error("API Call Failed:", error);  // Log error for debugging
        handleAxiosError(error);
    }
};

export const getTutor = async (id: string) => {
    try {
        const response = await userAxiosInstance.get(`/tutor/get-tutor/${id}`);
        return response.data;
    } catch (error:unknown) {
        handleAxiosError(error)
    }
};

export const verifyTutor = async (formData: TutorVerificationFormData) => {
    try {
        const response = await userAxiosInstance.put(`/tutor/verify-tutor`, { formData }, { withCredentials: true })
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error);
    }
}

export const updateTutor = async (id: string, formData: TutorType) => {
    try {
        const response = await userAxiosInstance.patch(`/tutor/update-profile`, { id, formData })
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error);
    }
}

export const getCategories = async () => {
    try {
        const response = await userAxiosInstance.get(`/tutor/get-categories`)
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const createCourse = async (courseData: CourseData) => {
    try {
        const response = await userAxiosInstance.post(`/tutor/create-course`, courseData);
        console.log(response.data)
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}


export const getCourses = async (tutorId:string,page: number, limit: number) => {
    try {
        console.log("Tutor id in courses",tutorId)
        const response = await userAxiosInstance.get(`/tutor/courses`, {
            params: {
                tutorId, 
                page,
                limit
            }
        });        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const getCourseDetails = async (courseId: string) => {
    try {
        const response = await userAxiosInstance.get(`/tutor/get-category?id=${courseId}`)
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const updateCourse = async (id: string, editedCourse: Course) => {
    try {
        const response = await userAxiosInstance.post(`/tutor/edit-course`, { id, editedCourse })
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const createSection = async (id: string, sectionData: ISectionData) => {
    try {
        console.log("Iam here in the create  section api call ============>>>>>>>>>>>>>>")
        const response = await userAxiosInstance.post(`/tutor/create-section`, { id, sectionData });
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const createLecture = async (courseId: string, sectionId: string, title: string) => {
    try {
        console.log(courseId, sectionId, title)
        const response = await userAxiosInstance.post('/tutor/create-lecture', { courseId, sectionId, title });
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const getSections = async (courseId: string) => {
    try {
        const response = await userAxiosInstance.get(`/tutor/get-sections?id=${courseId}`)
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const getLecturesBySection = async (sectionId: string) => {
    try {

        console.log("lectues from the api called")
        const response = await userAxiosInstance.get(`/tutor/get-lectures?id=${sectionId}`)
        console.log("lectues from the api call", response)
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const updateSection = async (sectionId: string, data: ISectionData) => {
    try {
        console.log("==========>",data)
        const response = await userAxiosInstance.patch(`/tutor/edit-sections/${sectionId}`,data)
        return response.data;
    }catch(error:unknown){
        handleAxiosError(error)
    }
  };

export const deleteSection = async (sectionId: string) => {
    try {
        const response = await userAxiosInstance.delete(`/tutor/delete-sections/${sectionId}`);
        return response.data;
    } catch (error:unknown) {
        handleAxiosError(error)
    }
};

export const updateLecture = async (lectureId: string, data: { title: string }) => {
    try {
        console.log("this is from the lecture update api",lectureId,data)
        const response = await userAxiosInstance.patch(`/tutor/edit-lecture/${lectureId}`,data);
        return response.data;
    } catch (error:unknown) {
        handleAxiosError(error);
    }
};

export const deleteLecture = async (lectureId: string) => {
    try {
        const response = await userAxiosInstance.delete(`/tutor/delete-lecture/${lectureId}`);
        return response.data;
    } catch (error:unknown) {
        handleAxiosError(error)
    }
};

export const uploadLectureVideo = async (formData: FormData): Promise<{ videoUrl: string }> => {
    try {
      const response = await userAxiosInstance.post('/tutor/lectures/upload-video', formData,);
      return response.data; // Expecting { videoUrl: string }
    } catch (error:unknown) {
        handleAxiosError(error)
        return { videoUrl: '' };
    }
  };

  export const applyReview = async(courseId:string)=>{
    try {
        console.log("coure id for review",courseId)
        const response = await userAxiosInstance.patch('/tutor/apply-review',{courseId});
        return response.data
    } catch (error:unknown) {
        handleAxiosError(error)
    }
  }



