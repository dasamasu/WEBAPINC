import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminProductsPage } from './pages/AdminProductsPage';
import AdminUsersPage from './pages/AdminUsersPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import About from './components/About';

function App() {
  return (
    <div className='relative z-0 bg-primary'>
      <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
        <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Rutas protegidas para Admin */}
            <Route 
              path="/admin/products" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminProductsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminUsersPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
          <About />
      </div>
    </div>
  );
}

export default App;
