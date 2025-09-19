import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { userService } from '../services/user.service';

export const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const user = await userService.getProfile(userId);
  res.json(user);
});

export const updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const updateData = req.body;
  const updatedUser = await userService.updateProfile(userId, updateData);
  res.json(updatedUser);
});