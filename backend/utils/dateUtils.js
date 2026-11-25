const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const pad = (n) => String(n).padStart(2, '0');

export const todayString = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const isValidDateString = (s) =>
  typeof s === 'string' &&
  /^\d{4}-\d{2}-\d{2}$/.test(s) &&
  !Number.isNaN(new Date(`${s}T00:00:00`).getTime());

export const weekdayOf = (s) => DAYS[new Date(`${s}T00:00:00`).getDay()];

// "09:30 AM" -> minutes since midnight
export const slotToMinutes = (slot) => {
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(String(slot).trim());
  if (!m) return null;
  let hours = Number(m[1]) % 12;
  if (m[3].toUpperCase() === 'PM') hours += 12;
  return hours * 60 + Number(m[2]);
};

// True if the slot is today and its time has already passed
export const isPastSlot = (dateStr, slot) => {
  if (dateStr !== todayString()) return false;
  const now = new Date();
  const minutes = slotToMinutes(slot);
  return minutes !== null && minutes <= now.getHours() * 60 + now.getMinutes();
};