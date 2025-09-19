import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { AppError } from '../middleware/error';
import { LoginInput, ForgotPasswordInput, ResetPasswordInput } from '../utils/validation';
import { authService } from '../services/auth.service';

export const loginController = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { accessToken, refreshToken, user } = await authService.login(email, password);
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({
    accessToken,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatarUrl,
    },
  });
});

export const refreshTokenController = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new AppError('Refresh token not found', 401);
  }

  const { accessToken, newRefreshToken } = await authService.refresh(refreshToken);

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken });
});

export const forgotPasswordController = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body as ForgotPasswordInput;

  await authService.forgotPassword(email);

  res.json({ message: 'Password reset email sent' });
});

export const resetPasswordController = asyncHandler(async (req: Request, res: Response) => {
  // Nếu dùng Zod schema kiểu { body: { token, password, confirmPassword } }
  const { token, password } = req.body;

  await authService.resetPassword(token, password);

  res.json({ message: 'Password reset successful' });
});

export const logoutController = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
});

export const registerController = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, name, phone } = req.body; // Nếu dùng Zod schema kiểu { body: { ... } }
  const role = 'receptionist';
  const user = await authService.register({ email, password, name, phone, role });
  res.status(201).json({ message: 'Đăng ký thành công!', user });
});