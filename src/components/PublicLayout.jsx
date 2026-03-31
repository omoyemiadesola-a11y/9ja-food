import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';
import { useAuth } from '../contexts/AuthContext';

export default function PublicLayout() {
  const { user, isAdmin } = useAuth();
  const showPublicChrome = !user && !isAdmin;

  return (
    <div className="app-shell">
      {showPublicChrome && <Navbar />}
      <main className="main-content">
        <Outlet />
      </main>
      {showPublicChrome && <Footer />}
    </div>
  );
}
