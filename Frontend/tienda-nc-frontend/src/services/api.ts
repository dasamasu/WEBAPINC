import axios from 'axios';
import type { AxiosResponse, AxiosError } from 'axios';
import type { 
  AuthResponse, 
  LoginCredentials, 
  RegisterCredentials, 
  ApiError,
  User,
  UserRole
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7040/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-storage') 
      ? JSON.parse(localStorage.getItem('auth-storage')!)?.state?.token
      : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: 'Ha ocurrido un error',
      status: error.response?.status,
    };

    if (error.response?.data) {
      const data = error.response.data as any;
      apiError.message = data.message || data.title || 'Error en el servidor';
    } else if (error.request) {
      apiError.message = 'No se pudo conectar con el servidor';
    } else {
      apiError.message = error.message || 'Error desconocido';
    }

    // Handle 401 unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }

    return Promise.reject(apiError);
  }
);

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', credentials);
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/refresh-token', { 
      refreshToken 
    });
    return response.data;
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  deleteUser: async (userId: string): Promise<void> => {
    await api.delete(`/users/${userId}`);
  },

  updateUserRole: async (userId: string, role: UserRole): Promise<User> => {
    const response = await api.patch<User>(`/users/${userId}/role`, { role });
    return response.data;
  },
};

export default api;
