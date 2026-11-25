import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { LocateFixed, Search, MapPin, Phone, Clock } from 'lucide-react';
import api, { getErrorMessage } from '../services/api.js';
import Alert from '../components/Alert.jsx';

// Vite needs explicit imports for Leaflet's default marker images
const clinicIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapController({ center, selected }) {
  const map = useMap();

  useEffect(() => {
    if (center) map.setView(center, 13);
  }, [center, map]);

  useEffect(() => {
    if (selected) map.flyTo([selected.lat, selected.lng], 17);
  }, [selected, map]);

  return null;
}

export default function NearbyClinics() {
  const [center, setCenter] = useState(null);
  const [label, setLabel] = useState('');
  const [clinics, setClinics] = useState([]);
  const [selected, setSelected] = useState(null);
  const [radius, setRadius] = useState(5000);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const loadClinics = async (lat, lng, placeLabel, searchRadius = radius) => {
    setLoading(true);
    setError('');
    setSelected(null);
    try {
      const { data } = await api.get('/clinics/nearby', { params: { lat, lng, radius: searchRadius } });
      setCenter([lat, lng]);
      setLabel(placeLabel);
      setClinics(data.clinics);
      setSearched(true);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return setError('Geolocation is not supported by your browser.');
    setLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => loadClinics(pos.coords.latitude, pos.coords.longitude, 'your location'),
      () => {
        setLoading(false);
        setError('Could not get your location. Allow location access, or search by city instead.');
      },
      { timeout: 10000 }
    );
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/clinics/geocode', { params: { q: query } });
      await loadClinics(data.lat, data.lng, data.displayName);
    } catch (err) {
      setError(getErrorMessage(err));
      setLoading(false);
    }
  };

  const handleRadiusChange = (e) => {
    const value = Number(e.target.value);
    setRadius(value);
    if (center) loadClinics(center[0], center[1], label, value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Nearby veterinary clinics</h1>
        <p className="text-sm text-slate-500">Map data from OpenStreetMap contributors.</p>
      </div>

      <div className="card flex flex-col gap-3 lg:flex-row lg:items-center">
        <button className="btn-primary" onClick={handleUseMyLocation} disabled={loading}>
          <LocateFixed size={16} /> Use my location
        </button>
        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
          <input className="input" placeholder="Or enter a city / area (e.g. Ludhiana)" value={query} onChange={(e) => setQuery(e.target.value)} />
          <button type="submit" className="btn-secondary" disabled={loading}><Search size={16} /> Search</button>
        </form>
        <select className="input lg:max-w-36" value={radius} onChange={handleRadiusChange}>
          <option value={2000}>Within 2 km</option>
          <option value={5000}>Within 5 km</option>
          <option value={10000}>Within 10 km</option>
          <option value={20000}>Within 20 km</option>
        </select>
      </div>

      {error && <Alert type="error">{error}</Alert>}
      {loading && <p className="text-sm text-slate-500">Searching for clinics...</p>}
      {searched && !loading && (
        <Alert type="warning">
          Showing {clinics.length} listing(s) near {label}. These come from OpenStreetMap and are <strong>not verified clinics</strong>.
          Call ahead to confirm details.
        </Alert>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="isolate overflow-hidden rounded-xl border border-slate-200 lg:col-span-2">
          <MapContainer center={[20.5937, 78.9629]} zoom={5} className="h-[480px] w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapController center={center} selected={selected} />
            {center && (
              <CircleMarker center={center} radius={9} pathOptions={{ color: '#0d9488', fillOpacity: 0.7 }}>
                <Popup>Search center</Popup>
              </CircleMarker>
            )}
            {clinics.map((c) => (
              <Marker key={c.id} position={[c.lat, c.lng]} icon={clinicIcon}>
                <Popup>
                  <strong>{c.name}</strong>
                  {c.address && <div>{c.address}</div>}
                  {c.phone && <div>{c.phone}</div>}
                  <div className="text-xs text-slate-500">External listing (unverified)</div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="max-h-[480px] space-y-2 overflow-y-auto">
          {searched && clinics.length === 0 && !loading && (
            <p className="text-sm text-slate-500">No clinics found in this radius. Try a larger radius.</p>
          )}
          {clinics.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(c)}
              className={`card w-full text-left transition hover:border-teal-400 ${selected?.id === c.id ? 'border-teal-500' : ''}`}
            >
              <p className="font-medium">{c.name}</p>
              {c.address && <p className="mt-1 flex items-start gap-1 text-xs text-slate-500"><MapPin size={12} className="mt-0.5 shrink-0" /> {c.address}</p>}
              {c.phone && <p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><Phone size={12} /> {c.phone}</p>}
              {c.openingHours && <p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><Clock size={12} /> {c.openingHours}</p>}
              <span className="mt-2 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">OpenStreetMap listing</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}