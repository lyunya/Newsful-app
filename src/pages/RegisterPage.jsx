import { Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();

  return (
    <AuthForm
      title="Create an account"
      submitLabel="Create account"
      onSubmit={register}
      hint="At least 8 characters, with an upper case letter, lower case letter, number, and special character."
      footer={
        <span>
          Already have an account? <Link to="/login">Log in</Link>
        </span>
      }
    />
  );
}
