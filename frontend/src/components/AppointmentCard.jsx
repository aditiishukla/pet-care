import { CalendarDays, Clock, Building2 } from 'lucide-react';
import { formatDate } from '../utils/helpers.js';

const statusStyle = {
  Pending: 'bg-amber-100 text-amber-800',
  Cancelled: 'bg-red-100 text-red-700',
};

const statusLabel = {
  Pending: 'Pending - awaiting clinic confirmation',
  Cancelled: 'Cancelled',
};

export default function AppointmentCard({ appointment, onCancel, cancelling }) {
  const { pet, vet, date, timeSlot, reason, status } = appointment;

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold">
            {pet?.name || 'Pet'} with {vet?.name || 'Veterinarian'}
          </h3>
          <p className="text-sm text-slate-500">{vet?.specialization}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle[status]}`}>
          {statusLabel[status]}
        </span>
      </div>

      <div className="grid gap-1 text-sm text-slate-600 sm:grid-cols-2">
        <p className="flex items-center gap-2"><CalendarDays size={14} /> {formatDate(date)}</p>
        <p className="flex items-center gap-2"><Clock size={14} /> {timeSlot}</p>
        <p className="flex items-center gap-2 sm:col-span-2">
          <Building2 size={14} /> {vet?.clinicName}, {vet?.city}
        </p>
      </div>

      <p className="text-sm"><span className="font-medium">Reason:</span> {reason}</p>

      {onCancel && (
        <div>
          <button className="btn-danger" disabled={cancelling} onClick={() => onCancel(appointment)}>
            {cancelling ? 'Cancelling...' : 'Cancel request'}
          </button>
        </div>
      )}
    </div>
  );
}