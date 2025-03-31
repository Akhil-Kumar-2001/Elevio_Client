import axios from 'axios';
import Cookies from 'js-cookie';
import useAuthStore from '@/store/tutorAuthStore';

const userAxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Ensures cookies are sent with requests
});

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

    if (error.response?.status === 403) {
      console.warn("403 Forbidden detected. Logging out...");
      useAuthStore.getState().logout(); 
      return Promise.reject(error);
    }

    if (error.response) {
      const statusCode = error.response.status;

      // 🔹 Check for 403 Forbidden error and log out the user
      if (statusCode === 403) {
        console.log('403 Forbidden: Logging out user.');
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }

      // 🔹 Check for 401 Unauthorized and attempt token refresh
      if (statusCode === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        // Check if refresh token exists in cookies BEFORE making a request
        const refreshToken = Cookies.get('refreshToken');
        if (!refreshToken) {
          console.log('No refresh token found, logging out user.');
          useAuthStore.getState().logout();
          return Promise.reject(error);
        }

        try {
          const response = await userAxiosInstance.post('/tutor/refresh-token');
          if (response.data.success) {
            const newAccessToken = response.data.accessToken;
            useAuthStore.getState().saveUserDetails({
              user: useAuthStore.getState().user!,
              accessToken: newAccessToken,
            });

            // Retry the failed request with new access token
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return userAxiosInstance(originalRequest);
          }
        } catch (refreshError) {
          console.error('Refresh token request failed:', refreshError);
          useAuthStore.getState().logout();
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default userAxiosInstance;
