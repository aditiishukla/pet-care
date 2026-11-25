import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import api, { getErrorMessage } from '../services/api.js';
import Alert from '../components/Alert.jsx';
import Loader from '../components/Loader.jsx';
import { imageSrc } from '../utils/helpers.js';

const SPECIES = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Other'];
const GENDERS = ['Male', 'Female', 'Unknown'];
const emptyForm = { name: '', species: 'Dog', breed: '', age: '', gender: 'Unknown', weight: '', medicalHistory: '' };

export default function PetFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [vaccinations, setVaccinations] = useState([]);
  const [currentImage, setCurrentImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [removeImage, setRemoveImage] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    api
      .get(`/pets/${id}`)
      .then(({ data }) => {
        setForm({
          name: data.name || '',
          species: data.species || 'Dog',
          breed: data.breed || '',
          age: data.age ?? '',
          gender: data.gender || 'Unknown',
          weight: data.weight ?? '',
          medicalHistory: data.medicalHistory || '',
        });
        setVaccinations(
          (data.vaccinations || []).map((v) => ({ name: v.name, date: v.date ? v.date.slice(0, 10) : '' }))
        );
        setCurrentImage(data.image || '');
      })
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const filePreview = useMemo(() => (imageFile ? URL.createObjectURL(imageFile) : null), [imageFile]);
  const preview = filePreview || imageUrl.trim() || (!removeImage ? imageSrc(currentImage) : null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const updateVaccination = (index, field, value) =>
    setVaccinations((list) => list.map((v, i) => (i === index ? { ...v, [field]: value } : v)));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const body = new FormData();
    Object.entries(form).forEach(([key, value]) => body.append(key, value));
    body.append('vaccinations', JSON.stringify(vaccinations.filter((v) => v.name.trim())));

    if (imageFile) body.append('image', imageFile);
    else if (imageUrl.trim()) body.append('imageUrl', imageUrl.trim());
    else if (removeImage) body.append('removeImage', 'true');

    try {
      if (isEdit) await api.put(`/pets/${id}`, body);
      else await api.post('/pets', body);
      navigate('/pets');
    } catch (err) {
      setError(getErrorMessage(err));
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="card space-y-5">
        <h1 className="text-2xl font-bold">{isEdit ? 'Edit pet' : 'Add a new pet'}</h1>
        {error && <Alert type="error">{error}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="name">Name *</label>
              <input id="name" name="name" required className="input" value={form.name} onChange={handleChange} />
            </div>
            <div>
              <label className="label" htmlFor="species">Species *</label>
              <select id="species" name="species" className="input" value={form.species} onChange={handleChange}>
                {SPECIES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="breed">Breed</label>
              <input id="breed" name="breed" className="input" value={form.breed} onChange={handleChange} />
            </div>
            <div>
              <label className="label" htmlFor="gender">Gender</label>
              <select id="gender" name="gender" className="input" value={form.gender} onChange={handleChange}>
                {GENDERS.map((g) => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="age">Age (years)</label>
              <input id="age" name="age" type="number" min="0" max="40" step="0.1" className="input" value={form.age} onChange={handleChange} />
            </div>
            <div>
              <label className="label" htmlFor="weight">Weight (kg)</label>
              <input id="weight" name="weight" type="number" min="0" step="0.1" className="input" value={form.weight} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="medicalHistory">Medical history</label>
            <textarea id="medicalHistory" name="medicalHistory" rows="3" className="input" value={form.medicalHistory} onChange={handleChange} />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="label mb-0">Vaccination details</span>
              <button type="button" className="btn-secondary" onClick={() => setVaccinations((l) => [...l, { name: '', date: '' }])}>
                <Plus size={14} /> Add
              </button>
            </div>
            {vaccinations.length === 0 && <p className="text-sm text-slate-500">No vaccinations added.</p>}
            <div className="space-y-2">
              {vaccinations.map((v, i) => (
                <div key={i} className="flex gap-2">
                  <input placeholder="Vaccine name" className="input" value={v.name} onChange={(e) => updateVaccination(i, 'name', e.target.value)} />
                  <input type="date" className="input max-w-44" value={v.date} onChange={(e) => updateVaccination(i, 'date', e.target.value)} />
                  <button type="button" className="btn-danger px-3" onClick={() => setVaccinations((l) => l.filter((_, idx) => idx !== i))} aria-label="Remove vaccination">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <span className="label mb-0">Pet image</span>
            {preview && (
              <div className="flex items-center gap-3">
                <img src={preview} alt="Pet preview" className="h-20 w-20 rounded-full object-cover" />
                {(currentImage || imageFile || imageUrl) && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setImageFile(null);
                      setImageUrl('');
                      setRemoveImage(true);
                    }}
                  >
                    Remove image
                  </button>
                )}
              </div>
            )}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="block w-full text-sm"
              onChange={(e) => {
                setImageFile(e.target.files[0] || null);
                setImageUrl('');
                setRemoveImage(false);
              }}
            />
            <input
              type="url"
              placeholder="...or paste an image URL (https://...)"
              className="input"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setImageFile(null);
                setRemoveImage(false);
              }}
            />
            <p className="text-xs text-slate-500">Upload up to 2 MB (JPG, PNG, WEBP, GIF).</p>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Add pet'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => navigate('/pets')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}