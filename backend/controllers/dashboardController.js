import Pet from '../models/Pet.js';
import Appointment from '../models/Appointment.js';
import asyncHandler from '../utils/asyncHandler.js';
import { todayString, slotToMinutes } from '../utils/dateUtils.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [totalPets, recentPets, upcoming] = await Promise.all([
    Pet.countDocuments({ owner: userId }),
    Pet.find({ owner: userId }).sort({ createdAt: -1 }).limit(4),
    Appointment.find({ user: userId, status: 'Pending', date: { $gte: todayString() } })
      .populate('pet', 'name species image')
      .populate('vet', 'name clinicName city'),
  ]);

  upcoming.sort(
    (a, b) =>
      a.date.localeCompare(b.date) || slotToMinutes(a.timeSlot) - slotToMinutes(b.timeSlot)
  );

  res.json({
    totalPets,
    upcomingCount: upcoming.length,
    recentPets,
    upcomingAppointments: upcoming.slice(0, 5),
  });
});