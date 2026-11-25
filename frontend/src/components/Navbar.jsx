import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { PawPrint, Menu, X, LogOut } from 'lucide-react';
import useAuth from '../hooks/useAuth.js';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/pets', label: 'My Pets' },
  { to: '/vets', label: 'Veterinarians' },
  { to: '/appointments', label: 'Appointments' },
  { to: '/clinics', label: 'Nearby Clinics' },
  { to: '/health', label: 'Health Library' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `rounded-md px-3 py-2 text-sm font-medium transition ${
      isActive ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-100'
    }`;

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-teal-700">
          <PawPrint /> PetCare
        </Link>

        {user && (
          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
          </nav>
        )}

        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <>
              <Link to="/profile" className="text-sm font-medium text-slate-700 hover:text-teal-700">
                {user.name}
              </Link>
              <button onClick={handleLogout} className="btn-secondary">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">Login</Link>
              <Link to="/register" className="btn-primary">Sign up</Link>
            </>
          )}
        </div>

        <button className="lg:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-1 border-t border-slate-200 px-4 py-3 lg:hidden">
          {user ? (
            <>
              {links.map((l) => (
                <NavLink key={l.to} to={l.to} className={linkClass} onClick={() => setOpen(false)}>
                  {l.label}
                </NavLink>
              ))}
              <NavLink to="/profile" className={linkClass} onClick={() => setOpen(false)}>
                Profile
              </NavLink>
              <button onClick={handleLogout} className="btn-secondary mt-2">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary" onClick={() => setOpen(false)}>Login</Link>
              <Link to="/register" className="btn-primary" onClick={() => setOpen(false)}>Sign up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}