import { User } from '../models/user.model';
import { Patient } from '../models/patient.model';
import { AppError } from '../middleware/error';

interface CreatePatientInput {
  email: string;
  password: string;
  name: string;
  phone: string;
  dob: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  insuranceNumber?: string;
  avatarUrl?: string;
}

interface PatientQueryParams {
  keyword?: string;
  page?: number;
  pageSize?: number;
}

class PatientService {
  async createPatient(data: CreatePatientInput) {
    // Check if email exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new AppError('Email already exists', 400);
    }

    // Create user
    const user = await User.create({
      email: data.email,
      passwordHash: data.password,
      role: 'patient',
      name: data.name,
      phone: data.phone,
      avatarUrl: data.avatarUrl,
    });

    // Create patient profile
    const patient = await Patient.create({
      userId: user._id,
      dob: data.dob,
      gender: data.gender,
      address: data.address,
      insuranceNumber: data.insuranceNumber,
    });

    return {
      id: patient._id,
      userId: user._id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      dob: patient.dob,
      gender: patient.gender,
      address: patient.address,
      insuranceNumber: patient.insuranceNumber,
      avatarUrl: user.avatarUrl,
    };
  }

  async getPatients(params: PatientQueryParams) {
    const { keyword, page = 1, pageSize = 10 } = params;

    // Build query for user search
    let userQuery: any = {};
    if (keyword) {
      userQuery.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } },
        { phone: { $regex: keyword, $options: 'i' } },
      ];
    }
    userQuery.role = 'patient';

    // Execute query with pagination
    const skip = (page - 1) * pageSize;

    // Get patients with their user data
    const [patients, total] = await Promise.all([
      Patient.find()
        .populate('userId', 'email name phone avatarUrl')
        .skip(skip)
        .limit(pageSize),
      Patient.countDocuments(),
    ]);

    return {
      patients,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async getPatientById(id: string) {
    const patient = await Patient.findById(id)
      .populate('userId', 'email name phone avatarUrl');

    if (!patient) {
      throw new AppError('Patient not found', 404);
    }

    return patient;
  }
}

export const patientService = new PatientService();