import { useState } from 'react';
import useAuth from '../hooks/useAuth.js';
import { getErrorMessage } from '../services/api.js';
import Alert from '../components/Alert.jsx';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user.name || '',
    phone: user.phone || '',
    city: user.city || '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setSaving(true);
    try {
      await updateProfile(form);
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err) {
      setMessage({ type: 'error', text: getErrorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <div className="card space-y-4">
        <h1 className="text-2xl font-bold">My profile</h1>
        {message.text && <Alert type={message.type}>{message.text}</Alert>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" className="input bg-slate-100" value={user.email} disabled />
          </div>
          <div>
            <label className="label" htmlFor="name">Full name</label>
            <input id="name" name="name" required className="input" value={form.name} onChange={handleChange} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="phone">Phone</label>
              <input id="phone" name="phone" className="input" value={form.phone} onChange={handleChange} />
            </div>
            <div>
              <label className="label" htmlFor="city">City</label>
              <input id="city" name="city" className="input" value={form.city} onChange={handleChange} />
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  );
}