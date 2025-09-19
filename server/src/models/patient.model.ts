import mongoose, { Document, Schema } from 'mongoose';

export interface IPatient extends Document {
  userId: Schema.Types.ObjectId;
  dob: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  insuranceNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

const patientSchema = new Schema<IPatient>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    insuranceNumber: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Patient = mongoose.model<IPatient>('Patient', patientSchema);