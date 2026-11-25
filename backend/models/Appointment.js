import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
    vet: { type: mongoose.Schema.Types.ObjectId, ref: 'Vet', required: true },
    date: { type: String, required: true }, // "YYYY-MM-DD"
    timeSlot: { type: String, required: true }, // "10:30 AM"
    reason: { type: String, required: true, trim: true, maxlength: 500 },
    status: { type: String, enum: ['Pending', 'Cancelled'], default: 'Pending' },
  },
  { timestamps: true }
);

// Only one Pending request per vet + date + slot. Cancelled ones free the slot.
appointmentSchema.index(
  { vet: 1, date: 1, timeSlot: 1 },
  { unique: true, partialFilterExpression: { status: 'Pending' } }
);

export default mongoose.model('Appointment', appointmentSchema);