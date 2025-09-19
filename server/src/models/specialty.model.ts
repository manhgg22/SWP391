import mongoose, { Document, Schema } from 'mongoose';

export interface ISpecialty extends Document {
  name: string;
  description: string;
}

const specialtySchema = new Schema<ISpecialty>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Specialty = mongoose.model<ISpecialty>('Specialty', specialtySchema);