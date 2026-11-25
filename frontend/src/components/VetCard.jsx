import { Link } from 'react-router-dom';
import { Building2, MapPin, IndianRupee, Stethoscope } from 'lucide-react';

export default function VetCard({ vet }) {
  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold">{vet.name}</h3>
          <p className="flex items-center gap-1 text-sm text-teal-700">
            <Stethoscope size={14} /> {vet.specialization}
          </p>
        </div>
        {vet.isSample && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">Sample profile</span>
        )}
      </div>

      <div className="space-y-1 text-sm text-slate-600">
        <p className="flex items-center gap-2"><Building2 size={14} /> {vet.clinicName}</p>
        <p className="flex items-center gap-2"><MapPin size={14} /> {vet.city}</p>
        <p className="flex items-center gap-2"><IndianRupee size={14} /> {vet.consultationFee} consultation</p>
        <p>{vet.experience} years of experience</p>
      </div>

      <div className="mt-auto flex gap-2">
        <Link to={`/vets/${vet._id}`} className="btn-secondary">View profile</Link>
        <Link to={`/appointments/book?vet=${vet._id}`} className="btn-primary">Book</Link>
      </div>
    </div>
  );
}