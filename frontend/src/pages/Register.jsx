import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import { getErrorMessage } from '../services/api.js';
import Alert from '../components/Alert.jsx';

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', phone: '', city: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    if (form.password !== form.confirm) return setError('Passwords do not match');

    setSubmitting(true);
    try {
      const { confirm, ...details } = form;
      await register(details);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="card space-y-4">
        <h1 className="text-2xl font-bold">Create your account</h1>
        {error && <Alert type="error">{error}</Alert>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="name">Full name</label>
            <input id="name" name="name" required className="input" value={form.name} onChange={handleChange} />
          </div>
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required className="input" value={form.email} onChange={handleChange} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="phone">Phone (optional)</label>
              <input id="phone" name="phone" className="input" value={form.phone} onChange={handleChange} />
            </div>
            <div>
              <label className="label" htmlFor="city">City (optional)</label>
              <input id="city" name="city" className="input" value={form.city} onChange={handleChange} />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required className="input" value={form.password} onChange={handleChange} />
          </div>
          <div>
            <label className="label" htmlFor="confirm">Confirm password</label>
            <input id="confirm" name="confirm" type="password" required className="input" value={form.confirm} onChange={handleChange} />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
        <p className="text-center text-sm text-slate-600">
          Already have an account? <Link to="/login" className="font-medium text-teal-700">Login</Link>
        </p>
      </div>
    </div>
  );
}