import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Doctor } from '../models/Doctor';
import { AppError } from '../utils/AppError';

interface AuthRequest extends Request {
  user?: any;
}

// Create a new doctor
export const createDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, name, phone, specialties, bio, room } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError(400, 'Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user account
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      phone,
      role: 'doctor',
      isEmailVerified: true, // Since doctor accounts are created by admin/receptionist
    });

    // Create doctor profile
    const doctor = await Doctor.create({
      userId: user._id,
      specialties,
      bio,
      room,
    });

    await doctor.populate('userId', '-password');
    await doctor.populate('specialties');

    res.status(201).json({
      status: 'success',
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

// Get all doctors with optional filtering
export const getDoctors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { specialtyId, keyword } = req.query;

    let query: any = {};

    // Filter by specialty
    if (specialtyId) {
      query.specialties = specialtyId;
    }

    // Search by name or email
    if (keyword) {
      const userIds = await User.find({
        $or: [
          { name: { $regex: keyword as string, $options: 'i' } },
          { email: { $regex: keyword as string, $options: 'i' } },
        ],
      }).select('_id');

      query.userId = { $in: userIds };
    }

    const doctors = await Doctor.find(query)
      .populate('userId', '-password')
      .populate('specialties')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: doctors.length,
      data: doctors,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single doctor
export const getDoctorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('userId', '-password')
      .populate('specialties');

    if (!doctor) {
      throw new AppError(404, 'Doctor not found');
    }

    res.status(200).json({
      status: 'success',
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

// Update doctor
export const updateDoctor = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, phone, specialties, bio, room } = req.body;

    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      throw new AppError(404, 'Doctor not found');
    }

    // Update user data if provided
    if (name || phone) {
      await User.findByIdAndUpdate(doctor.userId, {
        ...(name && { name }),
        ...(phone && { phone }),
      });
    }

    // Update doctor data
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      {
        ...(specialties && { specialties }),
        ...(bio && { bio }),
        ...(room && { room }),
      },
      { new: true, runValidators: true }
    )
      .populate('userId', '-password')
      .populate('specialties');

    res.status(200).json({
      status: 'success',
      data: updatedDoctor,
    });
  } catch (error) {
    next(error);
  }
};

// Delete doctor
export const deleteDoctor = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      throw new AppError(404, 'Doctor not found');
    }

    // Delete user account
    await User.findByIdAndDelete(doctor.userId);

    // Delete doctor profile
    await doctor.deleteOne();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};