import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, User } from '../types';

interface AuthStore extends AuthState {
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      
      setAuth: (token: string, user: User) => 
        set({ 
          token, 
          user, 
          isAuthenticated: true,
          isLoading: false 
        }),
      
      clearAuth: () => 
        set({ 
          token: null, 
          user: null, 
          isAuthenticated: false,
          isLoading: false 
        }),
      
      setLoading: (isLoading: boolean) => 
        set({ isLoading }),
      
      updateUser: (user: User) => 
        set({ user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token, 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
