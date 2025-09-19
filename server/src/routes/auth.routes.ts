import express from 'express';
import { validate } from '../middleware/validate';
import { loginSchema, forgotPasswordSchema, resetPasswordSchema, registerSchema } from '../utils/validation';
import {
  loginController,
  refreshTokenController,
  forgotPasswordController,
  resetPasswordController,
  logoutController,
  registerController,
} from '../controllers/auth.controller';

const router = express.Router();

// Routes
router.post('/login', validate(loginSchema), loginController);
router.post('/refresh', refreshTokenController);
router.post('/forgot', validate(forgotPasswordSchema), forgotPasswordController);
router.post('/reset', validate(resetPasswordSchema), resetPasswordController);
router.post('/logout', logoutController);
router.post('/register', validate(registerSchema), registerController);

export const authRouter = router;