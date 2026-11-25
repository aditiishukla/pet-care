import { SERVER_URL } from '../services/api.js';

export const imageSrc = (path) => {
  if (!path) return null;
  return path.startsWith('http') ? path : `${SERVER_URL}${path}`;
};

const pad = (n) => String(n).padStart(2, '0');

export const todayString = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const formatDate = (dateStr) =>
  new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

export const slotToMinutes = (slot) => {
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(String(slot).trim());
  if (!m) return 0;
  let hours = Number(m[1]) % 12;
  if (m[3].toUpperCase() === 'PM') hours += 12;
  return hours * 60 + Number(m[2]);
};

export const compareAppointments = (a, b) =>
  a.date.localeCompare(b.date) || slotToMinutes(a.timeSlot) - slotToMinutes(b.timeSlot);

export const isUpcoming = (appointment) =>
  appointment.status === 'Pending' && appointment.date >= todayString();