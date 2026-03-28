import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isSignup) {
        await signUp(form.email, form.password, form.fullName);
        setMessage('Signup successful. Please verify your email if required.');
      } else {
        await signIn(form.email, form.password);
        if (form.email.toLowerCase() === '9jafoodsucres@gmail.com') {
          navigate('/admin');
        } else {
          navigate('/menu');
        }
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container section auth-wrap">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h1>{isSignup ? 'Create Account' : 'Login'}</h1>
        {isSignup && (
          <input
            className="input"
            placeholder="Full Name"
            value={form.fullName}
            onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
            required
          />
        )}
        <input
          className="input"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          required
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          required
        />

        <button className="btn btn-primary w-full" disabled={loading} type="submit">
          {loading ? 'Please wait...' : isSignup ? 'Sign Up' : 'Login'}
        </button>

        <button
          className="btn btn-secondary w-full"
          type="button"
          onClick={() => setIsSignup((prev) => !prev)}
        >
          {isSignup ? 'Have an account? Login' : 'Need an account? Sign Up'}
        </button>

        {message && <p className="mt-sm">{message}</p>}
      </form>

      {isAdmin && <p className="small">Admin account authenticated.</p>}
    </div>
  );
}
