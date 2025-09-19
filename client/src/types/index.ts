export interface User {
  _id: string;
  email: string;
  role: 'receptionist' | 'doctor' | 'patient' | 'admin';
  name: string;
  phone: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Specialty {
  _id: string;
  name: string;
  description: string;
}

export interface Doctor {
  _id: string;
  userId: User;
  specialties: Specialty[];
  bio: string;
  room: string;
  createdAt: string;
  updatedAt: string;
}

export interface Patient {
  _id: string;
  userId: User;
  dob: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  insuranceNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface Slot {
  start: string;
  end: string;
  capacity: number;
  bookedCount: number;
}

export interface Schedule {
  _id: string;
  doctorId: string;
  doctor: Doctor;
  date: string;
  slots: Slot[];
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  _id: string;
  patientId: string;
  doctorId: string;
  scheduleId: string;
  slotIndex: number;
  reason: string;
  note: string;
  status: 'confirmed' | 'canceled' | 'completed' | 'no_show';
  canceledBy?: 'patient' | 'doctor' | 'receptionist';
  canceledAt?: string;
  createdAt: string;
  updatedAt: string;
  patient: Patient;
  doctor: Doctor;
  schedule: Schedule;
}

export interface Feedback {
  _id: string;
  appointmentId: string;
  doctorId: string;
  patientId: string;
  rating: number;
  comment: string;
  createdAt: string;
  patient: Patient;
  doctor: Doctor;
  appointment: Appointment;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}