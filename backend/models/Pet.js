import mongoose from 'mongoose';

const vaccinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    date: { type: Date },
  },
  { _id: false }
);

const petSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: [true, 'Pet name is required'], trim: true, maxlength: 50 },
    species: {
      type: String,
      required: [true, 'Species is required'],
      enum: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Other'],
    },
    breed: { type: String, trim: true },
    age: { type: Number, min: [0, 'Age cannot be negative'], max: [40, 'Age looks too high'] }, // years
    gender: { type: String, enum: ['Male', 'Female', 'Unknown'], default: 'Unknown' },
    weight: { type: Number, min: [0, 'Weight cannot be negative'] }, // kg
    medicalHistory: { type: String, trim: true, maxlength: 2000 },
    vaccinations: { type: [vaccinationSchema], default: [] },
    image: { type: String, default: '' }, // "/uploads/xyz.jpg" or an http(s) URL
  },
  { timestamps: true }
);

export default mongoose.model('Pet', petSchema);