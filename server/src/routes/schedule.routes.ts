import express from 'express';
import { authMiddleware, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createScheduleSchema, updateScheduleSchema } from '../utils/validation';
import {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from '../controllers/schedule.controller';

const router = express.Router();

router.use(authMiddleware);
router.use(authorize('receptionist', 'admin'));

router.get('/', getSchedules);
router.post('/', validate(createScheduleSchema), createSchedule);
router.put('/:id', validate(updateScheduleSchema), updateSchedule);
router.delete('/:id', deleteSchedule);

export const scheduleRouter = router;