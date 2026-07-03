import { Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { SavedArticlesProvider } from './context/SavedArticlesContext';
import HomePage from './pages/HomePage';
import SavedPage from './pages/SavedPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SavedArticlesProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* Legacy URLs from the login-walled era */}
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/saved-articles" element={<Navigate to="/saved" replace />} />
            <Route path="/registration" element={<Navigate to="/register" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SavedArticlesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
