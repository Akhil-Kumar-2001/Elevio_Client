import axios from "axios";
import { basicType } from "@/types/types";
import { toast } from 'react-toastify'

const API_URI = process.env.NEXT_PUBLIC_API_URI;

export const userSignup =  async(userData:basicType) =>{

    if(!API_URI){
        throw new Error('API URI is not defined')
    }
    try {
        const response  = await axios.post(`${API_URI}/signup`,{...userData});
        return response.data
    } catch (error) {
        // toast.error(error.response)
    }
}