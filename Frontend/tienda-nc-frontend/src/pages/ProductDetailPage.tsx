import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProduct } from '../hooks/useProducts';

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { product, loading } = useProduct(Number(id));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="skeleton h-96 mb-6"></div>
            <div className="p-6">
              <div className="skeleton h-8 mb-4"></div>
              <div className="skeleton h-6 mb-2"></div>
              <div className="skeleton h-6 mb-6"></div>
              <div className="flex justify-between items-center">
                <div className="skeleton h-10 w-32"></div>
                <div className="skeleton h-10 w-24"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Producto no encontrado
            </h2>
            <button
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Use a simple SVG placeholder instead of external service
    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNTAgMjUwSDQ1MFYzNTBIMzUwVjI1MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2ZyB4PSIzNDAiIHk9IjM3MCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSI0MCIgZmlsbD0iIzZCNzI4OCI+Cjx0ZXh0IHg9IjEwIiB5PSIyNSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmaWxsPSIjNkI3Mjg4Ij5TaW4gSW1hZ2VuPC90ZXh0Pgo8L3N2Zz4KPHN2Zz4=';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Volver</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="md:flex">
            {/* Image */}
            <div className="md:w-1/2">
              <img
                src={product.imageUrl}
                alt={product.name}
                onError={handleImageError}
                className="w-full h-96 md:h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="md:w-1/2 p-6">
              {/* Badge */}
              <div className="mb-4">
                <span className={product.type === 'Venta' ? 'badge-venta text-lg' : 'badge-alquiler text-lg'}>
                  {product.type}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-center space-x-2 mb-6">
                <DollarSign className="text-primary-600" size={24} />
                <span className="text-3xl font-bold text-primary-600">
                  ${product.price.toFixed(2)}
                </span>
                {product.type === 'Alquiler' && (
                  <span className="text-lg text-gray-500">/día</span>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Descripción
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description || 'Sin descripción disponible.'}
                </p>
              </div>

              {/* Metadata */}
              <div className="flex items-center space-x-4 mb-6 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar size={16} />
                  <span>Publicado: {new Date(product.createdAt).toLocaleDateString('es-ES')}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="btn-primary flex-1">
                  {product.type === 'Venta' ? 'Contactar para comprar' : 'Contactar para alquilar'}
                </button>
                <button className="btn-outline">
                  Compartir
                </button>
              </div>

              {/* Contact Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">
                  ¿Interesado en este producto?
                </h4>
                <p className="text-sm text-gray-600">
                  Contáctanos para más información sobre disponibilidad y condiciones.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};


export default ProductDetailPage;