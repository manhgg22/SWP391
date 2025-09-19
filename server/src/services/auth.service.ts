import { User, IUser } from '../models/user.model';
import { AppError } from '../middleware/error';
import { generateAuthTokens, verifyToken, generateResetToken } from '../utils/token';
import { sendResetPasswordEmail } from '../config/mailer';
import { config } from '../config/config';
import bcrypt from 'bcryptjs';

class AuthService {
  async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }
    const { accessToken, refreshToken } = generateAuthTokens(user._id, user.role);
    return { accessToken, refreshToken, user };
  }

  async refresh(refreshToken: string) {
    try {
      // Verify refresh token
      const decoded = verifyToken(refreshToken, config.jwtRefreshSecret);

      // Sửa lại: dùng đúng tên thuộc tính của decoded (ví dụ: _id hoặc userId)
      const userId = decoded._id || decoded.userId;
      if (!userId) {
        throw new AppError('Invalid token payload', 401);
      }

      // Check if user exists and is active
      const user = await User.findOne({ _id: userId, isActive: true });
      if (!user) {
        throw new AppError('User not found', 401);
      }

      // Generate new tokens
      const tokens = generateAuthTokens(user._id, user.role);

      return {
        accessToken: tokens.accessToken,
        newRefreshToken: tokens.refreshToken,
      };
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }
  }

  async forgotPassword(email: string) {
    // Find user
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Generate reset token
    const resetToken = generateResetToken(email);

    // Create reset link
    const resetLink = `${config.clientUrl}/reset-password?token=${resetToken}`;

    // Send email
    await sendResetPasswordEmail(email, resetLink);
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      // Verify reset token
      const decoded = verifyToken(token, config.resetTokenSecret);

      // Find and update user
      const user = await User.findOne({ email: decoded.email, isActive: true });
      if (!user) {
        throw new AppError('Invalid or expired token', 400);
      }

      // Hash mật khẩu mới trước khi lưu
      user.passwordHash = await bcrypt.hash(newPassword, 10);
      await user.save();
    } catch (error) {
      throw new AppError('Invalid or expired token', 400);
    }
  }

  async register({ email, password, name, phone, role }: { email: string; password: string; name: string; phone: string; role: string }) {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already exists', 400);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    // Sửa lại: lưu passwordHash vào trường passwordHash
    const user = new User({ email, passwordHash, name, phone, role });
    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateAuthTokens(user._id, user.role);

    return { accessToken, refreshToken, user };
  }
}

export const authService = new AuthService();