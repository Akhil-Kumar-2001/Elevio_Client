// import axios from 'axios';
// import Cookies from 'js-cookie';
// import useAuthStore from '@/store/tutorAuthStore';
// import { jwtDecode } from 'jwt-decode';

// const userAxiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   withCredentials: true, // Ensures cookies are sent with requests
// });

// // Type for token response
// interface RefreshResponse {
//   success: boolean;
//   accessToken: string;
//   // message: string;
// }

// interface User {
//   id: string;
//   role: string;
// }

// const API_URI = process.env.NEXT_PUBLIC_API_URI || "http://localhost:5000/api";

// const isTokenExpired = (token: string): boolean => {
//   try {
//     const decodedToken: { exp: number } = jwtDecode(token);
//     const currentTime = Date.now() / 1000;
//     return decodedToken.exp <= currentTime;
//   }catch (error) {
//     console.error('Error decoding token:', error); 
//     return true;
//   }
// };

// const refreshAccessToken = async (): Promise<string | null> => {
//   try {
//     const response = await axios.post<RefreshResponse>(
//       `${API_URI}/tutor/refresh-token`,
//       {},
//       { withCredentials: true } // Important to include the refresh token cookie
//     );

//     if (response.data.success) {
//       const newAccessToken = response.data.accessToken;
//       console.log(response.data)
      
//       // Update the token in localStorage and Zustand store
//       if (typeof window !== 'undefined') {
//         localStorage.setItem('tutorAccessToken', newAccessToken);
//       }
      
//       // Get the current user from the store
//       const user = useAuthStore.getState().user;
      
//       // Update the store with the new token
//       useAuthStore.getState().saveUserDetails({user: user as User , accessToken:newAccessToken});
      
//       // Set the new access token in a cookie as well (similar to your login function)
//       document.cookie = `accessToken=${newAccessToken}; path=/; max-age=${60 * 60}; SameSite=Lax`;
      
//       return newAccessToken;
//     }
//     return null;
//   } catch (error) {
//     console.error('Error refreshing token:', error);
//     return null;
//   }
// };

// // userAxiosInstance.interceptors.request.use(
// //   (config) => {
// //     const { token } = useAuthStore.getState();
// //     if (token) {
// //       config.headers.Authorization = `Bearer ${token}`;
// //     }
// //     return config;
// //   },
// //   (error) => Promise.reject(error)
// // );

// userAxiosInstance.interceptors.request.use(
//   async (config) => {
//     let token = useAuthStore.getState().token;
    
//     if (token) {
//       if (isTokenExpired(token)) {
//         const newToken = await refreshAccessToken();
//         if (newToken) {
//           token = newToken;
//         } else {
//           useAuthStore.getState().logout();
//           if (typeof window !== 'undefined') {
//             window.location.href = '/tutor/login';
//           }
//           return Promise.reject(new Error('Session expired. Please login again.'));
//         }
//       }
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// userAxiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // if (error.response?.status === 403) {
//     //   console.warn("403 Forbidden detected. Logging out...");
//     //   useAuthStore.getState().logout(); 
//     //   return Promise.reject(error);
//     // }

//     if (error.response) {
//       const statusCode = error.response.status;

//       // 🔹 Check for 403 Forbidden error and log out the user
//       if (statusCode === 403) {
//         console.log('403 Forbidden: Logging out user.');
//         useAuthStore.getState().logout();
//         return Promise.reject(error);
//       } 

//       // 🔹 Check for 401 Unauthorized and attempt token refresh
//       if (statusCode === 401 && !originalRequest._retry) {
//         originalRequest._retry = true;

//         // Check if refresh token exists in cookies BEFORE making a request
//         const refreshToken = Cookies.get('refreshToken');
//         if (!refreshToken) {
//           console.log('No refresh token found, logging out user.');
//           useAuthStore.getState().logout();
//           return Promise.reject(error);
//         }

//         try {
//           const response = await userAxiosInstance.post('/tutor/refresh-token');
//           if (response.data.success) {
//             const newAccessToken = response.data.accessToken;
//             useAuthStore.getState().saveUserDetails({
//               user: useAuthStore.getState().user!,
//               accessToken: newAccessToken,
//             });

