import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createAppointmentSchema } from '../utils/validation';
import {
  createAppointment,
  getAppointments,
  cancelAppointment,
} from '../controllers/appointment.controller';

const router = express.Router();

router.use(authMiddleware);

router.post('/', validate(createAppointmentSchema), createAppointment);
router.get('/', getAppointments);
router.patch('/:id/cancel', cancelAppointment);

export const appointmentRouter = router;