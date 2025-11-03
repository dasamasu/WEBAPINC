import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { motion } from 'framer-motion';

export const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('Todos');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('name');
  const [sortDesc, setSortDesc] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const searchQuery = useMemo(() => ({
    search: searchTerm || undefined,
    type: selectedType === 'Todos' ? undefined : selectedType,
    minPrice: priceRange.min ? parseFloat(priceRange.min) : undefined,
    maxPrice: priceRange.max ? parseFloat(priceRange.max) : undefined,
    orderBy: sortBy,
    orderDesc: sortDesc,
    page: 1,
    pageSize: 12,
  }), [searchTerm, selectedType, priceRange, sortBy, sortDesc]);

  const { 
    products, 
    loading, 
    hasNextPage, 
    loadMore, 
    updateQuery 
  } = useProducts(searchQuery);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    updateQuery({ search: value || undefined });
  };

  const handleTypeFilter = (type: string) => {
    setSelectedType(type);
    updateQuery({ type: type === 'Todos' ? undefined : type });
  };

  const handlePriceFilter = () => {
    updateQuery({
      minPrice: priceRange.min ? parseFloat(priceRange.min) : undefined,
      maxPrice: priceRange.max ? parseFloat(priceRange.max) : undefined,
    });
  };

  const handleSort = (orderBy: string, orderDesc: boolean) => {
    setSortBy(orderBy);
    setSortDesc(orderDesc);
    updateQuery({ orderBy, orderDesc });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Page Header */}
      <section className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Nuestros Productos
            </h1>
            <p className="text-lg text-gray-600">
              Encuentra todo lo que necesitas para comprar o alquilar
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center space-x-2 lg:hidden"
            >
              <SlidersHorizontal size={20} />
              <span>Filtros</span>
            </button>

            {/* Desktop Filters */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => handleTypeFilter(e.target.value)}
                className="input-field w-auto"
              >
                <option value="Todos">Todos</option>
                <option value="Venta">Venta</option>
                <option value="Alquiler">Alquiler</option>
              </select>

              {/* Sort */}
              <select
                value={`${sortBy}-${sortDesc}`}
                onChange={(e) => {
                  const [field, desc] = e.target.value.split('-');
                  handleSort(field, desc === 'true');
                }}
                className="input-field w-auto"
              >
                <option value="name-false">Nombre A-Z</option>
                <option value="name-true">Nombre Z-A</option>
                <option value="price-false">Precio menor</option>
                <option value="price-true">Precio mayor</option>
                <option value="date-true">Más recientes</option>
              </select>
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 lg:hidden border-t pt-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => handleTypeFilter(e.target.value)}
                    className="input-field"
                  >
                    <option value="Todos">Todos</option>
                    <option value="Venta">Venta</option>
                    <option value="Alquiler">Alquiler</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rango de Precio
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                      onBlur={handlePriceFilter}
                      className="input-field"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                      onBlur={handlePriceFilter}
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ordenar por
                  </label>
                  <select
                    value={`${sortBy}-${sortDesc}`}
                    onChange={(e) => {
                      const [field, desc] = e.target.value.split('-');
                      handleSort(field, desc === 'true');
                    }}
                    className="input-field"
                  >
                    <option value="name-false">Nombre A-Z</option>
                    <option value="name-true">Nombre Z-A</option>
                    <option value="price-false">Precio menor</option>
                    <option value="price-true">Precio mayor</option>
                    <option value="date-true">Más recientes</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && products.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="card">
                <div className="skeleton h-36 mb-3"></div>
                <div className="p-3">
                  <div className="skeleton h-5 mb-2"></div>
                  <div className="skeleton h-3 mb-3"></div>
                  <div className="flex justify-between items-center">
                    <div className="skeleton h-8 w-20"></div>
                    <div className="skeleton h-8 w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasNextPage && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Cargando...' : 'Cargar más productos'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-600">
              Intenta ajustar tus filtros de búsqueda
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductsPage;