//             // Retry the failed request with new access token
//             originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//             return userAxiosInstance(originalRequest);
//           }
//         } catch (refreshError) {
//           console.error('Refresh token request failed:', refreshError);
//           useAuthStore.getState().logout();
//           return Promise.reject(refreshError);
//         }
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default userAxiosInstance;


import axios from 'axios';
import Cookies from 'js-cookie';
import useAuthStore from '@/store/tutorAuthStore';
import { jwtDecode } from 'jwt-decode';

// Add this at the top of your file
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;
const failedQueue: {resolve: (token: string) => void; reject: (error: any) => void}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  
  failedQueue.length = 0;
};

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
  } catch (error) {
    console.error('Error decoding token:', error); 
    return true;
  }
};

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    // If already refreshing, return the existing promise
    if (isRefreshing) {
      return refreshPromise;
    }
    
    isRefreshing = true;
    refreshPromise = axios.post<RefreshResponse>(
      `${API_URI}/tutor/refresh-token`,
      {},
      { withCredentials: true }
    )
    .then(response => {
      if (response.data.success) {
        const newAccessToken = response.data.accessToken;
        
        // Update token in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('tutorAccessToken', newAccessToken);
        }
        
        // Update token in Zustand store
        const user = useAuthStore.getState().user;
        useAuthStore.getState().saveUserDetails({
          user: user as User,
          accessToken: newAccessToken
        });
        
        // Set cookie
        document.cookie = `accessToken=${newAccessToken}; path=/; max-age=${60 * 60}; SameSite=Lax`;
        
        // Process pending requests
        processQueue(null, newAccessToken);
        
        return newAccessToken;
      }
      
      processQueue(new Error('Failed to refresh token'));
      return null;
    })
    .catch(error => {
      processQueue(error);
      throw error;
    })
    .finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });
    
    return refreshPromise;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};

userAxiosInstance.interceptors.request.use(
  async (config) => {
    let token = useAuthStore.getState().token;
    
    if (token) {
      if (isTokenExpired(token)) {
        try {
          // Add request to queue if already refreshing
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ 
                resolve: (newToken) => {
                  config.headers.Authorization = `Bearer ${newToken}`;
                  resolve(config);
                }, 
                reject 
              });
            });
          }
          
          const newToken = await refreshAccessToken();
          if (newToken) {
            token = newToken;
            config.headers.Authorization = `Bearer ${token}`;
          } else {
            useAuthStore.getState().logout();
            if (typeof window !== 'undefined') {
              window.location.href = '/tutor/login';
            }
            return Promise.reject(new Error('Session expired. Please login again.'));
          }
        } catch (error) {
          useAuthStore.getState().logout();
          if (typeof window !== 'undefined') {
            window.location.href = '/tutor/login';
          }
          return Promise.reject(error);
        }
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
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

    if (error.response) {
      const statusCode = error.response.status;

      // Handle 403 Forbidden
      if (statusCode === 403) {
        console.log('403 Forbidden: Logging out user.');
        useAuthStore.getState().logout();
        if (typeof window !== 'undefined') {
          window.location.href = '/tutor/login';
        }
        return Promise.reject(error);
      } 

      // Handle 401 Unauthorized
      if (statusCode === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        // Check if refresh token exists
        const refreshToken = Cookies.get('refreshToken');
        if (!refreshToken) {
          console.log('No refresh token found, logging out user.');
          useAuthStore.getState().logout();
          if (typeof window !== 'undefined') {
            window.location.href = '/tutor/login';
          }
          return Promise.reject(error);
        }

        try {
          // If refreshing is already in progress, wait for it to complete
          if (isRefreshing) {
            const token = await new Promise<string>((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            });
            
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return userAxiosInstance(originalRequest);
          }
          
          // Otherwise, initiate the refresh process
          const newToken = await refreshAccessToken();
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return userAxiosInstance(originalRequest);
          } else {
            useAuthStore.getState().logout();
            if (typeof window !== 'undefined') {
              window.location.href = '/tutor/login';
            }
            return Promise.reject(new Error('Failed to refresh token.'));
          }
        } catch (refreshError) {
          console.error('Refresh token request failed:', refreshError);
          useAuthStore.getState().logout();
          if (typeof window !== 'undefined') {
            window.location.href = '/tutor/login';
          }
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default userAxiosInstance;