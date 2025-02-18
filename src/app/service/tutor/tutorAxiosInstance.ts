import axios from 'axios';
import Cookies from 'js-cookie';
import useAuthStore from '@/store/tutorAuthStore';

const userAxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Ensures cookies are sent with requests
});
// console.log("Axios Base URL:", process.env.NEXT_PUBLIC_API_URI);

userAxiosInstance.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

userAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // 🔹 Check if refresh token exists in cookies BEFORE making a request
      const refreshToken = Cookies.get('refreshToken');
      if (!refreshToken) {
        console.log('No refresh token found, logging out user.');
        useAuthStore.getState().logout(); // Logout user if no refresh token
        return Promise.reject(error);
      }

      try {
        const response = await userAxiosInstance.post('/tutor/refresh-token');
        if (response.data.success) {
          const newAccessToken = response.data.accessToken;
          useAuthStore.getState().saveUserDetails({ user: useAuthStore.getState().user!, accessToken: newAccessToken });

          // Retry the failed request with new access token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return userAxiosInstance(originalRequest);
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

export default userAxiosInstance;
