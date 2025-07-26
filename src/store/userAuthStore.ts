import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import userAxiosInstance from '@/app/service/user/userAxiosInstance';
import { getSession, signIn, signOut } from 'next-auth/react';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_URI = process.env.NEXT_PUBLIC_API_URI;

export interface User {
  id: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface RefreshTokenResponse {
  success: boolean;
  accessToken: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  saveUserDetails: (response: AuthResponse) => void;
  refreshAccessToken: () => Promise<boolean>;
  logout: () => void;
  googleSignIn: () => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      saveUserDetails: (authResponse: AuthResponse) => {
        const { user, accessToken } = authResponse;
        set({ user, token: accessToken, isAuthenticated: true });
      },

      refreshAccessToken: async () => {
        try {
          // Check if refresh token exists before calling API
          const cookies = document.cookie;
          if (!cookies.includes("refreshToken")) {
            console.warn("No refresh token found. Skipping token refresh.");
            return false;
          }
      
          // Call refresh token API only if refreshToken exists
          const response = await userAxiosInstance.post<RefreshTokenResponse>('/student/refresh-token');
      
          if (response.data.success) {
            set({ token: response.data.accessToken, isAuthenticated: true });
            return true;
          }
      
          return false;
        } catch (error) {
          console.error('Token refresh failed:', error);
          return false;
        }
      },

     

   logout: async () => { 
    try {
      await signOut({ redirect: false });
      await userAxiosInstance.post('/student/logout'); 
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
    }
    // Step 3: Clear local state
    set({ user: null, token: null, isAuthenticated: false });
    },

      googleSignIn: async () =>{
        try {
          const result = await signIn("google", { callbackUrl: '/home',redirect: false, } );
    
          if (result?.error) {
            // console.log(error)
            console.error('Sign-in failed', result.error);
            toast.error('Sign in using google failed');
            return;
          }
          // await new Promise((resolve) => setTimeout(resolve, 500)); 
    
          const session = await getSession();
          if (!session) {
            console.error("Session retrieval failed");
            toast.error("Failed to retrieve session data");
            return;
          }
    
          if (!session || !session.user) {
            console.error('Session or user data is missing');
            toast.error('Failed to retrieve session data');
            return;
          }
    
          const userData = {
            username: session.user.name ?? '',
            email: session.user.email ?? '',
            image: session.user.image ?? '',
          };
          console.log('user data',userData);
          // const authStore = role === 'student' ? studentAuth : tutorAuth;
          console.log("Before calling googleSignInApi");
    
          // const googleApi = role == 'student' ? studentGoogle : tutorGoogle
          console.log("Session retrieved:", session);
          // const response = await googleSignInApi(userData,session);
          const response = await axios.post(`${API_URI}/student/callback`,{userData,session})
          localStorage.setItem('authUserCheck', response.data.accessToken) 
          useAuthStore.getState().saveUserDetails(response.data);
        } catch (error) {
          console.log(error)
          toast.error((error as Error)?.message || 'An unexpected error occurred')
        }
      },
    }),
    {
      name: 'auth-storage', // LocalStorage key
    }
  )
);

export default useAuthStore;
