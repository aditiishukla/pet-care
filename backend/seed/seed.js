import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Vet from '../models/Vet.js';
import HealthArticle from '../models/HealthArticle.js';
import Appointment from '../models/Appointment.js';
import vets from './vets.js';
import healthArticles from './healthArticles.js';

const run = async () => {
  await connectDB();

  // Appointments point at vet IDs, which change on re-seed, so clear them too
  await Appointment.deleteMany();
  await Vet.deleteMany();
  await HealthArticle.deleteMany();

  await Vet.insertMany(vets);
  await HealthArticle.insertMany(healthArticles);

  console.log(`Seeded ${vets.length} veterinarians and ${healthArticles.length} health articles`);
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});