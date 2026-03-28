import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <header className="nav-shell">
      <nav className="container nav">
        <Link to="/" className="brand">
          <img src="/logo.svg" alt="9ja Food logo" className="logo" />
        </Link>

        <div className="nav-links desktop-only">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/menu">Menu</NavLink>
          <NavLink to="/locations">Locations</NavLink>
          {user && !isAdmin && <NavLink to="/cart">Cart</NavLink>}
          {user && !isAdmin && <NavLink to="/orders">My Orders</NavLink>}
        </div>

        <div className="nav-actions">
          {!user ? (
            <>
              <Link className="btn btn-secondary desktop-only" to="/auth?mode=signup">Sign Up</Link>
              <Link className="btn btn-primary" to="/auth">Login</Link>
            </>
          ) : (
            <>
              <span className="small desktop-only">{user.email}</span>
              <button className="btn btn-secondary" onClick={handleSignOut} type="button">Sign out</button>
            </>
          )}
        </div>
      </nav>

      <nav className="mobile-nav">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/menu">Menu</NavLink>
        <NavLink to="/cart">Order</NavLink>
        <NavLink to="/locations">Locations</NavLink>
      </nav>
    </header>
  );
}
