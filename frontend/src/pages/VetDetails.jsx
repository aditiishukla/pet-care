import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Building2, MapPin, IndianRupee, Stethoscope, Award } from 'lucide-react';
import api, { getErrorMessage } from '../services/api.js';
import Loader from '../components/Loader.jsx';
import Alert from '../components/Alert.jsx';
import SlotPicker from '../components/SlotPicker.jsx';
import { todayString } from '../utils/helpers.js';

export default function VetDetails() {
  const { id } = useParams();
  const [vet, setVet] = useState(null);
  const [error, setError] = useState('');
  const [date, setDate] = useState(todayString());

  useEffect(() => {
    api
      .get(`/vets/${id}`)
      .then(({ data }) => setVet(data))
      .catch((e) => setError(getErrorMessage(e)));
  }, [id]);

  if (error) return <Alert type="error">{error}</Alert>;
  if (!vet) return <Loader />;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/vets" className="text-sm text-teal-700">&larr; Back to directory</Link>

      <div className="card space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold">{vet.name}</h1>
            <p className="flex items-center gap-1 text-teal-700"><Stethoscope size={16} /> {vet.specialization}</p>
          </div>
          {vet.isSample && <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">Sample profile</span>}
        </div>

        {vet.about && <p className="text-slate-600">{vet.about}</p>}

        <div className="grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
          <p className="flex items-center gap-2"><Building2 size={16} /> {vet.clinicName}</p>
          <p className="flex items-center gap-2"><MapPin size={16} /> {vet.address}, {vet.city}</p>
          <p className="flex items-center gap-2"><Award size={16} /> {vet.experience} years of experience</p>
          <p className="flex items-center gap-2"><IndianRupee size={16} /> {vet.consultationFee} consultation fee</p>
        </div>

        <p className="text-sm"><span className="font-medium">Available days:</span> {vet.availableDays.join(', ')}</p>
      </div>

      <div className="card space-y-4">
        <h2 className="font-semibold">Available appointment slots</h2>
        <input type="date" min={todayString()} className="input max-w-xs" value={date} onChange={(e) => setDate(e.target.value)} />
        <SlotPicker vetId={vet._id} date={date} />
        <Link to={`/appointments/book?vet=${vet._id}`} className="btn-primary">Request an appointment</Link>
      </div>
    </div>
  );
}