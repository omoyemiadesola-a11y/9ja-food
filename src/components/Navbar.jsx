import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="nav-shell">
      <nav className="container nav">
        <Link to="/" className="brand">
          <img src="/logo.svg" alt="9ja Food logo" className="logo" />
        </Link>

        <div className="nav-links desktop-only">
          <NavLink to="/">Home</NavLink>
        </div>

        <div className="nav-actions">
          <Link className="btn btn-secondary desktop-only" to="/auth?mode=signup">
            Sign Up
          </Link>
          <Link className="btn btn-primary" to="/auth">
            Login
          </Link>
        </div>
      </nav>

      <nav className="mobile-nav">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/auth">Login</NavLink>
      </nav>
    </header>
  );
}