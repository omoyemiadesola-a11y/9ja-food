import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import PublicLayout from './components/PublicLayout';
import UserLayout from './components/UserLayout';
import AdminLayout from './components/AdminLayout';

import AdminDashboard from './pages/AdminDashboard';
import AuthPage from './pages/AuthPage';
import CartPage from './pages/CartPage';
import HomePage from './pages/HomePage';
import LocationsPage from './pages/LocationsPage';
import MenuPage from './pages/MenuPage';
import OrdersPage from './pages/OrdersPage';

export default function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
        </Route>

        <Route
          path="/menu"
          element={
            <UserLayout>
              <MenuPage />
            </UserLayout>
          }
        />

        <Route
          path="/locations"
          element={
            <UserLayout>
              <LocationsPage />
            </UserLayout>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <UserLayout>
                <CartPage />
              </UserLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <UserLayout>
                <OrdersPage />
              </UserLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}