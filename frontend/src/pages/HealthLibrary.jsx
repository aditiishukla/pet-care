import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search } from 'lucide-react';
import api, { getErrorMessage } from '../services/api.js';
import Loader from '../components/Loader.jsx';
import Alert from '../components/Alert.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function HealthLibrary() {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [q, setQ] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/health/categories').then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/health', { params: { q, category } });
        setArticles(data);
        setError('');
      } catch (e) {
        setError(getErrorMessage(e));
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [q, category]);

  const chip = (active) =>
    `rounded-full px-3 py-1 text-sm ${active ? 'bg-teal-600 text-white' : 'border border-slate-300 bg-white text-slate-600'}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pet health library</h1>
        <p className="text-sm text-slate-500">Educational information only. It is not a diagnosis.</p>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
        <input className="input pl-9" placeholder="Search topics or symptoms" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="flex flex-wrap gap-2">
        <button className={chip(category === '')} onClick={() => setCategory('')}>All</button>
        {categories.map((c) => (
          <button key={c} className={chip(category === c)} onClick={() => setCategory(c)}>{c}</button>
        ))}
      </div>

      {error && <Alert type="error">{error}</Alert>}
      {loading ? (
        <Loader />
      ) : articles.length === 0 ? (
        <EmptyState icon={BookOpen} title="No articles found" text="Try a different search or category." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <Link key={a._id} to={`/health/${a._id}`} className="card flex flex-col gap-2 transition hover:border-teal-400">
              <span className="w-fit rounded-full bg-teal-50 px-2 py-0.5 text-xs text-teal-700">{a.category}</span>
              <h3 className="font-semibold">{a.title}</h3>
              <p className="text-sm text-slate-600">{a.summary}</p>
              <p className="mt-auto text-xs text-slate-400">For: {a.species.join(', ')}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}