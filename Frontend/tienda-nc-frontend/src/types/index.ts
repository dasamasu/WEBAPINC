export enum UserRole {
  Admin = 'Admin',
  User = 'User'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  type: 'Venta' | 'Alquiler';
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  type: 'Venta' | 'Alquiler';
}

export interface UpdateProductData extends CreateProductData {}

export interface ProductQuery {
  search?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  orderBy?: string;
  orderDesc?: boolean;
  page?: number;
  pageSize?: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  status?: number;
}
