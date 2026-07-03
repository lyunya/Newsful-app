import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import './AuthForm.css';

// Shared shell for the login and register pages. Accounts are optional —
// they only exist to sync bookmarks across devices.
export default function AuthForm({ title, submitLabel, onSubmit, footer, hint }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({ email: email.trim(), password });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="auth-page">
        <div className="auth-card">
          <h1 className="auth-title">{title}</h1>
          <p className="auth-subtitle">
            An account is optional — it just keeps your bookmarks in sync
            across devices.
          </p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-label" htmlFor="email">
              Email
              <input
                id="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="auth-input"
              />
            </label>
            <label className="auth-label" htmlFor="password">
              Password
              <input
                id="password"
                type="password"
                autoComplete={
                  title === 'Log in' ? 'current-password' : 'new-password'
                }
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="auth-input"
              />
            </label>
            {hint && <p className="auth-hint">{hint}</p>}
            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}
            <button type="submit" className="auth-submit" disabled={isSubmitting}>
              {isSubmitting ? 'One moment…' : submitLabel}
            </button>
          </form>
          <div className="auth-footer">{footer}</div>
          <p className="auth-skip">
            <Link to="/">Skip this — take me to the news</Link>
          </p>
        </div>
      </main>
    </>
  );
}
