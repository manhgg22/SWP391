import mongoose, { Document, Schema } from 'mongoose';

interface ISlot {
  start: string;
  end: string;
  capacity: number;
  bookedCount: number;
}

export interface ISchedule extends Document {
  doctorId: Schema.Types.ObjectId;
  date: string;
  slots: ISlot[];
  createdAt: Date;
  updatedAt: Date;
}

const scheduleSchema = new Schema<ISchedule>(
  {
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    slots: [
      {
        start: {
          type: String,
          required: true,
        },
        end: {
          type: String,
          required: true,
        },
        capacity: {
          type: Number,
          required: true,
          min: 1,
        },
        bookedCount: {
          type: Number,
          default: 0,
          min: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create compound index for doctorId and date
scheduleSchema.index({ doctorId: 1, date: 1 }, { unique: true });

export const Schedule = mongoose.model<ISchedule>('Schedule', scheduleSchema);