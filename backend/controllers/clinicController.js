import asyncHandler from '../utils/asyncHandler.js';
import { findNearbyClinics, geocodeLocation } from '../services/overpassService.js';

export const getNearbyClinics = asyncHandler(async (req, res) => {
  if (req.query.lat == null || req.query.lng == null) {
    res.status(400);
    throw new Error('Latitude and longitude are required');
  }

  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  const radius = Math.min(Math.max(Number(req.query.radius) || 5000, 500), 20000);

  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    res.status(400);
    throw new Error('Invalid coordinates');
  }

  try {
    const clinics = await findNearbyClinics(lat, lng, radius);
    res.json({ count: clinics.length, clinics });
  } catch (err) {
    res.status(502);
    throw new Error(err.message || 'Could not load clinics');
  }
});

export const geocode = asyncHandler(async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) {
    res.status(400);
    throw new Error('Please enter a city or location');
  }

  let result;
  try {
    result = await geocodeLocation(q);
  } catch (err) {
    res.status(502);
    throw new Error(err.message);
  }

  if (!result) {
    res.status(404);
    throw new Error('Location not found. Try a different city name.');
  }
  res.json(result);
});