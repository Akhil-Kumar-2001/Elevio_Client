import axios from "axios";
import { basicType, EditStudentType, userType } from "@/types/types";
import { toast } from 'react-toastify'
import userAxiosInstance from "./userAxiosInstance";
import exp from "constants";

const API_URI = process.env.NEXT_PUBLIC_API_URI;

export const handleAxiosError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        console.log("Axios Error:", error.response?.data?.message);
        toast.error(error.response?.data?.message);
    } else {
        console.error("Unexpected error:", error);
        toast.error("Something went wrong. Please try again.");
    }
  };

export const userSignup =  async(userData:basicType) =>{

    if(!API_URI){
        throw new Error('API URI is not defined')
    }
    try {
        const response  = await axios.post(`${API_URI}/student/signup`,{...userData});
        return response.data
    } catch (error:unknown) {   
        handleAxiosError(error)
    }
}

export const otpPost = async(otp:string,email:string) => {
    try{
        const response = await axios.post(`${API_URI}/student/verify-otp`,{otp,email});
        return response.data;
    }
    catch(error:unknown){
        handleAxiosError(error)
    }
}

export const resendOtp = async(email:string) => {
    try {
        const response = await axios.post(`${API_URI}/student/resend-otp`,{email})
        return response;
    } catch (error:unknown) {
       handleAxiosError(error)
    }
}



export const studentSignin = async(userData:userType) => {
    try{
        const response = await axios.post(`${API_URI}/student/signin`,{...userData},{withCredentials:true})
        return response.data
    } catch(error:unknown) {
        handleAxiosError(error)
    }
}

export const studentForgotPassword = async(email:string) =>{
    try {
        const response = await axios.post(`${API_URI}/student/forgot-password`,{email},{withCredentials:true})
        return response.data
    } catch (error:unknown) {
        handleAxiosError(error)
    }
}

export const forgotOtpPost = async(otp:string,email:string) =>{
    try{
        const response = await axios.post(`${API_URI}/student/verify-forgot-otp`,{otp,email});
        return response.data;
    }
    catch(error:unknown){
        handleAxiosError(error)
    }
}

export const resetPassword = async(password:string,email:string) =>{
    try{
        const response = await axios.post(`${API_URI}/student/reset-password`,{password,email});
        console.log(response)
        return response.data
    }
    catch(error:unknown){
        handleAxiosError(error)
    }
}

export const googleSignInApi = async (userData:basicType) =>{
        try {
            const response = await axios.post(`${API_URI}/student/callback`,userData,{withCredentials:true});
            return response.data;
        } catch (error:unknown) {
            handleAxiosError(error);
        }
}

export const getListedCourses = async () => {
    try {
      const response = await userAxiosInstance.get(`/student/listed-courses`)
      console.log(response.data)
      return response.data;
    } catch (error:unknown) {
        handleAxiosError(error)
    }
  };

  export const getStudent = async (id:string) => {
    try {
        const response = await userAxiosInstance.get(`/student/get-student/${id}`);
        return response.data;
    } catch (error:unknown) {
        handleAxiosError(error) 
    }
  }

  export const updateStudent = async (id:string,formData:EditStudentType)=>{
    try {
        const response = await userAxiosInstance.patch(`/student/edit-profile/${id}`,{formData});
        return response.data
    } catch (error:unknown) {
        handleAxiosError(error)
    }
  }

  export const addToCart = async (userId:string,courseId:string)=>{
    try {
        const response = await userAxiosInstance.post(`/student/addtocart/${courseId}`,{userId});
        return response.data;
    } catch (error:unknown) {
        handleAxiosError(error)
    }
  }

  export const cartData = async (studentId:string) =>{
    try {
        const response = await userAxiosInstance.get(`/student/cart/${studentId}`);
        return response.data
    } catch (error:unknown) {
        handleAxiosError(error)
    }
  }