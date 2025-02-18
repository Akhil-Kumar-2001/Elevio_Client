import { create } from 'zustand';
import { persist,createJSONStorage } from 'zustand/middleware';
import tutorAxiosInstance from '@/app/service/user/userAxiosInstance';

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
          const response = await tutorAxiosInstance.post<RefreshTokenResponse>('/tutor/refresh-token');
      
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
          const response = await tutorAxiosInstance.post('/tutor/logout'); // Call logout API
          console.log(response)
        } catch (error) {
          console.error('Logout failed:', error);
        }
        set({ user: null, token: null, isAuthenticated: false });
      }
    }),
    {
      name: 'auth-storage', // LocalStorage key
    }
  )
);

export default useAuthStore;
