import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import { createDoctorSchema, updateDoctorSchema } from '../utils/validationSchemas';
import {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} from '../controllers/doctors';

const router = Router();

// Protect all routes after this middleware
router.use(authMiddleware);

router.route('/')
  .post(validateBody(createDoctorSchema), createDoctor)
  .get(getDoctors);

router.route('/:id')
  .get(getDoctorById)
  .patch(validateBody(updateDoctorSchema), updateDoctor)
  .delete(deleteDoctor);

export default router;