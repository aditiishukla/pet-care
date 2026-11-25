const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const USER_AGENT = 'PetCareApp/1.0 (student project)';

export const findNearbyClinics = async (lat, lng, radius = 5000) => {
  const around = `(around:${radius},${lat},${lng})`;
  const query = `[out:json][timeout:25];(
    node["amenity"="veterinary"]${around};
    way["amenity"="veterinary"]${around};
    relation["amenity"="veterinary"]${around};
  );out center 60;`;

  const response = await fetch(OVERPASS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': USER_AGENT },
    body: new URLSearchParams({ data: query }),
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) throw new Error('The clinic search service is busy right now. Please try again shortly.');

  const data = await response.json();

  return data.elements
    .map((el) => {
      const tags = el.tags || {};
      const address = [
        [tags['addr:housenumber'], tags['addr:street']].filter(Boolean).join(' '),
        tags['addr:suburb'],
        tags['addr:city'],
      ]
        .filter(Boolean)
        .join(', ');

      return {
        id: `${el.type}-${el.id}`,
        name: tags.name || 'Unnamed veterinary clinic',
        lat: el.lat ?? el.center?.lat,
        lng: el.lon ?? el.center?.lon,
        address,
        phone: tags.phone || tags['contact:phone'] || '',
        website: tags.website || tags['contact:website'] || '',
        openingHours: tags.opening_hours || '',
        source: 'OpenStreetMap',
      };
    })
    .filter((c) => c.lat !== undefined && c.lng !== undefined);
};

export const geocodeLocation = async (query) => {
  const url = `${NOMINATIM_URL}?${new URLSearchParams({ q: query, format: 'json', limit: '1' })}`;

  const response = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) throw new Error('Location search is unavailable right now. Please try again shortly.');

  const results = await response.json();
  if (!results.length) return null;

  return {
    lat: Number(results[0].lat),
    lng: Number(results[0].lon),
    displayName: results[0].display_name,
  };
};