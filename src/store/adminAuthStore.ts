import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import adminAxiosInstance from '@/app/service/admin/adminAxiosInstance';

export interface User {
  id: string;
  role?: string;
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

const useAdminAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      saveUserDetails: (authResponse: AuthResponse) => {
        const { user, accessToken } = authResponse;
        
        set({ 
          user: user, 
          token: accessToken, 
          isAuthenticated: true 
        });
        
        // Debug check
      },

      refreshAccessToken: async () => {
        try {
          const cookies = document.cookie;
          if (!cookies.includes("refreshToken")) {
            console.warn("No refresh token found. Skipping token refresh.");
            return false;
          }
      
          const response = await adminAxiosInstance.post<RefreshTokenResponse>('/admin/refresh-token');
      
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
          await adminAxiosInstance.post('/admin/logout');
        } catch (error) {
          console.error('Logout failed:', error);
        }
        set({ user: null, token: null, isAuthenticated: false });
      }
    }),
    {
      name: 'admin-auth-storage',
    }
  )
);

export default useAdminAuthStore;