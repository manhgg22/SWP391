import express from 'express';
import { authMiddleware, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createPatientSchema } from '../utils/validation';
import {
  createPatient,
  getPatients,
  getPatientById,
} from '../controllers/patient.controller';

const router = express.Router();

router.use(authMiddleware);
router.use(authorize('receptionist', 'admin')); // All routes need receptionist access

router.post('/', validate(createPatientSchema), createPatient);
router.get('/', getPatients);
router.get('/:id', getPatientById);

export const patientRouter = router;