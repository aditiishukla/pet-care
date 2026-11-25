import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api.js';
import Loader from '../components/Loader.jsx';
import Alert from '../components/Alert.jsx';

function Section({ title, items, tone = '' }) {
  if (!items?.length) return null;
  return (
    <section className={`card ${tone}`}>
      <h2 className="mb-2 font-semibold">{title}</h2>
      <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </section>
  );
}

export default function HealthArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/health/${id}`)
      .then(({ data }) => setArticle(data))
      .catch((e) => setError(getErrorMessage(e)));
  }, [id]);

  if (error) return <Alert type="error">{error}</Alert>;
  if (!article) return <Loader />;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Link to="/health" className="text-sm text-teal-700">&larr; Back to library</Link>

      <div>
        <span className="rounded-full bg-teal-50 px-2 py-0.5 text-xs text-teal-700">{article.category}</span>
        <h1 className="mt-2 text-2xl font-bold">{article.title}</h1>
        <p className="mt-1 text-slate-600">{article.summary}</p>
      </div>

      <Section title="Common symptoms" items={article.symptoms} />
      <Section title="Possible causes" items={article.causes} />
      <Section title="Preventive care" items={article.preventiveCare} />
      <Section title="Warning signs - see a vet" items={article.warningSigns} tone="border-red-200 bg-red-50" />

      <Alert type="info">This information is educational and does not replace a veterinarian's advice.</Alert>
    </div>
  );
}