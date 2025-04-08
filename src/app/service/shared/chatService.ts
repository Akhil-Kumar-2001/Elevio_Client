import axios from "axios";
import tutorAxiosInstance from '@/app/service/user/userAxiosInstance';
import studentAxiosInstance from '@/app/service/tutor/tutorAxiosInstance';
import { toast } from "react-toastify";
import exp from "constants";

export const handleAxiosError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        console.log("Axios Error:", error.response?.data?.message);
        toast.error(error.response?.data?.message);
    } else {
        toast.error("Something went wrong. Please try again.");
    }
};

export const getChats = async (role: string) => {
    try {
        const axiosInstance = role === 'tutor' ? tutorAxiosInstance : studentAxiosInstance;
        const response = await axiosInstance.get(`/chat/getChats?role=${role}`);
        console.log("ress",response.data)
        return response.data;
    } catch (error:unknown) {
        handleAxiosError(error)
    }
}

export const createChat = async (id:string) =>{
    try {
        const response = await studentAxiosInstance.post(`/chat/create-chat/${id}`);
        return response.data
    } catch (error:unknown) {
        handleAxiosError(error)
    }
}

export const sendMessage = async(reciverId:string,message:string,role:string) =>{
    try {
        const axiosInstance = role === 'tutor' ? tutorAxiosInstance : studentAxiosInstance;
        const response = await axiosInstance.post(`/chat/send/${reciverId}`,{message});
        return response.data
    } catch (error:unknown) {
        handleAxiosError(error)
    }
}

export const getMessages = async(reciverId:string,role:string) =>{
    try {
        const axiosInstance = role === 'tutor' ? tutorAxiosInstance : studentAxiosInstance;
        const response = await axiosInstance.get(`/chat/get-messages/${reciverId}`);
        return response.data
    } catch (error:unknown) {
        handleAxiosError(error)
    }
}