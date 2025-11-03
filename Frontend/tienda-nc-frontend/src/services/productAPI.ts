import api from './api';
import type { 
  Product, 
  CreateProductData, 
  UpdateProductData, 
  ProductQuery, 
  PagedResult 
} from '../types';

export const productAPI = {
  getProducts: async (query: ProductQuery = {}): Promise<PagedResult<Product>> => {
    const params = new URLSearchParams();
    
    if (query.search) params.append('search', query.search);
    if (query.type) params.append('type', query.type);
    if (query.minPrice !== undefined) params.append('minPrice', query.minPrice.toString());
    if (query.maxPrice !== undefined) params.append('maxPrice', query.maxPrice.toString());
    if (query.orderBy) params.append('orderBy', query.orderBy);
    if (query.orderDesc !== undefined) params.append('orderDesc', query.orderDesc.toString());
    if (query.page) params.append('page', query.page.toString());
    if (query.pageSize) params.append('pageSize', query.pageSize.toString());

    const response = await api.get<PagedResult<Product>>(`/products?${params.toString()}`);
    return response.data;
  },

  getProduct: async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  createProduct: async (data: CreateProductData): Promise<Product> => {
    const response = await api.post<Product>('/products', data);
    return response.data;
  },

  updateProduct: async (id: number, data: UpdateProductData): Promise<Product> => {
    const response = await api.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};
