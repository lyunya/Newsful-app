import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useSavedArticles } from '../context/SavedArticlesContext';
import './Header.css';

export default function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { savedArticles } = useSavedArticles();

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="brand">
          Newsful
        </Link>

        <nav className="main-nav" aria-label="Main">
          <NavLink to="/" className="nav-link" end>
            Home
          </NavLink>
          <NavLink to="/saved" className="nav-link">
            Saved
            {savedArticles.length > 0 && (
              <span className="saved-count">{savedArticles.length}</span>
            )}
          </NavLink>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={
              theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
            }
          >
            {theme === 'dark' ? '🌞' : '🌚'}
          </button>
          {user ? (
            <>
              <span className="user-email" title={user.email}>
                {user.email}
              </span>
              <button type="button" className="auth-link" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <NavLink to="/login" className="nav-link">
              Log in
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}
