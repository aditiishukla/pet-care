import mongoose from 'mongoose';

const vetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    specialization: { type: String, required: true, trim: true },
    clinicName: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    experience: { type: Number, required: true, min: 0 }, // years
    consultationFee: { type: Number, required: true, min: 0 },
    about: { type: String, trim: true },
    availableDays: {
      type: [String],
      enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      default: [],
    },
    slots: { type: [String], default: [] }, // e.g. "10:30 AM"
    isSample: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Vet', vetSchema);