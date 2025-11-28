import { Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const NavBar = () => {
  const { user, logout } = useAuthStore();

  const identityLabel = user?.email || user?.name || '';
  const avatarLetter = identityLabel ? identityLabel.charAt(0).toUpperCase() : 'S';

  return (
    <header className="swyn-header-v2">
      <div className="swyn-header-v2__top">
        <Link to="/" className="swyn-logo-v2">
          <span className="swyn-logo-icon">S</span>
          <div className="swyn-logo-text">
            <span className="swyn-logo-main">Swyn</span>
            <span className="swyn-logo-sub">Sports</span>
          </div>
        </Link>
        {user && (
          <nav className="swyn-header-v2__nav-center">
            <Link to="/" className="swyn-nav-item">Home</Link>
            <Link to="/dashboard" className="swyn-nav-item">Tasks</Link>
            <Link to="/insights" className="swyn-nav-item">Insights</Link>
          </nav>
        )}
        {user && (
          <div className="swyn-header-v2__user">
            <div className="swyn-user-badge">
              <span className="swyn-user-avatar">{avatarLetter}</span>
              <span className="swyn-user-email">{user.email}</span>
            </div>
            <button className="swyn-logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        )}
        {!user && (
          <div className="swyn-header-v2__auth">
            <Link to="/login" className="swyn-auth-link">Login</Link>
            <Link to="/register" className="swyn-auth-btn">Join</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;

