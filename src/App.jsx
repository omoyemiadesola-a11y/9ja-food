import { Navigate, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
import AdminDashboard from './pages/AdminDashboard';
import AuthPage from './pages/AuthPage';
import CartPage from './pages/CartPage';
import HomePage from './pages/HomePage';
import LocationsPage from './pages/LocationsPage';
import MenuPage from './pages/MenuPage';
import OrdersPage from './pages/OrdersPage';

export default function App() {
  const { isAdmin } = useAuth();

  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/locations" element={<LocationsPage />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to={isAdmin ? '/admin' : '/'} replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
