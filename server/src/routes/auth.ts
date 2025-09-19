import { Router } from 'express';
import { register, login, refreshToken, resetPassword, requestPasswordReset, verifyEmail } from '../controllers/auth';
import { validateBody } from '../middleware/validation';
import { registerSchema, loginSchema, resetPasswordSchema } from '../utils/validationSchemas';

const router = Router();

// POST /api/auth/register
router.post('/register', validateBody(registerSchema), register);

// POST /api/auth/login
router.post('/login', validateBody(loginSchema), login);

// POST /api/auth/refresh
router.post('/refresh', refreshToken);

// POST /api/auth/reset-password
router.post('/reset-password', validateBody(resetPasswordSchema), resetPassword);

// POST /api/auth/request-password-reset
router.post('/request-password-reset', requestPasswordReset);

// GET /api/auth/verify/:token
router.get('/verify/:token', verifyEmail);

export default router;