import axios from "axios";
import { basicType, userType } from "@/types/types";
import { toast } from "react-toastify";

const API_URI = process.env.NEXT_PUBLIC_API_URI;

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