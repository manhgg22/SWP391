import { Schedule } from '../models/schedule.model';
import { Appointment } from '../models/appointment.model';
import { Doctor } from '../models/doctor.model';
import { AppError } from '../middleware/error';

interface Slot {
  start: string;
  end: string;
  capacity: number;
  bookedCount: number;
}

interface CreateScheduleInput {
  doctorId: string;
  date: string;
  slots: Slot[];
}

interface UpdateScheduleInput {
  slots?: Slot[];
}

interface ScheduleQueryParams {
  doctorId?: string;
  date?: string;
  specialtyId?: string;
}

class ScheduleService {
  async getSchedules(params: ScheduleQueryParams) {
    const { doctorId, date, specialtyId } = params;

    // Build query
    const query: any = {};
    if (doctorId) query.doctorId = doctorId;
    if (date) query.date = date;

    // If specialtyId is provided, get all doctors in that specialty first
    if (specialtyId) {
      const doctors = await Doctor.find({ specialties: specialtyId }).select('_id');
      const doctorIds = doctors.map(doc => doc._id);
      query.doctorId = { $in: doctorIds };
    }

    // Get schedules
    const schedules = await Schedule.find(query)
      .populate({
        path: 'doctorId',
        populate: {
          path: 'userId',
          select: 'name email phone avatarUrl',
        },
      })
      .sort({ date: 1 });

    return schedules;
  }

  async createSchedule(data: CreateScheduleInput) {
    // Check if schedule already exists for this doctor and date
    const existingSchedule = await Schedule.findOne({
      doctorId: data.doctorId,
      date: data.date,
    });

    if (existingSchedule) {
      throw new AppError('Schedule already exists for this date', 400);
    }

    // Create schedule
    const schedule = await Schedule.create(data);

    return schedule.populate({
      path: 'doctorId',
      populate: {
        path: 'userId',
        select: 'name email phone avatarUrl',
      },
    });
  }

  async updateSchedule(id: string, data: UpdateScheduleInput) {
    const schedule = await Schedule.findById(id);
    if (!schedule) {
      throw new AppError('Schedule not found', 404);
    }

    // Update slots
    if (data.slots) {
      // Validate that we're not reducing capacity below current bookings
      for (let i = 0; i < data.slots.length; i++) {
        const newSlot = data.slots[i];
        const currentSlot = schedule.slots[i];

        if (currentSlot && newSlot.capacity < currentSlot.bookedCount) {
          throw new AppError(
            `Cannot reduce capacity below current bookings for slot ${i + 1}`,
            400
          );
        }
      }

      schedule.slots = data.slots;
    }

    await schedule.save();

    return schedule.populate({
      path: 'doctorId',
      populate: {
        path: 'userId',
        select: 'name email phone avatarUrl',
      },
    });
  }

  async deleteSchedule(id: string) {
    const schedule = await Schedule.findById(id);
    if (!schedule) {
      throw new AppError('Schedule not found', 404);
    }

    // Check if there are any confirmed appointments
    const confirmedAppointments = await Appointment.findOne({
      scheduleId: id,
      status: 'confirmed',
    });

    if (confirmedAppointments) {
      throw new AppError('Cannot delete schedule with confirmed appointments', 400);
    }

    await schedule.deleteOne();
  }
}

export const scheduleService = new ScheduleService();