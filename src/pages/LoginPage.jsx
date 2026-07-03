import { Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();

  return (
    <AuthForm
      title="Log in"
      submitLabel="Log in"
      onSubmit={login}
      footer={
        <span>
          New here? <Link to="/register">Create an account</Link>
        </span>
      }
    />
  );
}
