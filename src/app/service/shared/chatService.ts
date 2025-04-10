import axios from "axios";
import tutorAxiosInstance from '@/app/service/user/userAxiosInstance';
import studentAxiosInstance from '@/app/service/tutor/tutorAxiosInstance';
import { toast } from "react-toastify";

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


// chatService.ts
export const sendMessage = async (
    receiverId: string,
    message: string,
    role: string,
    imageUrl?: string
  ) => {
    console.log("Image url",imageUrl)
    try {
      const axiosInstance = role === 'tutor' ? tutorAxiosInstance : studentAxiosInstance;
      const response = await axiosInstance.post(`/chat/send/${receiverId}`, {
        message,
        imageUrl // Add imageUrl to the request payload
      });
      return response.data;
    } catch (error: unknown) {
      handleAxiosError(error);
      throw error; // Re-throw the error so the calling function can handle it
    }
  };

export const getMessages = async(reciverId:string,role:string) =>{
    try {
        const axiosInstance = role === 'tutor' ? tutorAxiosInstance : studentAxiosInstance;
        const response = await axiosInstance.get(`/chat/get-messages/${reciverId}`);
        return response.data
    } catch (error:unknown) {
        handleAxiosError(error)
    }
}

// chatService.ts

export const deleteMessages = async (receiverId:string,messageIds: string[],role:string) => {
    try {        
        console.log("deting ids",messageIds)
    const axiosInstance = role === 'tutor' ? tutorAxiosInstance : studentAxiosInstance;
    const response = await  axiosInstance.delete(`/chat/delete-message/${receiverId}`,{data:{messageIds}})
      return response.data;
    } catch (error) {
      console.error('Error deleting messages:', error);
      throw error;
    }
  };