import { User } from '../models/user.model';
import { Doctor } from '../models/doctor.model';
import { AppError } from '../middleware/error';
import bcrypt from 'bcryptjs';

interface CreateDoctorInput {
  email: string;
  password: string;
  name: string;
  phone: string;
  specialties: string[];
  bio: string;
  room: string;
  avatarUrl?: string;
}

interface DoctorQueryParams {
  specialtyId?: string;
  keyword?: string;
  page?: number;
  pageSize?: number;
}

class DoctorService {
  async createDoctor(data: CreateDoctorInput) {
    // Check if email exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new AppError('Email already exists', 400);
    }

    // Create user
    const user = await User.create({
      email: data.email,
      passwordHash: data.password,
      role: 'doctor',
      name: data.name,
      phone: data.phone,
      avatarUrl: data.avatarUrl,
    });

    // Create doctor profile
    const doctor = await Doctor.create({
      userId: user._id,
      specialties: data.specialties,
      bio: data.bio,
      room: data.room,
    });

    return {
      id: doctor._id,
      userId: user._id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      specialties: doctor.specialties,
      bio: doctor.bio,
      room: doctor.room,
      avatarUrl: user.avatarUrl,
    };
  }

  async getDoctors(params: DoctorQueryParams) {
    const { specialtyId, keyword, page = 1, pageSize = 10 } = params;

    // Build query
    const query: any = {};
    if (specialtyId) {
      query.specialties = specialtyId;
    }

    // Build user query for keyword search
    const userQuery: any = {};
    if (keyword) {
      userQuery.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } },
      ];
    }

    // Get matching user IDs first
    let userIds = [];
    if (Object.keys(userQuery).length > 0) {
      const users = await User.find(userQuery).select('_id');
      userIds = users.map(user => user._id);
      query.userId = { $in: userIds };
    }

    // Execute query with pagination
    const skip = (page - 1) * pageSize;
    const [doctors, total] = await Promise.all([
      Doctor.find(query)
        .populate('userId', 'email name phone avatarUrl')
        .populate('specialties', 'name')
        .skip(skip)
        .limit(pageSize),
      Doctor.countDocuments(query),
    ]);

    return {
      doctors,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async getDoctorById(id: string) {
    const doctor = await Doctor.findById(id)
      .populate('userId', 'email name phone avatarUrl')
      .populate('specialties', 'name');

    if (!doctor) {
      throw new AppError('Doctor not found', 404);
    }

    return doctor;
  }
}

export const doctorService = new DoctorService();