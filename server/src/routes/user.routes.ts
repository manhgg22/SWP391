import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { updateProfileSchema } from '../utils/validation';
import { getUserProfile, updateUserProfile } from '../controllers/user.controller';

const router = express.Router();

router.use(authMiddleware); // Protect all routes

router.get('/me', getUserProfile);
router.put('/me', validate(updateProfileSchema), updateUserProfile);
router.get('/me', (req, res) => {
  // req.user được gắn từ authMiddleware
  res.json({ user: req.user });
});

export const userRouter = router;