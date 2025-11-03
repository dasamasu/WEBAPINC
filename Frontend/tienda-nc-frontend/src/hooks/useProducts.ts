import { useState, useEffect, useCallback } from 'react';
import { productAPI } from '../services/productAPI';
import { toast } from 'react-hot-toast';
import type { 
  Product, 
  CreateProductData, 
  UpdateProductData, 
  ProductQuery, 
  ApiError 
} from '../types';

export const useProducts = (initialQuery: ProductQuery = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState<ProductQuery>(initialQuery);

  const fetchProducts = useCallback(async (searchQuery: ProductQuery = query) => {
    try {
      setLoading(true);
      const response = await productAPI.getProducts(searchQuery);
      setProducts(response.items);
      setTotalCount(response.totalCount);
      setCurrentPage(response.page);
      setTotalPages(response.totalPages);
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.message);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const updateQuery = useCallback((newQuery: Partial<ProductQuery>) => {
    const updatedQuery = { ...query, ...newQuery, page: 1 };
    setQuery(updatedQuery);
    fetchProducts(updatedQuery);
  }, [query, fetchProducts]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      const updatedQuery = { ...query, page: currentPage + 1 };
      setQuery(updatedQuery);
      fetchProducts(updatedQuery);
    }
  }, [currentPage, totalPages, query, fetchProducts]);

  const loadMore = useCallback(() => {
    if (currentPage < totalPages) {
      const updatedQuery = { ...query, page: currentPage + 1 };
      setLoading(true);
      productAPI.getProducts(updatedQuery)
        .then(response => {
          setProducts(prev => [...prev, ...response.items]);
          setCurrentPage(response.page);
        })
        .catch(error => {
          const apiError = error as ApiError;
          toast.error(apiError.message);
        })
        .finally(() => setLoading(false));
    }
  }, [currentPage, totalPages, query]);

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    totalCount,
    currentPage,
    totalPages,
    query,
    updateQuery,
    nextPage,
    loadMore,
    refetch: fetchProducts,
    hasNextPage: currentPage < totalPages,
  };
};

export const useProduct = (id: number) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProduct(id);
      setProduct(response);
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id, fetchProduct]);

  return { product, loading, refetch: fetchProduct };
};

export const useProductMutations = () => {
  const [loading, setLoading] = useState(false);

  const createProduct = useCallback(async (data: CreateProductData) => {
    try {
      setLoading(true);
      const product = await productAPI.createProduct(data);
      toast.success('Producto creado exitosamente');
      return { success: true, data: product };
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.message);
      return { success: false, error: apiError.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProduct = useCallback(async (id: number, data: UpdateProductData) => {
    try {
      setLoading(true);
      const product = await productAPI.updateProduct(id, data);
      toast.success('Producto actualizado exitosamente');
      return { success: true, data: product };
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.message);
      return { success: false, error: apiError.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(async (id: number) => {
    try {
      setLoading(true);
      await productAPI.deleteProduct(id);
      toast.success('Producto eliminado exitosamente');
      return { success: true };
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.message);
      return { success: false, error: apiError.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    loading,
  };
};
