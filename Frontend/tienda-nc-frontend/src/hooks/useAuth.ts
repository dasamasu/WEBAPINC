import { useState, useCallback } from 'react';
import { authAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-hot-toast';
import type { LoginCredentials, RegisterCredentials, ApiError } from '../types';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const { setAuth, clearAuth, setLoading: setStoreLoading, user, token, isAuthenticated } = useAuthStore();

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setStoreLoading(true);
      
      const response = await authAPI.login(credentials);
      setAuth(response.token, response.user);
      
      toast.success('¡Bienvenido!');
      return { success: true };
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.message);
      return { success: false, error: apiError.message };
    } finally {
      setLoading(false);
      setStoreLoading(false);
    }
  }, [setAuth, setStoreLoading]);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    try {
      setLoading(true);
      setStoreLoading(true);
      
      const response = await authAPI.register(credentials);
      setAuth(response.token, response.user);
      
      toast.success('¡Cuenta creada exitosamente!');
      return { success: true };
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.message);
      return { success: false, error: apiError.message };
    } finally {
      setLoading(false);
      setStoreLoading(false);
    }
  }, [setAuth, setStoreLoading]);

  const logout = useCallback(() => {
    clearAuth();
    toast.success('Sesión cerrada');
  }, [clearAuth]);

  return {
    login,
    register,
    logout,
    loading,
    user,
    token,
    isAuthenticated,
  };
};
