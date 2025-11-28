import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell';
import useAuthStore from '../store/useAuthStore';
import GoogleAuthButton from '../components/GoogleAuthButton';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading, error, user } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await login(form);
    } catch {
      // feedback handled by store error state
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  return (
    <PageShell>
      <section className="auth-hub">
        <div className="auth-panel auth-panel--split">
          <div className="auth-panel__aside">
            <p className="auth-pill">Swyn Sports</p>
            <h3>Coach-ready login</h3>
            <ul>
              <li>Sync rituals instantly</li>
              <li>Offline cache for travel</li>
              <li>PWA install in one tap</li>
            </ul>
          </div>
          <div className="auth-panel__form-wrap">
            <div className="auth-panel__header">
              <h1>Welcome back</h1>
              <p>Sign in to keep your sports rituals synced in real time.</p>
            </div>
            <form className="auth-form" onSubmit={handleSubmit}>
              <label className="auth-field">
                Email
                <input type="email" required name="email" value={form.email} onChange={handleChange} />
              </label>
              <label className="auth-field">
                Password
                <input type="password" required name="password" value={form.password} onChange={handleChange} />
              </label>
              <button className="primary-btn" type="submit" disabled={loading}>
                {loading ? 'Checking credentials…' : 'Login'}
              </button>
            </form>
            {error && (
              <p style={{ color: '#c77700', marginTop: '0.75rem' }}>
                {error}
              </p>
            )}
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <GoogleAuthButton />
            </div>
            <p className="auth-panel__footer">
              Need an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default LoginPage;

