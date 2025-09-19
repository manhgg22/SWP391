import { Appointment } from '../models/appointment.model';
import { Schedule } from '../models/schedule.model';
import { AppError } from '../middleware/error';

interface CreateAppointmentInput {
  patientId: string;
  doctorId: string;
  scheduleId: string;
  slotIndex: number;
  reason: string;
  note: string;
}

interface AppointmentQueryParams {
  patientId?: string;
  doctorId?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

class AppointmentService {
  async createAppointment(data: CreateAppointmentInput) {
    // Get schedule and validate slot
    const schedule = await Schedule.findById(data.scheduleId);
    if (!schedule) {
      throw new AppError('Schedule not found', 404);
    }

    const slot = schedule.slots[data.slotIndex];
    if (!slot) {
      throw new AppError('Invalid slot index', 400);
    }

    // Check if slot is full
    if (slot.bookedCount >= slot.capacity) {
      throw new AppError('Slot is fully booked', 400);
    }

    // Create appointment
    const appointment = await Appointment.create({
      ...data,
      status: 'confirmed',
    });

    // Update slot booking count
    slot.bookedCount += 1;
    await schedule.save();

    return appointment.populate([
      {
        path: 'patientId',
        populate: { path: 'userId', select: 'name email phone' },
      },
      {
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email phone' },
      },
      { path: 'scheduleId' },
    ]);
  }

  async getAppointments(params: AppointmentQueryParams) {
    const {
      patientId,
      doctorId,
      dateFrom,
      dateTo,
      status,
      page = 1,
      pageSize = 10,
    } = params;

    // Build query
    const query: any = {};
    if (patientId) query.patientId = patientId;
    if (doctorId) query.doctorId = doctorId;
    if (status) query.status = status;

    // Date range query
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    // Execute query with pagination
    const skip = (page - 1) * pageSize;
    const [appointments, total] = await Promise.all([
      Appointment.find(query)
        .populate({
          path: 'patientId',
          populate: { path: 'userId', select: 'name email phone' },
        })
        .populate({
          path: 'doctorId',
          populate: { path: 'userId', select: 'name email phone' },
        })
        .populate('scheduleId')
        .skip(skip)
        .limit(pageSize)
        .sort({ createdAt: -1 }),
      Appointment.countDocuments(query),
    ]);

    return {
      appointments,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async cancelAppointment(id: string, canceledBy: 'patient' | 'doctor' | 'receptionist') {
    // Find appointment
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }

    // Check if appointment can be canceled
    if (appointment.status !== 'confirmed') {
      throw new AppError('Can only cancel confirmed appointments', 400);
    }

    // Update appointment
    appointment.status = 'canceled';
    appointment.canceledBy = canceledBy;
    appointment.canceledAt = new Date();

    // Update slot booking count
    const schedule = await Schedule.findById(appointment.scheduleId);
    if (schedule) {
      const slot = schedule.slots[appointment.slotIndex];
      if (slot) {
        slot.bookedCount = Math.max(0, slot.bookedCount - 1);
        await schedule.save();
      }
    }

    await appointment.save();

    return appointment.populate([
      {
        path: 'patientId',
        populate: { path: 'userId', select: 'name email phone' },
      },
      {
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email phone' },
      },
      { path: 'scheduleId' },
    ]);
  }
}

export const appointmentService = new AppointmentService();