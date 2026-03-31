import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AdminNavbar from './components/AdminNavbar';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import UserNavbar from './components/UserNavbar';
import { useAuth } from './contexts/AuthContext';
import AdminDashboard from './pages/AdminDashboard';
import AuthPage from './pages/AuthPage';
import CartPage from './pages/CartPage';
import HomePage from './pages/HomePage';
import LocationsPage from './pages/LocationsPage';
import MenuPage from './pages/MenuPage';
import OrdersPage from './pages/OrdersPage';

export default function App() {
  const { isAdmin, user } = useAuth();
  const location = useLocation();
  const showAdminNav = isAdmin && location.pathname.startsWith('/admin');
  const showUserNav = !!user && !isAdmin;

  return (
    <div className="app-shell">
      {showAdminNav ? <AdminNavbar /> : showUserNav ? <UserNavbar /> : <Navbar />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/locations" element={<LocationsPage />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute disallowAdmin>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute disallowAdmin>
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
      {!showAdminNav && <Footer />}
    </div>
  );
}
