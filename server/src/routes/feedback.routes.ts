import express from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  getFeedbacks,
} from '../controllers/feedback.controller';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getFeedbacks);

export const feedbackRouter = router;