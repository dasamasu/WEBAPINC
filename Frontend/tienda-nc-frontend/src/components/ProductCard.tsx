import { motion } from 'framer-motion';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (id: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onEdit, 
  onDelete 
}) => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'Admin';

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.classList.remove('skeleton');
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Use a simple SVG placeholder instead of external service
    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTI1SDIyNVYxNzVIMTc1VjEyNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2ZyB4PSIxODAiIHk9IjE4MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjNkI3Mjg4Ij4KPHRleHQgeD0iNSIgeT0iMTUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZCNzI4OCI+U2luIEltYWdlbjwvdGV4dD4KPHN2Zz4KPHN2Zz4=';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card group hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-36 object-cover skeleton"
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />
        
        {/* Badge de tipo */}
        <div className="absolute top-2 left-2">
          <span className={product.type === 'Venta' ? 'badge-venta' : 'badge-alquiler'}>
            {product.type}
          </span>
        </div>

        {/* Acciones (solo para admin) */}
        {isAdmin && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex space-x-1">
              {onEdit && (
                <button
                  onClick={() => onEdit(product)}
                  className="p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                  title="Editar producto"
                >
                  <Edit size={14} />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(product.id)}
                  className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  title="Eliminar producto"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-base text-gray-900 mb-1 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-xs mb-2 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-primary-600">
              ${product.price.toFixed(2)}
            </span>
            {product.type === 'Alquiler' && (
              <span className="text-xs text-gray-500 ml-1">/día</span>
            )}
          </div>
          
          <Link
            to={`/product/${product.id}`}
            className="btn-outline flex items-center space-x-1 text-xs px-2 py-1"
          >
            <Eye size={14} />
            <span>Ver</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
