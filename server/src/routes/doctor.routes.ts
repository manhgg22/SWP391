import express from 'express';
import { authMiddleware, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createDoctorSchema } from '../utils/validation';
import {
  createDoctor,
  getDoctors,
  getDoctorById,
} from '../controllers/doctor.controller';

const router = express.Router();

router.use(authMiddleware);

// Protected routes - only receptionist and admin
router.post(
  '/',
  authorize('receptionist', 'admin'),
  validate(createDoctorSchema),
  createDoctor
);

// Routes accessible by receptionist
router.get('/', getDoctors);
router.get('/:id', getDoctorById);

export const doctorRouter = router;