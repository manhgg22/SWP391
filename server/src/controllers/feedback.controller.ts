import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { feedbackService } from '../services/feedback.service';

export const getFeedbacks = asyncHandler(async (req: Request, res: Response) => {
  const { doctorId, patientId, rating, from, to, page = '1', pageSize = '10' } = req.query as {
    doctorId?: string;
    patientId?: string;
    rating?: string;
    from?: string;
    to?: string;
    page?: string;
    pageSize?: string;
  };

  const result = await feedbackService.getFeedbacks({
    doctorId,
    patientId,
    rating: rating ? parseInt(rating) : undefined,
    from,
    to,
    page: parseInt(page),
    pageSize: parseInt(pageSize),
  });

  res.json(result);
});