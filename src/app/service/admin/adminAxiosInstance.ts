import axios from 'axios';
import Cookies from 'js-cookie';
import useAuthStore from '@/store/adminAuthStore';

const adminAxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ,
  withCredentials: true, // Ensures cookies are sent with requests
});
console.log("Axios Base URL:", process.env.NEXT_PUBLIC_API_URI);

adminAxiosInstance.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

adminAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403) {
      console.warn("403 Forbidden detected. Logging out...");
      useAuthStore.getState().logout(); // 🔹 Logout user
      return Promise.reject(error);
    }
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // 🔹 Check if refresh token exists in cookies BEFORE making a request
      const refreshToken = Cookies.get('admin-refreshToken');
      if (!refreshToken) {
        console.log('No refresh token found, logging out user.');
        useAuthStore.getState().logout(); // Logout user if no refresh token
        return Promise.reject(error);
      }

      try {
        const response = await adminAxiosInstance.post('/admin/refresh-token');
        if (response.data.success) {
          const newAccessToken = response.data.accessToken;
          useAuthStore.getState().saveUserDetails({ user: useAuthStore.getState().user!, accessToken: newAccessToken });

          // Retry the failed request with new access token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return adminAxiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error('Refresh token request failed:', refreshError);
        useAuthStore.getState().logout(); // Logout user if refresh token request fails
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default adminAxiosInstance;
