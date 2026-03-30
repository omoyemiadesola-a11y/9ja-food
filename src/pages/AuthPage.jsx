import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function AuthPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  const initialMode = useMemo(
    () => searchParams.get('mode') === 'signup',
    [searchParams]
  );

  const redirectTo = searchParams.get('redirect') || '/menu';

  const [isSignup, setIsSignup] = useState(initialMode);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const switchMode = (nextIsSignup) => {
    setIsSignup(nextIsSignup);

    if (nextIsSignup) {
      setSearchParams({ mode: 'signup' });
    } else {
      setSearchParams({});
    }

    setMessage('');
  };

  const resolveRedirectAfterLogin = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    if (!user) {
      throw new Error('Login succeeded, but no user session was found.');
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      throw profileError;
    }

    if (profile?.role === 'admin') {
      navigate('/admin', { replace: true });
      return;
    }

    navigate(redirectTo, { replace: true });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isSignup) {
        await signUp(form.email, form.password, form.fullName);
        setMessage('Signup successful. Please verify your email if required, then log in.');
      } else {
        await signIn(form.email, form.password);
        await resolveRedirectAfterLogin();
      }
    } catch (error) {
      setMessage(error.message || 'Authentication failed.');
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
            onChange={(e) =>
              setForm((prev) => ({ ...prev, fullName: e.target.value }))
            }
            required
          />
        )}

        <input
          className="input"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, email: e.target.value }))
          }
          required
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, password: e.target.value }))
          }
          required
        />

        <button className="btn btn-primary w-full" disabled={loading} type="submit">
          {loading ? 'Please wait...' : isSignup ? 'Sign Up' : 'Login'}
        </button>

        <button
          className="btn btn-secondary w-full"
          type="button"
          onClick={() => switchMode(!isSignup)}
        >
          {isSignup ? 'Have an account? Login' : 'Need an account? Sign Up'}
        </button>

        {message && <p className="mt-sm">{message}</p>}
      </form>
    </div>
  );
}