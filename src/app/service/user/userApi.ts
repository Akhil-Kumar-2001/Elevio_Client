import axios from "axios";
import { basicType, EditStudentType, userType } from "@/types/types";
import { toast } from 'react-toastify'
import userAxiosInstance from "./userAxiosInstance";

const API_URI = process.env.NEXT_PUBLIC_API_URI;

export const handleAxiosError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        console.log("Axios Error:", error.response?.data?.message);
        toast.error(error.response?.data?.message);
        return
    } else {
        console.error("Unexpected error:", error);
        toast.error("Something went wrong. Please try again.");
    }
};

export const userSignup = async (userData: basicType) => {

    if (!API_URI) {
        throw new Error('API URI is not defined')
    }
    try {
        const response = await axios.post(`${API_URI}/student/signup`, { ...userData });
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const otpPost = async (otp: string, email: string) => {
    try {
        const response = await axios.post(`${API_URI}/student/verify-otp`, { otp, email });
        return response.data;
    }
    catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const resendOtp = async (email: string) => {
    try {
        const response = await axios.post(`${API_URI}/student/resend-otp`, { email })
        return response;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}



export const studentSignin = async (userData: userType) => {
    try {
        const response = await axios.post(`${API_URI}/student/signin`, { ...userData }, { withCredentials: true })
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const studentForgotPassword = async (email: string) => {
    try {
        const response = await axios.post(`${API_URI}/student/forgot-password`, { email }, { withCredentials: true })
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const forgotOtpPost = async (otp: string, email: string) => {
    try {
        const response = await axios.post(`${API_URI}/student/verify-forgot-otp`, { otp, email });
        return response.data;
    }
    catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const resetPassword = async (password: string, email: string) => {
    try {
        const response = await axios.post(`${API_URI}/student/reset-password`, { password, email });
        console.log(response)
        return response.data
    }
    catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const googleSignInApi = async (userData: basicType) => {
    try {
        const response = await axios.post(`${API_URI}/student/callback`, userData, { withCredentials: true });
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error);
    }
}

export const getListedCourses = async () => {
    try {
        const response = await userAxiosInstance.get(`/student/listed-courses`)
        console.log(response.data)
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};

export const getStudent = async (id: string) => {
    try {
        const response = await userAxiosInstance.get(`/student/get-student/${id}`);
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const getSubscription = async (id: string) => {
    try {
        const response = await userAxiosInstance.get(`/student/get-subscription-details/${id}`);
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const updateStudent = async (id: string, formData: EditStudentType) => {
    try {
        const response = await userAxiosInstance.patch(`/student/edit-profile/${id}`, { formData });
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const addToCart = async (userId: string, courseId: string) => {
    try {
        const response = await userAxiosInstance.post(`/student/addtocart/${courseId}`, { userId });
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const cartData = async (studentId: string) => {
    try {
        const response = await userAxiosInstance.get(`/student/cart/${studentId}`);
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const removeItem = async (id: string, studentId: string) => {
    try {
        const response = await userAxiosInstance.delete(`/student/remove-item/${id}?studentId=${studentId}`);
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const createOrder = async (studentId: string, amount: number, courseIds: string[] | string) => {
    try {
        console.log("create order", amount, courseIds)
        const response = await userAxiosInstance.post('/student/payment/create-order', { studentId, amount, courseIds });
        return response.data; // { id, amount, currency }
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};

export const verifyPayment = async (razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string) => {
    try {
        const response = await userAxiosInstance.post('/student/payment/verify-payment', { razorpay_order_id, razorpay_payment_id, razorpay_signature });
        return response.data; // { status: 'success' | 'failure', error? }
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};

export const getCategories = async () => {
    try {
        const response = await userAxiosInstance.get('/student/getcategories');
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const getCourses = async (page: number, limit: number) => {
    try {
        const response = await userAxiosInstance.get(`/student/courses`, {
            params: {
                page,
                limit
            }
        });

        console.log("pagenation data", response.data)
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const getPurchasedCourses = async (userId: string) => {
    try {
        const response = await userAxiosInstance.get(`/student/purchased-courses/${userId}`)
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const getCourseDetails = async (courseId: string) => {
    try {
        const response = await userAxiosInstance.get(`/student/getCourse/${courseId}`)
        console.log(response)
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const getSectionsByCourse = async (courseId: string) => {
    try {
        const response = await userAxiosInstance.get(`/student/sections/${courseId}`)
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const getLecturesBySection = async (courseId: string) => {
    try {
        const response = await userAxiosInstance.get(`/student/lectures/${courseId}`)
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const getSubscriptions = async () => {
    try {
        const response = await userAxiosInstance.get(`/student/subscription`);
        console.log("get response", response.data)
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const createSubscritionOrder = async (studentId: string, amount: number, planId: string) => {
    try {
        console.log("create order", amount, planId)
        const response = await userAxiosInstance.post('/student/subscription/create-order', { studentId, amount, planId });
        console.log("order created", response)
        return response.data; // { id, amount, currency }
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};

export const verifySubscritionPayment = async (razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string) => {
    try {
        console.log("verification test", razorpay_order_id, razorpay_payment_id, razorpay_signature)
        const response = await userAxiosInstance.post('/student/subscription/verify-payment', { razorpay_order_id, razorpay_payment_id, razorpay_signature });
        return response.data; // { status: 'success' | 'failure', error? }
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};