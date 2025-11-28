import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell';
import useAuthStore from '../store/useAuthStore';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await register(form);
      navigate('/dashboard');
    } catch {
      // error message handled above
    }
  };

  return (
    <PageShell>
      <section className="auth-hub">
        <div className="auth-panel auth-panel--split">
          <div className="auth-panel__aside">
            <p className="auth-pill">Swyn Sports</p>
            <h3>Why join?</h3>
            <ul>
              <li>Realtime socket updates</li>
              <li>Installable progressive web app</li>
              <li>Offline cache for travel days</li>
            </ul>
          </div>
          <div className="auth-panel__form-wrap">
            <div className="auth-panel__header">
              <h1>Create your roster</h1>
              <p>Register to start logging drills, nutrition, and recovery rituals.</p>
            </div>
            <form className="auth-form" onSubmit={handleSubmit}>
              <label className="auth-field">
                Full name
                <input name="name" value={form.name} onChange={handleChange} required />
              </label>
              <label className="auth-field">
                Email
                <input type="email" name="email" value={form.email} onChange={handleChange} required />
              </label>
              <label className="auth-field">
                Password
                <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} />
              </label>
              <button className="primary-btn" type="submit" disabled={loading}>
                {loading ? 'Creating profile…' : 'Register'}
              </button>
            </form>
            {error && (
              <p style={{ color: '#666666', marginTop: '0.75rem' }}>
                {error}
              </p>
            )}
            <p className="auth-panel__footer">
              Already inside? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default RegisterPage;

