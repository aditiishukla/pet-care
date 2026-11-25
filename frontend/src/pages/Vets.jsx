import { useEffect, useState } from 'react';
import { Search, Stethoscope } from 'lucide-react';
import api, { getErrorMessage } from '../services/api.js';
import VetCard from '../components/VetCard.jsx';
import Loader from '../components/Loader.jsx';
import Alert from '../components/Alert.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Vets() {
  const [filters, setFilters] = useState({ specializations: [], cities: [] });
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [city, setCity] = useState('');
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/vets/filters').then(({ data }) => setFilters(data)).catch(() => {});
  }, []);

  // Debounced search so we don't call the API on every keystroke
  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/vets', { params: { search, specialization, city } });
        setVets(data);
        setError('');
      } catch (e) {
        setError(getErrorMessage(e));
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search, specialization, city]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Veterinarian directory</h1>
        <p className="text-sm text-slate-500">Profiles shown here are sample records for demonstration.</p>
      </div>

      <div className="card grid gap-3 sm:grid-cols-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            className="input pl-9"
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="input" value={specialization} onChange={(e) => setSpecialization(e.target.value)}>
          <option value="">All specializations</option>
          {filters.specializations.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select className="input" value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="">All cities</option>
          {filters.cities.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {error && <Alert type="error">{error}</Alert>}
      {loading ? (
        <Loader />
      ) : vets.length === 0 ? (
        <EmptyState icon={Stethoscope} title="No veterinarians found" text="Try changing your search or filters." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vets.map((vet) => <VetCard key={vet._id} vet={vet} />)}
        </div>
      )}
    </div>
  );
}