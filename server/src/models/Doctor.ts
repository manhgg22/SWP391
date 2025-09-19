import { Schema, model, Document, Types } from 'mongoose';
import { IUser } from './User';

export interface ISpecialty extends Document {
  name: string;
  description?: string;
}

const specialtySchema = new Schema<ISpecialty>({
  name: {
    type: String,
    required: [true, 'Specialty name is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
});

export interface IDoctor extends Document {
  userId: Types.ObjectId | IUser;
  specialties: Types.ObjectId[] | ISpecialty[];
  bio: string;
  room: string;
}

const doctorSchema = new Schema<IDoctor>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    specialties: [{
      type: Schema.Types.ObjectId,
      ref: 'Specialty',
      required: [true, 'At least one specialty is required'],
    }],
    bio: {
      type: String,
      required: [true, 'Bio is required'],
      trim: true,
    },
    room: {
      type: String,
      required: [true, 'Room number is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Specialty = model<ISpecialty>('Specialty', specialtySchema);
export const Doctor = model<IDoctor>('Doctor', doctorSchema);