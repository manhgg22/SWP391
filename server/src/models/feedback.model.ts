import mongoose, { Document, Schema } from 'mongoose';

export interface IFeedback extends Document {
  appointmentId: Schema.Types.ObjectId;
  doctorId: Schema.Types.ObjectId;
  patientId: Schema.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

const feedbackSchema = new Schema<IFeedback>(
  {
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one feedback per appointment
feedbackSchema.index({ appointmentId: 1 }, { unique: true });

export const Feedback = mongoose.model<IFeedback>('Feedback', feedbackSchema);