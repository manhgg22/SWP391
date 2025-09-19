import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required(),
  phone: Joi.string().required(),
  role: Joi.string().valid('admin', 'doctor', 'patient', 'receptionist').required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  token: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

export const createDoctorSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required(),
  phone: Joi.string().required(),
  specialties: Joi.array().items(Joi.string()).min(1).required(),
  bio: Joi.string().required(),
  room: Joi.string().required(),
});

export const updateDoctorSchema = Joi.object({
  name: Joi.string(),
  phone: Joi.string(),
  specialties: Joi.array().items(Joi.string()).min(1),
  bio: Joi.string(),
  room: Joi.string(),
});