import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AdminNavbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <header className="nav-shell">
      <nav className="container nav">
        <Link to="/admin" className="brand">
          <img src="/logo.svg" alt="9ja Food logo" className="logo" />
        </Link>

        <div className="nav-links desktop-only">
          <NavLink to="/admin">Dashboard</NavLink>
        </div>

        <div className="nav-actions">
          {user?.email && <span className="small desktop-only">{user.email}</span>}
          <button className="btn btn-secondary" onClick={handleSignOut} type="button">
            Sign out
          </button>
        </div>
      </nav>

      <nav className="mobile-nav">
        <NavLink to="/admin">Dashboard</NavLink>
      </nav>
    </header>
  );
}