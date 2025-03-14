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

export const getTutors = async() =>{
    try {
        const tutors = await adminAxiosInstance.get(`${API_URI}/admin/gettutors`,{withCredentials:true})
        console.log(tutors)
        return tutors.data
    } catch (error:unknown) {
        handleAxiosError(error)
    }
}

export const updateTutorStatus = async (id: string) => {
    try {
        const response = await adminAxiosInstance.patch(`${API_URI}/admin/updatetutorstatus`, { id, status }, { withCredentials: true });
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error);
    }
};

export const updateStudentStatus = async (id: string) => {
    try {
        const response = await adminAxiosInstance.patch(`${API_URI}/admin/updatestudentstatus`, { id, status }, { withCredentials: true });
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error);
    }
};

export const getPendingTutors = async () =>{
    try {
        const response = await adminAxiosInstance.get(`${API_URI}/admin/pending-tutor`)
        console.log("Pending Tutors ===>>>>>",response)
        return response.data
    } catch (error:unknown) {
        handleAxiosError(error)
    }
}

export const getTutor = async (id: string) => {
    try {
        const response = await adminAxiosInstance.get(`/admin/get-tutor/${id}`);
        return response.data;
    } catch (error:unknown) {
        handleAxiosError(error)
    }
};

export const rejectTutorVerification = async(id:string) =>{
    try {
        const response = await adminAxiosInstance.patch(`/admin/reject-tutor`,{id})
        return response.data
    } catch (error:unknown) {
        handleAxiosError(error)
    }
}
export const approveTutorVerification = async(id:string) =>{
    try {
        const response = await adminAxiosInstance.patch(`/admin/approve-tutor`,{id})
        return response.data
    } catch (error:unknown) {
        handleAxiosError(error)
    }
}

export const createCategory = async(name:string) =>{
    try {
        const response = await adminAxiosInstance.post(`/admin/create-category`,{name});
        return response.data
    } catch (error:unknown) {
        handleAxiosError(error)
    }
}

export const getCategories = async() =>{
    try {
        const response = await adminAxiosInstance.get(`/admin/categories`);
        console.log(response.data)
        return response.data;
    } catch (error:unknown) {
        handleAxiosError(error)
    }
}


export const updateCategoryStatus = async (id: string) => {
    try {
        const response = await adminAxiosInstance.patch(`${API_URI}/admin/updatecategorystatus`, { id });
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error);
    }
};


