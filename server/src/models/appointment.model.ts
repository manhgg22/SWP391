import mongoose, { Document, Schema } from 'mongoose';

export interface IAppointment extends Document {
  patientId: Schema.Types.ObjectId;
  doctorId: Schema.Types.ObjectId;
  scheduleId: Schema.Types.ObjectId;
  slotIndex: number;
  reason: string;
  note: string;
  status: 'confirmed' | 'canceled' | 'completed' | 'no_show';
  canceledBy?: 'patient' | 'doctor' | 'receptionist';
  canceledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    scheduleId: {
      type: Schema.Types.ObjectId,
      ref: 'Schedule',
      required: true,
    },
    slotIndex: {
      type: Number,
      required: true,
      min: 0,
    },
    reason: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['confirmed', 'canceled', 'completed', 'no_show'],
      default: 'confirmed',
    },
    canceledBy: {
      type: String,
      enum: ['patient', 'doctor', 'receptionist'],
    },
    canceledAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for scheduleId and slotIndex
appointmentSchema.index({ scheduleId: 1, slotIndex: 1 });

export const Appointment = mongoose.model<IAppointment>(
  'Appointment',
  appointmentSchema
);