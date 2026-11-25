import { Link } from 'react-router-dom';
import { PawPrint, Stethoscope, CalendarCheck, MapPin, BookOpen } from 'lucide-react';
import useAuth from '../hooks/useAuth.js';

const features = [
  { icon: PawPrint, title: 'Pet profiles', text: 'Keep health records, weight and vaccinations for all your pets in one place.' },
  { icon: Stethoscope, title: 'Vet directory', text: 'Search veterinarians by name, specialization and city.' },
  { icon: CalendarCheck, title: 'Appointment requests', text: 'Request a slot and track it from your dashboard.' },
  { icon: MapPin, title: 'Nearby clinics', text: 'Find veterinary clinics around you on an interactive map.' },
  { icon: BookOpen, title: 'Health library', text: 'Learn symptoms, prevention and when to see a vet.' },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="space-y-12">
      <section className="rounded-2xl bg-gradient-to-br from-teal-600 to-teal-800 px-6 py-14 text-center text-white">
        <PawPrint className="mx-auto mb-4" size={40} />
        <h1 className="text-3xl font-bold sm:text-4xl">Healthcare management for your pets</h1>
        <p className="mx-auto mt-3 max-w-xl text-teal-50">
          Manage pet profiles, explore veterinarians, request appointments and learn pet care basics.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          {user ? (
            <Link to="/dashboard" className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-teal-700 hover:bg-teal-50">
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link to="/register" className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-teal-700 hover:bg-teal-50">
                Get started
              </Link>
              <Link to="/login" className="rounded-lg border border-white/60 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10">
                Login
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, title, text }) => (
          <div key={title} className="card">
            <div className="mb-3 inline-flex rounded-lg bg-teal-50 p-2 text-teal-600">
              <Icon size={22} />
            </div>
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-slate-600">{text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}