import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CalendarCheck, Plus } from 'lucide-react';
import api, { getErrorMessage } from '../services/api.js';
import AppointmentCard from '../components/AppointmentCard.jsx';
import Loader from '../components/Loader.jsx';
import Alert from '../components/Alert.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { compareAppointments, isUpcoming } from '../utils/helpers.js';

export default function Appointments() {
  const location = useLocation();
  const [appointments, setAppointments] = useState([]);
  const [tab, setTab] = useState('upcoming');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    api
      .get('/appointments')
      .then(({ data }) => setAppointments(data))
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (appointment) => {
    if (!window.confirm('Cancel this appointment request?')) return;
    setCancellingId(appointment._id);
    try {
      const { data } = await api.put(`/appointments/${appointment._id}/cancel`);
      setAppointments((list) => list.map((a) => (a._id === data._id ? data : a)));
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setCancellingId(null);
    }
  };

  const upcoming = appointments.filter(isUpcoming).sort(compareAppointments);
  const previous = appointments.filter((a) => !isUpcoming(a)).sort((a, b) => compareAppointments(b, a));
  const list = tab === 'upcoming' ? upcoming : previous;

  const tabClass = (name) =>
    `rounded-lg px-4 py-2 text-sm font-medium ${tab === name ? 'bg-teal-600 text-white' : 'bg-white text-slate-600 border border-slate-300'}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Appointment requests</h1>
        <Link to="/appointments/book" className="btn-primary"><Plus size={16} /> New request</Link>
      </div>

      {location.state?.justBooked && (
        <Alert type="success">Your request was submitted. The clinic still needs to confirm it.</Alert>
      )}
      <Alert type="info">Requests stay "Pending" until the clinic confirms them. Nothing here is a confirmed booking.</Alert>
      {error && <Alert type="error">{error}</Alert>}

      <div className="flex gap-2">
        <button className={tabClass('upcoming')} onClick={() => setTab('upcoming')}>Upcoming ({upcoming.length})</button>
        <button className={tabClass('previous')} onClick={() => setTab('previous')}>Previous ({previous.length})</button>
      </div>

      {loading ? (
        <Loader />
      ) : list.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title={tab === 'upcoming' ? 'No upcoming requests' : 'No previous requests'}
          text={tab === 'upcoming' ? 'Find a veterinarian and request a time slot.' : undefined}
          action={tab === 'upcoming' ? <Link to="/vets" className="btn-primary">Find a vet</Link> : null}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {list.map((a) => (
            <AppointmentCard
              key={a._id}
              appointment={a}
              onCancel={a.status === 'Pending' ? handleCancel : undefined}
              cancelling={cancellingId === a._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}