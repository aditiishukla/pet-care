import mongoose from 'mongoose';

const healthArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['Common Conditions', 'Preventive Care', 'Vaccination', 'Hygiene', 'Nutrition', 'Emergency'],
    },
    species: { type: [String], default: ['Dog', 'Cat'] },
    summary: { type: String, required: true },
    symptoms: [String],
    causes: [String],
    preventiveCare: [String],
    warningSigns: [String],
  },
  { timestamps: true }
);

export default mongoose.model('HealthArticle', healthArticleSchema);