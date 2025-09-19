import mongoose, { Document, Schema } from 'mongoose';

export interface IDoctor extends Document {
  userId: Schema.Types.ObjectId;
  specialties: Schema.Types.ObjectId[];
  bio: string;
  room: string;
  createdAt: Date;
  updatedAt: Date;
}

const doctorSchema = new Schema<IDoctor>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    specialties: [{
      type: Schema.Types.ObjectId,
      ref: 'Specialty',
      required: true,
    }],
    bio: {
      type: String,
      required: true,
    },
    room: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Doctor = mongoose.model<IDoctor>('Doctor', doctorSchema);