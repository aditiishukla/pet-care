import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, Pencil, Trash2 } from 'lucide-react';
import { imageSrc, formatDate } from '../utils/helpers.js';

export default function PetCard({ pet, onDelete }) {
  const [open, setOpen] = useState(false);
  const img = imageSrc(pet.image);

  return (
    <div className="card flex flex-col gap-4">
      <div className="flex items-center gap-4">
        {img ? (
          <img src={img} alt={pet.name} className="h-16 w-16 rounded-full object-cover" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-teal-600">
            <PawPrint />
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold">{pet.name}</h3>
          <p className="text-sm text-slate-500">
            {pet.species}
            {pet.breed ? ` • ${pet.breed}` : ''}
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-3 gap-2 text-center text-sm">
        <div className="rounded-lg bg-slate-50 p-2">
          <dt className="text-xs text-slate-500">Age</dt>
          <dd className="font-medium">{pet.age != null ? `${pet.age} yr` : '-'}</dd>
        </div>
        <div className="rounded-lg bg-slate-50 p-2">
          <dt className="text-xs text-slate-500">Gender</dt>
          <dd className="font-medium">{pet.gender}</dd>
        </div>
        <div className="rounded-lg bg-slate-50 p-2">
          <dt className="text-xs text-slate-500">Weight</dt>
          <dd className="font-medium">{pet.weight != null ? `${pet.weight} kg` : '-'}</dd>
        </div>
      </dl>

      {open && (
        <div className="space-y-3 text-sm">
          <div>
            <h4 className="font-medium">Medical history</h4>
            <p className="text-slate-600">{pet.medicalHistory || 'No medical history added.'}</p>
          </div>
          <div>
            <h4 className="font-medium">Vaccinations</h4>
            {pet.vaccinations?.length ? (
              <ul className="list-disc pl-5 text-slate-600">
                {pet.vaccinations.map((v, i) => (
                  <li key={i}>
                    {v.name}
                    {v.date ? ` - ${formatDate(v.date.slice(0, 10))}` : ''}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-600">No vaccinations recorded.</p>
            )}
          </div>
        </div>
      )}

      <div className="mt-auto flex flex-wrap gap-2">
        <button className="btn-secondary" onClick={() => setOpen((o) => !o)}>
          {open ? 'Hide details' : 'View details'}
        </button>
        {onDelete && (
          <>
            <Link to={`/pets/${pet._id}/edit`} className="btn-secondary">
              <Pencil size={14} /> Edit
            </Link>
            <button className="btn-danger" onClick={() => onDelete(pet)}>
              <Trash2 size={14} /> Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}