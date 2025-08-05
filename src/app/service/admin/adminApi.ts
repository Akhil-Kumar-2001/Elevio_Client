import axios from "axios";
import { SubscriptionType, userType } from "@/types/types";
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


export const adminSignin = async (userData: userType) => {
    try {
        const response = await axios.post(`${API_URI}/admin/signin`, { ...userData }, { withCredentials: true })
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const getStudents = async (page: number, limit: number) => {
    try {
        const students = await adminAxiosInstance.get(`admin/getstudents?page=${page}&limit=${limit}`)
        return students.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const getTutors = async (page: number, limit: number) => {
    try {
        const tutors = await adminAxiosInstance.get(`/admin/gettutors?page=${page}&limit=${limit}`)
        return tutors.data
    } catch (error: unknown) {
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

export const searchTutors = async (query: string, page: number, limit: number) => {
    try {
        const response = await adminAxiosInstance.get(`${API_URI}/admin/searchtutors`, {
            params: { query, page, limit },
            withCredentials: true
        });
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error);
    }
};

export const updateStudentStatus = async (id: string) => {
    try {
        const response = await adminAxiosInstance.patch(`/admin/updatestudentstatus`, { id, status });
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error);
    }
};


export const searchStudents = async (query: string, page: number, limit: number) => {
    try {
        const response = await adminAxiosInstance.get(`${API_URI}/admin/searchstudents`, {
            params: { query, page, limit },
            withCredentials: true
        });
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error);
    }
};

export const getPendingTutors = async (page: number, limit: number) => {
    try {
        const response = await adminAxiosInstance.get(`/admin/pending-tutor?page=${page}&limit=${limit}`)
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const getTutor = async (id: string) => {
    try {

        const response = await adminAxiosInstance.get(`/admin/get-tutor/${id}`);
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};

export const rejectTutorVerification = async (id: string) => {
    try {
        const response = await adminAxiosInstance.patch(`/admin/reject-tutor`, { id })
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}
export const approveTutorVerification = async (id: string) => {
    try {
        const response = await adminAxiosInstance.patch(`/admin/approve-tutor`, { id })
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const createCategory = async (name: string) => {
    try {
        const response = await adminAxiosInstance.post(`/admin/create-category`, { name });
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const getCategories = async (page: number, limit: number) => {
    try {

        const response = await adminAxiosInstance.get(`/admin/categories?page=${page}&limit=${limit}`);
        return await response.data

    } catch (error) {
        console.error("Error fetching categories", error);
        return null;
    }
};



export const updateCategoryStatus = async (id: string) => {
    try {
        const response = await adminAxiosInstance.patch(`/admin/updatecategorystatus`, { id });
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error);
    }
};

export const deleteCategory = async (id: string) => {
    try {
        const response = await adminAxiosInstance.delete(`/admin/delete-category`, { data: { id } });
        return await response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
};

export const getPendingCourses = async (page: number, limit: number) => {
    try {
        const response = await adminAxiosInstance.get(`/admin/pending-course?page=${page}&limit=${limit}`);
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const getCategory = async () => {
    try {
        const response = await adminAxiosInstance.get(`/admin/get-categories`)
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const getCourseDetails = async (id: string) => {
    try {
        const response = await adminAxiosInstance.get(`/admin/course-details/${id}`)
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const getCagoryName = async (id: string) => {
    try {
        const response = await adminAxiosInstance(`/admin/get-categoryname/${id}`);
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const getSectionsByCourse = async (id: string) => {
    try {
        const response = await adminAxiosInstance.get(`/admin/sections/${id}`)
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const getLecturesBySection = async (id: string) => {
    try {
        const response = await adminAxiosInstance.get(`/admin/lectures/${id}`)
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const rejectCourseVerification = async (courseId: string, tutorId: string, reason: string) => {
    try {
        const response = await adminAxiosInstance.patch(`/admin/reject-course/${courseId}`, { tutorId, reason });
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}
export const approveCourseVerification = async (courseId: string) => {
    try {
        const response = await adminAxiosInstance.patch(`/admin/approve-course/${courseId}`);
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

// Get all subscriptions
export const getSubscriptions = async (page: number, limit: number) => {
    try {
        const response = await adminAxiosInstance.get(`/admin/subscriptions?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error: unknown) {
        return handleAxiosError(error);
    }
};

// Create a new subscription
export const createSubscription = async (subscriptionData: SubscriptionType) => {
    try {
        const response = await adminAxiosInstance.post(`/admin/subscriptions`, subscriptionData);
        toast.success("Subscription plan created successfully");
        return response.data;
    } catch (error: unknown) {
        return handleAxiosError(error);
    }
};

// Update an existing subscription
export const updateSubscription = async (id: string, subscriptionData: Partial<SubscriptionType>) => {
    try {
        const response = await adminAxiosInstance.patch(`/admin/subscriptions`, subscriptionData);
        toast.success("Subscription plan updated successfully");
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error);
    }
};

// Delete a subscription
export const deleteSubscription = async (id: string) => {
    try {
        const response = await adminAxiosInstance.delete(`/admin/subscriptions/${id}`);
        toast.success("Subscription plan deleted successfully");
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error);
    }
};

export const getTutorsWallets = async (page: number, limit: number) => {
    try {
        const response = await adminAxiosInstance.get(`/admin/tutor-wallets?page=${page}&limit=${limit}`)
        return response.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const getTutorsList = async () => {
    try {
        const tutors = await adminAxiosInstance.get(`/admin/gettutor-list`)
        return tutors.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const getDashboardDatad = async () => {
    try {
        const dashboardDatas = await adminAxiosInstance.get(`/admin/get-dashboard-data`);
        return dashboardDatas.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const getAdminWallet = async (page: number, limit: number) => {
    try {
        const response = await adminAxiosInstance.get(`/admin/wallet?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}
export const getStudentsData = async () => {
    try {
        const students = await adminAxiosInstance.get(`admin/getstudentsdata`)
        return students.data
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const categoryIncome = async () => {
    try {
        const incomes = await adminAxiosInstance.get(`/admin/category-income`);
        return incomes.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const AdminMontlyIncome = async () => {
    try {
        const incomes = await adminAxiosInstance.get(`/admin/admin-monlty-income`);
        return incomes.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const AdminYearlyIncome = async () => {
    try {
        const incomes = await adminAxiosInstance.get(`/admin/admin-yearly-income`);
        return incomes.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}

export const AdminIncomeByDateRange = async (startDate: string, endDate: string) => {
    try {
        const incomes = await adminAxiosInstance.get(`/admin/admin-income-by-date-range?startDate=${startDate}&endDate=${endDate}`);
        return incomes.data;
    } catch (error: unknown) {
        handleAxiosError(error)
    }
}