import { Feedback } from '../models/feedback.model';

interface FeedbackQueryParams {
  doctorId?: string;
  patientId?: string;
  rating?: number;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}

class FeedbackService {
  async getFeedbacks(params: FeedbackQueryParams) {
    const { doctorId, patientId, rating, from, to, page = 1, pageSize = 10 } = params;

    // Build query
    const query: any = {};
    if (doctorId) query.doctorId = doctorId;
    if (patientId) query.patientId = patientId;
    if (rating) query.rating = rating;

    // Date range query
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    // Execute query with pagination
    const skip = (page - 1) * pageSize;
    const [feedbacks, total] = await Promise.all([
      Feedback.find(query)
        .populate({
          path: 'patientId',
          populate: { path: 'userId', select: 'name email' },
        })
        .populate({
          path: 'doctorId',
          populate: { path: 'userId', select: 'name email' },
        })
        .populate('appointmentId')
        .skip(skip)
        .limit(pageSize)
        .sort({ createdAt: -1 }),
      Feedback.countDocuments(query),
    ]);

    return {
      feedbacks,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }
}

export const feedbackService = new FeedbackService();