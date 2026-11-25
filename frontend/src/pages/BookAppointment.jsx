import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { PawPrint } from 'lucide-react';
import api, { getErrorMessage } from '../services/api.js';
import Loader from '../components/Loader.jsx';
import Alert from '../components/Alert.jsx';
import EmptyState from '../components/EmptyState.jsx';
import SlotPicker from '../components/SlotPicker.jsx';
import { todayString } from '../utils/helpers.js';

export default function BookAppointment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [pets, setPets] = useState([]);
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    petId: '',
    vetId: searchParams.get('vet') || '',
    date: '',
    timeSlot: '',
    reason: '',
  });

  useEffect(() => {
    Promise.all([api.get('/pets'), api.get('/vets')])
      .then(([petRes, vetRes]) => {
        setPets(petRes.data);
        setVets(vetRes.data);
        if (petRes.data.length === 1) setForm((f) => ({ ...f, petId: petRes.data[0]._id }));
      })
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  const selectedVet = vets.find((v) => v._id === form.vetId);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Changing vet or date invalidates the chosen time slot
    if (name === 'vetId' || name === 'date') setForm({ ...form, [name]: value, timeSlot: '' });
    else setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.timeSlot) return setError('Please choose a time slot');

    setSubmitting(true);
    try {
      await api.post('/appointments', form);
      navigate('/appointments', { state: { justBooked: true } });
    } catch (err) {
      setError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  if (pets.length === 0) {
    return (
      <EmptyState
        icon={PawPrint}
        title="Add a pet first"
        text="You need at least one pet profile before requesting an appointment."
        action={<Link to="/pets/new" className="btn-primary">Add a pet</Link>}
      />
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="card space-y-5">
        <h1 className="text-2xl font-bold">Request an appointment</h1>
        <Alert type="info">
          This sends a request to the clinic. It is <strong>not</strong> confirmed until the clinic accepts it.
        </Alert>
        {error && <Alert type="error">{error}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="petId">Pet *</label>
              <select id="petId" name="petId" required className="input" value={form.petId} onChange={handleChange}>
                <option value="">Select a pet</option>
                {pets.map((p) => <option key={p._id} value={p._id}>{p.name} ({p.species})</option>)}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="vetId">Veterinarian *</label>
              <select id="vetId" name="vetId" required className="input" value={form.vetId} onChange={handleChange}>
                <option value="">Select a veterinarian</option>
                {vets.map((v) => <option key={v._id} value={v._id}>{v.name} - {v.city}</option>)}
              </select>
            </div>
          </div>

          {selectedVet && (
            <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
              {selectedVet.clinicName} • {selectedVet.specialization} • Fee: {selectedVet.consultationFee} • Days: {selectedVet.availableDays.join(', ')}
            </div>
          )}

          <div>
            <label className="label" htmlFor="date">Date *</label>
            <input id="date" name="date" type="date" required min={todayString()} className="input max-w-xs" value={form.date} onChange={handleChange} />
          </div>

          <div>
            <span className="label">Time slot *</span>
            <SlotPicker
              vetId={form.vetId}
              date={form.date}
              value={form.timeSlot}
              onChange={(time) => setForm((f) => ({ ...f, timeSlot: time }))}
            />
          </div>

          <div>
            <label className="label" htmlFor="reason">Reason for consultation *</label>
            <textarea id="reason" name="reason" rows="3" required maxLength={500} className="input" value={form.reason} onChange={handleChange} />
          </div>

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit request'}
          </button>
        </form>
      </div>
    </div>
  );
}