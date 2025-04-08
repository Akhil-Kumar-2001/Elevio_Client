import axios from 'axios';
import Cookies from 'js-cookie';
import useAuthStore from '@/store/tutorAuthStore';
import { jwtDecode } from 'jwt-decode';

const userAxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Ensures cookies are sent with requests
});

// Type for token response
interface RefreshResponse {
  success: boolean;
  accessToken: string;
  // message: string;
}

interface User {
  id: string;
  role: string;
}

const API_URI = process.env.NEXT_PUBLIC_API_URI || "http://localhost:5000/api";

const isTokenExpired = (token: string): boolean => {
  try {
    const decodedToken: { exp: number } = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp <= currentTime;
  }catch (error) {
    console.error('Error decoding token:', error); 
    return true;
  }
};

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const response = await axios.post<RefreshResponse>(
      `${API_URI}/tutor/refresh-token`,
      {},
      { withCredentials: true } // Important to include the refresh token cookie
    );

    if (response.data.success) {
      const newAccessToken = response.data.accessToken;
      console.log(response.data)
      
      // Update the token in localStorage and Zustand store
      if (typeof window !== 'undefined') {
        localStorage.setItem('tutorAccessToken', newAccessToken);
      }
      
      // Get the current user from the store
      const user = useAuthStore.getState().user;
      
      // Update the store with the new token
      useAuthStore.getState().saveUserDetails({user: user as User , accessToken:newAccessToken});
      
      // Set the new access token in a cookie as well (similar to your login function)
      document.cookie = `accessToken=${newAccessToken}; path=/; max-age=${60 * 60}; SameSite=Lax`;
      
      return newAccessToken;
    }
    return null;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};

// userAxiosInstance.interceptors.request.use(
//   (config) => {
//     const { token } = useAuthStore.getState();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

userAxiosInstance.interceptors.request.use(
  async (config) => {
    let token = useAuthStore.getState().token;
    
    if (token) {
      if (isTokenExpired(token)) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          token = newToken;
        } else {
          useAuthStore.getState().logout();
          if (typeof window !== 'undefined') {
            window.location.href = '/tutor/login';
          }
          return Promise.reject(new Error('Session expired. Please login again.'));
        }
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

userAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // if (error.response?.status === 403) {
    //   console.warn("403 Forbidden detected. Logging out...");
    //   useAuthStore.getState().logout(); 
    //   return Promise.reject(error);
    // }

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
