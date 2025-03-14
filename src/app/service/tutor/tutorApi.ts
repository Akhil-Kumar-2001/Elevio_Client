import axios from "axios";
import { basicType, Tutor, TutorType, TutorVerificationFormData, userType } from "@/types/types";
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

export const tutorSignup = async(userData:basicType) => {
    
    if(!API_URI){
        throw new Error("Api uri not defined");
    }
    try {
        const response = await axios.post(`${API_URI}/tutor/signup`,{...userData});
        return response.data
    }   catch (error:any) {   
            toast.error(error?.response?.data?.message);
          
        // toast.error(error.response)
    }
}

export const otpPost = async(otp:string,email:string) => {
    try{
        const response = await axios.post(`${API_URI}/tutor/verify-otp`,{otp,email});
        console.log(response)
        return response.data;
    }
    catch(error:any){
        toast.error(error?.response?.data?.message)
    }
}

export const resendOtp = async(email:string) => {
    try {
        const response = await axios.post(`${API_URI}/tutor/resend-otp`,{email})
        return response;
    } catch (error) {
       console.log(error) 
    }
}

export const tutorSignin = async(userData:userType) => {
    try{
        const response = await axios.post(`${API_URI}/tutor/signin`,{...userData},{withCredentials:true})
        console.log(response)
        return response.data
    } catch(error:unknown) {
        if (axios.isAxiosError(error)) {
            console.log("Axios Error:", error.response?.data?.message);
            toast.error(error.response?.data?.message);
        } else {
            console.error("Unexpected error:", error);
            toast.error("Something went wrong. Please try again.");
        }
    }
}

export const tutorForgotPassword = async(email:string) =>{
    try {
        const response = await axios.post(`${API_URI}/tutor/forgot-password`,{email},{withCredentials:true})
        return response.data
    } catch (error:unknown) {
        handleAxiosError(error)
    }
}

export const forgotOtpPost = async(otp:string,email:string) =>{
    try{
        const response = await axios.post(`${API_URI}/tutor/verify-forgot-otp`,{otp,email});
        return response.data;
    }
    catch(error:unknown){
        handleAxiosError(error)
    }
}

export const resetPassword = async(password:string,email:string) =>{
    try{
        const response = await axios.post(`${API_URI}/tutor/reset-password`,{password,email});
        console.log(response)
        return response.data
    }
    catch(error:unknown){
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
        const response = await userAxiosInstance.get(`/tutor/get-tutor/${id}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching tutor:", error);
        return null;
    }
};

export const verifyTutor = async (formData:TutorVerificationFormData) => {
    try {
        const response = await userAxiosInstance.put(`/tutor/verify-tutor`,{formData},{withCredentials:true})
        return response.data
    } catch (error:unknown) {
        handleAxiosError(error);
    }
}

export const updateTutor = async(id:string,formData:TutorType) =>{
    try {
        console.log("Tutor is from tutor api",id)
        console.log("form data from tutor api",formData)
        const response = await userAxiosInstance.patch(`/tutor/update-profile`,{id,formData})
         return response.data;
    } catch (error:unknown) {
        handleAxiosError(error); 
    }
}


