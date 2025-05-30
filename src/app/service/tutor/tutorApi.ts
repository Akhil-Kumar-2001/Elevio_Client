import axios from "axios";
import { basicType, Course, CourseData, ISectionData, TutorType, TutorVerificationFormData, userType } from "@/types/types";
import { toast } from "react-toastify";
import userAxiosInstance from "./tutorAxiosInstance";

const API_URI = process.env.NEXT_PUBLIC_API_URI;

export const handleAxiosError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        console.log("Axios Error:", error.response?.data?.message);
        toast.error(error.response?.data?.message);
    } else {
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
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const otpPost = async (otp: string, email: string) => {
    try {
        const response = await axios.post(`${API_URI}/tutor/verify-otp`, { otp, email });
        console.log(response)
        return response.data;
    }
    catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const resendOtp = async (email: string) => {
    try {
        const response = await axios.post(`${API_URI}/tutor/resend-otp`, { email })
        return response;
    } catch (error: unknown) {
        handleAxiosError(error)
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
    } catch (error: unknown) {
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


export const getCourses = async (tutorId: string, page: number, limit: number) => {
    try {
        console.log("Tutor id in courses", tutorId)
        const response = await userAxiosInstance.get(`/tutor/courses`, {
            params: {
                tutorId,
                page,
                limit
            }
        }); return response.data
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
        const response = await userAxiosInstance.patch(`/tutor/edit-sections/${sectionId}`, data)
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};

export const deleteSection = async (sectionId: string) => {
    try {
        const response = await userAxiosInstance.delete(`/tutor/delete-sections/${sectionId}`);
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};

export const updateLecture = async (lectureId: string, data: { title: string }) => {
    try {
        const response = await userAxiosInstance.patch(`/tutor/edit-lecture/${lectureId}`, data);
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error);
    }
};

export const deleteLecture = async (lectureId: string) => {
    try {
        const response = await userAxiosInstance.delete(`/tutor/delete-lecture/${lectureId}`);
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};

export const uploadLectureVideo = async (formData: FormData): Promise<{ videoUrl: string }> => {
    try {
        const response = await userAxiosInstance.post('/tutor/lectures/upload-video', formData,);
        return response.data; // Expecting { videoUrl: string }
    } catch (error: unknown) {
        handleAxiosError(error)
        return { videoUrl: '' };
    }
};

export const applyReview = async (courseId: string) => {
    try {
        const response = await userAxiosInstance.patch('/tutor/apply-review', { courseId });
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const getNotifications = async () => {
    try {
        const response = await userAxiosInstance.get(`/tutor/notifications`);
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error);
    }
}

export const readNotification = async (id: string) => {
    try {
        const response = await userAxiosInstance.patch(`/tutor/notifications/${id}`);
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error);
    }
}

export const getMonthlyIncome = async () => {
    try {
        const response = await userAxiosInstance.get(`/tutor/monthly-income`)
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const getStudentSCount = async () => {
    try {
        const response = await userAxiosInstance.get(`/tutor/students-count`);
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const getTutorTransactions = async (page: number, limit: number) => {
    try {
        const response = await userAxiosInstance.get(`/tutor/transactions?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const getDashboradDetails = async () => {
    try {
        const response = await userAxiosInstance.get(`/tutor/dahboard-data`);
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const getYearlyIncome = async () => {
    try {
        const response = await userAxiosInstance.get(`/tutor/yearly-income`)
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}


export const getSessions = async () => {
    try {
        const response = await userAxiosInstance.get(`/tutor/sessions`);
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const getSessionDetails = async (sessionId: string) => {
    try {
        const response = await userAxiosInstance.get(`/tutor/session-details/${sessionId}`);
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}


export const updateSessionStatus = async (sessionId:string,status:string) =>{
    try {
        const response = await userAxiosInstance.put(`/tutor/session-status/${sessionId}`,{status});
        return response.data;
    } catch (error:unknown) {
        handleAxiosError(error)
    }
}


export const getCourseDetailsForPreview = async (courseId: string) => {
    try {
        const response = await userAxiosInstance.get(`/tutor/getcourse/${courseId}`)
        console.log("preview course details with populate details",response)
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const getSectionsByCourseForPreview = async (courseId: string) => {
    try {
        const response = await userAxiosInstance.get(`/tutor/getsections/${courseId}`)
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const getLecturesBySectionForPreview = async (sectionId: string) => {
    try {
        const response = await userAxiosInstance.get(`/tutor/getlectures/${sectionId}`)
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const getReviewsByCourse = async (courseId: string) => {
    try {
        const response = await userAxiosInstance.get(`/tutor/reviews/${courseId}`);
        console.log("course reviws", response.data)
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}


export  const replyReview =  async(reviewId: string, reply: string) => {
    try {
        const response = await userAxiosInstance.post(`/tutor/reply-review/${reviewId}`, { reply });
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const deleteReply = async(reviewId:string) => {
    try {
        const response = await userAxiosInstance.delete(`/tutor/delete-reply/${reviewId}`);
        return response.data;
    } catch (error:unknown) {
        handleAxiosError(error);
    }
}

export const getIncomeByDateRange = async (startDate: string, endDate: string) => {
    try {
        const response = await userAxiosInstance.get(`/tutor/income-by-date-range?startDate=${startDate}&endDate=${endDate}`);
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const getStudents = async (page: number, limit: number) => {
    try {
        const response = await userAxiosInstance.get(`/tutor/students?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}