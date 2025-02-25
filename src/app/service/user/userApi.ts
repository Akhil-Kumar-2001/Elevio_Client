import axios from "axios";
import { basicType, userType } from "@/types/types";
import { toast } from 'react-toastify'
import userAxiosInstance from "./userAxiosInstance";

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
            console.log("before api call")
            const response = await axios.post(`${API_URI}/student/callback`,userData,{withCredentials:true});
            console.log(response)
            return response.data;
        } catch (error:unknown) {
            handleAxiosError(error);
        }
}
