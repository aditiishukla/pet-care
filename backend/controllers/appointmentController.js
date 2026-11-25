import Appointment from '../models/Appointment.js';
import Pet from '../models/Pet.js';
import Vet from '../models/Vet.js';
import asyncHandler from '../utils/asyncHandler.js';
import { todayString, isValidDateString, weekdayOf, isPastSlot } from '../utils/dateUtils.js';

const populateFields = [
  { path: 'pet', select: 'name species image' },
  { path: 'vet', select: 'name clinicName specialization city address consultationFee' },
];

export const createAppointment = asyncHandler(async (req, res) => {
  const { petId, vetId, date, timeSlot, reason } = req.body;

  if (!petId || !vetId || !date || !timeSlot || !reason || !reason.trim()) {
    res.status(400);
    throw new Error('Pet, veterinarian, date, time slot and reason are required');
  }
  if (!isValidDateString(date)) {
    res.status(400);
    throw new Error('Invalid date');
  }
  if (date < todayString()) {
    res.status(400);
    throw new Error('Please choose today or a future date');
  }

  const pet = await Pet.findOne({ _id: petId, owner: req.user._id });
  if (!pet) {
    res.status(404);
    throw new Error('Pet not found');
  }

  const vet = await Vet.findById(vetId);
  if (!vet) {
    res.status(404);
    throw new Error('Veterinarian not found');
  }

  if (!vet.availableDays.includes(weekdayOf(date))) {
    res.status(400);
    throw new Error('The veterinarian is not available on that day');
  }
  if (!vet.slots.includes(timeSlot)) {
    res.status(400);
    throw new Error('Invalid time slot');
  }
  if (isPastSlot(date, timeSlot)) {
    res.status(400);
    throw new Error('That time has already passed');
  }

  const taken = await Appointment.findOne({ vet: vet._id, date, timeSlot, status: 'Pending' });
  if (taken) {
    res.status(409);
    throw new Error('That time slot is already requested. Please choose another.');
  }

  const appointment = await Appointment.create({
    user: req.user._id,
    pet: pet._id,
    vet: vet._id,
    date,
    timeSlot,
    reason: reason.trim(),
  });

  await appointment.populate(populateFields);
  res.status(201).json(appointment);
});

export const getMyAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ user: req.user._id })
    .populate(populateFields)
    .sort({ date: 1 });
  res.json(appointments);
});

export const cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findOne({ _id: req.params.id, user: req.user._id });
  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }
  if (appointment.status === 'Cancelled') {
    res.status(400);
    throw new Error('Appointment is already cancelled');
  }

  appointment.status = 'Cancelled';
  await appointment.save();
  await appointment.populate(populateFields);
  res.json(appointment);
});