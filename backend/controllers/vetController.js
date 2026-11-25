import Vet from '../models/Vet.js';
import Appointment from '../models/Appointment.js';
import asyncHandler from '../utils/asyncHandler.js';
import escapeRegex from '../utils/escapeRegex.js';
import { isValidDateString, weekdayOf, isPastSlot, slotToMinutes } from '../utils/dateUtils.js';

export const getVets = asyncHandler(async (req, res) => {
  const { search, specialization, city } = req.query;
  const filter = {};

  if (search && search.trim()) filter.name = new RegExp(escapeRegex(search.trim()), 'i');
  if (specialization) filter.specialization = specialization;
  if (city) filter.city = new RegExp(`^${escapeRegex(city.trim())}$`, 'i');

  res.json(await Vet.find(filter).sort({ name: 1 }));
});

export const getVetFilters = asyncHandler(async (req, res) => {
  const [specializations, cities] = await Promise.all([
    Vet.distinct('specialization'),
    Vet.distinct('city'),
  ]);
  res.json({ specializations: specializations.sort(), cities: cities.sort() });
});

export const getVetById = asyncHandler(async (req, res) => {
  const vet = await Vet.findById(req.params.id);
  if (!vet) {
    res.status(404);
    throw new Error('Veterinarian not found');
  }
  res.json(vet);
});

export const getVetSlots = asyncHandler(async (req, res) => {
  const { date } = req.query;
  if (!isValidDateString(date)) {
    res.status(400);
    throw new Error('A valid date (YYYY-MM-DD) is required');
  }

  const vet = await Vet.findById(req.params.id);
  if (!vet) {
    res.status(404);
    throw new Error('Veterinarian not found');
  }

  const weekday = weekdayOf(date);
  if (!vet.availableDays.includes(weekday)) {
    return res.json({
      date,
      available: false,
      message: `${vet.name} does not take appointments on ${weekday}.`,
      slots: [],
    });
  }

  const booked = await Appointment.find({ vet: vet._id, date, status: 'Pending' }).select('timeSlot');
  const bookedSet = new Set(booked.map((a) => a.timeSlot));

  const slots = [...vet.slots]
    .sort((a, b) => slotToMinutes(a) - slotToMinutes(b))
    .map((time) => ({ time, available: !bookedSet.has(time) && !isPastSlot(date, time) }));

  res.json({ date, available: true, slots });
});