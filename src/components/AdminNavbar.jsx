import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AdminNavbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <header className="nav-shell admin-shell">
      <nav className="container nav">
        <NavLink to="/admin" className="brand"><img src="/logo.svg" alt="9ja Food logo" className="logo" /></NavLink>
        <div className="nav-links desktop-only">
          <button className="back-link" type="button" onClick={() => navigate(-1)}>← Back</button>
          <NavLink to="/admin">Dashboard</NavLink>
          <NavLink to="/menu">Menu</NavLink>
          <NavLink to="/locations">Locations</NavLink>
        </div>
        <div className="nav-actions">
          <span className="small desktop-only">Admin: {user?.email}</span>
          <button className="btn btn-secondary" onClick={handleSignOut} type="button">Sign out</button>
        </div>
      </nav>
    </header>
  );
}
