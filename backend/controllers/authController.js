import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import generateToken from '../utils/generateToken.js';

const publicUser = (u) => ({
  _id: u._id,
  name: u.name,
  email: u.email,
  phone: u.phone,
  city: u.city,
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, city } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email and password are required');
  }

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    res.status(409);
    throw new Error('An account with this email already exists');
  }

  const user = await User.create({ name, email, password, phone, city });
  res.status(201).json({ ...publicUser(user), token: generateToken(user._id) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json({ ...publicUser(user), token: generateToken(user._id) });
});

export const getProfile = asyncHandler(async (req, res) => {
  res.json(publicUser(req.user));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, city } = req.body;
  const user = req.user;

  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (city !== undefined) user.city = city;

  await user.save();
  res.json(publicUser(user));
});
