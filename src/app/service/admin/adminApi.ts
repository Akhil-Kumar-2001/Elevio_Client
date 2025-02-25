import axios from "axios";
import { basicType, userType } from "@/types/types";
import { toast } from 'react-toastify'
import adminAxiosInstance from "./adminAxiosInstance";

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


export const adminSignin = async(userData:userType) => {
    try{
        const response = await axios.post(`${API_URI}/admin/signin`,{...userData},{withCredentials:true})
        return response.data
    } catch(error:unknown) {
        handleAxiosError(error)
    }
}

export const getStudents = async() =>{
    try {
        const students = await adminAxiosInstance.get(`${API_URI}/admin/getstudents`,{withCredentials:true})
        console.log(students)
        return students.data
    } catch (error:unknown) {
        handleAxiosError(error)
    }
}


