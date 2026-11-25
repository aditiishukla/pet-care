import fs from 'fs';
import path from 'path';
import Pet from '../models/Pet.js';
import Appointment from '../models/Appointment.js';
import asyncHandler from '../utils/asyncHandler.js';
import { UPLOAD_DIR } from '../middleware/uploadMiddleware.js';

const FIELDS = ['name', 'species', 'breed', 'age', 'gender', 'weight', 'medicalHistory'];

// Empty strings become undefined so Mongoose treats them as "not provided"
const pickFields = (body) => {
  const data = {};
  FIELDS.forEach((f) => {
    if (body[f] !== undefined) data[f] = body[f] === '' ? undefined : body[f];
  });
  return data;
};

// Vaccinations arrive as a JSON string because the form is multipart
const parseVaccinations = (raw) => {
  if (raw === undefined) return undefined;
  try {
    const list = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!Array.isArray(list)) return [];
    return list
      .filter((v) => v && typeof v.name === 'string' && v.name.trim())
      .map((v) => ({ name: v.name.trim(), date: v.date || undefined }));
  } catch {
    return [];
  }
};

const removeLocalImage = (imagePath) => {
  if (imagePath && imagePath.startsWith('/uploads/')) {
    fs.unlink(path.join(UPLOAD_DIR, path.basename(imagePath)), () => {});
  }
};

const checkImageUrl = (res, url) => {
  if (!/^https?:\/\/\S+$/i.test(url)) {
    res.status(400);
    throw new Error('Image URL must start with http:// or https://');
  }
  return url;
};

const findOwnedPet = async (req, res) => {
  const pet = await Pet.findOne({ _id: req.params.id, owner: req.user._id });
  if (!pet) {
    res.status(404);
    throw new Error('Pet not found');
  }
  return pet;
};

export const getPets = asyncHandler(async (req, res) => {
  const pets = await Pet.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.json(pets);
});

export const getPetById = asyncHandler(async (req, res) => {
  res.json(await findOwnedPet(req, res));
});

export const createPet = asyncHandler(async (req, res) => {
  let image = '';
  if (req.file) image = `/uploads/${req.file.filename}`;
  else if (req.body.imageUrl) image = checkImageUrl(res, req.body.imageUrl.trim());

  try {
    const pet = await Pet.create({
      ...pickFields(req.body),
      vaccinations: parseVaccinations(req.body.vaccinations) || [],
      image,
      owner: req.user._id,
    });
    res.status(201).json(pet);
  } catch (err) {
    if (req.file) removeLocalImage(image);
    throw err;
  }
});

export const updatePet = asyncHandler(async (req, res) => {
  const pet = await findOwnedPet(req, res);
  const oldImage = pet.image;

  Object.entries(pickFields(req.body)).forEach(([key, value]) => pet.set(key, value));

  const vaccinations = parseVaccinations(req.body.vaccinations);
  if (vaccinations) pet.vaccinations = vaccinations;

  if (req.file) pet.image = `/uploads/${req.file.filename}`;
  else if (req.body.imageUrl) pet.image = checkImageUrl(res, req.body.imageUrl.trim());
  else if (req.body.removeImage === 'true') pet.image = '';

  try {
    await pet.save();
  } catch (err) {
    if (req.file) removeLocalImage(`/uploads/${req.file.filename}`);
    throw err;
  }

  if (pet.image !== oldImage) removeLocalImage(oldImage);
  res.json(pet);
});

export const deletePet = asyncHandler(async (req, res) => {
  const pet = await findOwnedPet(req, res);
  await Appointment.deleteMany({ pet: pet._id });
  removeLocalImage(pet.image);
  await pet.deleteOne();
  res.json({ message: 'Pet deleted' });
});