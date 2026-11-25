import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, CalendarCheck, Plus, Stethoscope, BookOpen } from 'lucide-react';
import api, { getErrorMessage } from '../services/api.js';
import useAuth from '../hooks/useAuth.js';
import Loader from '../components/Loader.jsx';
import Alert from '../components/Alert.jsx';
import { formatDate, imageSrc } from '../utils/helpers.js';

const quickActions = [
  { to: '/pets/new', label: 'Add a pet', icon: Plus },
  { to: '/vets', label: 'Find veterinarians', icon: Stethoscope },
  { to: '/appointments/book', label: 'Book appointment', icon: CalendarCheck },
  { to: '/health', label: 'Health library', icon: BookOpen },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/dashboard')
      .then(({ data }) => setData(data))
      .catch((e) => setError(getErrorMessage(e)));
  }, []);

  if (error) return <Alert type="error">{error}</Alert>;
  if (!data) return <Loader />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
        <p className="text-slate-600">Here's an overview of your pets and appointment requests.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card flex items-center gap-4">
          <div className="rounded-lg bg-teal-50 p-3 text-teal-600"><PawPrint /></div>
          <div>
            <p className="text-sm text-slate-500">Registered pets</p>
            <p className="text-2xl font-bold">{data.totalPets}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="rounded-lg bg-amber-50 p-3 text-amber-600"><CalendarCheck /></div>
          <div>
            <p className="text-sm text-slate-500">Upcoming appointment requests</p>
            <p className="text-2xl font-bold">{data.upcomingCount}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} className="card flex items-center gap-3 transition hover:border-teal-400">
            <Icon size={20} className="text-teal-600" />
            <span className="text-sm font-medium">{label}</span>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Pet summary</h2>
            <Link to="/pets" className="text-sm text-teal-700">View all</Link>
          </div>
          {data.recentPets.length === 0 ? (
            <p className="text-sm text-slate-500">You haven't added any pets yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {data.recentPets.map((pet) => (
                <li key={pet._id} className="flex items-center gap-3 py-3">
                  {imageSrc(pet.image) ? (
                    <img src={imageSrc(pet.image)} alt={pet.name} className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                      <PawPrint size={18} />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium">{pet.name}</p>
                    <p className="text-xs text-slate-500">
                      {pet.species}{pet.breed ? ` • ${pet.breed}` : ''}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Upcoming appointment requests</h2>
            <Link to="/appointments" className="text-sm text-teal-700">View all</Link>
          </div>
          {data.upcomingAppointments.length === 0 ? (
            <p className="text-sm text-slate-500">No upcoming appointment requests.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {data.upcomingAppointments.map((a) => (
                <li key={a._id} className="py-3 text-sm">
                  <p className="font-medium">{a.pet?.name} with {a.vet?.name}</p>
                  <p className="text-xs text-slate-500">
                    {formatDate(a.date)} at {a.timeSlot} • Pending clinic confirmation
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}