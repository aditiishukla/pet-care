import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, Plus } from 'lucide-react';
import api, { getErrorMessage } from '../services/api.js';
import PetCard from '../components/PetCard.jsx';
import Loader from '../components/Loader.jsx';
import Alert from '../components/Alert.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Pets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/pets')
      .then(({ data }) => setPets(data))
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (pet) => {
    if (!window.confirm(`Delete ${pet.name}? Their appointment requests will also be removed.`)) return;
    try {
      await api.delete(`/pets/${pet._id}`);
      setPets((list) => list.filter((p) => p._id !== pet._id));
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">My pets</h1>
        <Link to="/pets/new" className="btn-primary"><Plus size={16} /> Add pet</Link>
      </div>

      {error && <Alert type="error">{error}</Alert>}
      {loading ? (
        <Loader />
      ) : pets.length === 0 ? (
        <EmptyState
          icon={PawPrint}
          title="No pets yet"
          text="Add your first pet to start tracking health details and booking appointments."
          action={<Link to="/pets/new" className="btn-primary">Add a pet</Link>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => (
            <PetCard key={pet._id} pet={pet} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}