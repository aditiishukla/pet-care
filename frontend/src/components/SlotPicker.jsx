import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../services/api.js';
import Loader from './Loader.jsx';
import Alert from './Alert.jsx';

export default function SlotPicker({ vetId, date, value, onChange }) {
  const [state, setState] = useState({ loading: false, data: null, error: '' });

  useEffect(() => {
    if (!vetId || !date) return;
    let ignore = false;
    setState({ loading: true, data: null, error: '' });

    api
      .get(`/vets/${vetId}/slots`, { params: { date } })
      .then(({ data }) => !ignore && setState({ loading: false, data, error: '' }))
      .catch((e) => !ignore && setState({ loading: false, data: null, error: getErrorMessage(e) }));

    return () => {
      ignore = true;
    };
  }, [vetId, date]);

  if (!vetId || !date) return <p className="text-sm text-slate-500">Choose a date to see available time slots.</p>;
  if (state.loading) return <Loader text="Checking slots..." />;
  if (state.error) return <Alert type="error">{state.error}</Alert>;
  if (!state.data) return null;
  if (!state.data.available) return <Alert type="warning">{state.data.message}</Alert>;

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {state.data.slots.map((slot) => {
        const selected = value === slot.time;
        const base = 'rounded-lg border px-3 py-2 text-sm transition';
        const style = !slot.available
          ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 line-through'
          : selected
          ? 'border-teal-600 bg-teal-600 text-white'
          : onChange
          ? 'border-slate-300 bg-white hover:border-teal-500'
          : 'border-slate-300 bg-white';

        return (
          <button
            key={slot.time}
            type="button"
            disabled={!slot.available || !onChange}
            onClick={() => onChange && onChange(slot.time)}
            className={`${base} ${style}`}
          >
            {slot.time}
          </button>
        );
      })}
    </div>
  );
}