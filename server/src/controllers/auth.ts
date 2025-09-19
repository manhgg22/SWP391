import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { AppError } from '../utils/AppError';
import { config } from '../config/config';
import { sendEmail } from '../utils/email';
import { generateAuthTokens, generateResetToken, verifyToken, type TokenPayload } from '../utils/token';

// Register a new user
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, name, phone, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError(400, 'Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create verification token
    const verificationToken = generateResetToken(email);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      phone,
      role,
      verificationToken,
    });

    // Send verification email
    const verificationUrl = `${config.clientUrl}/verify-email/${verificationToken}`;
    await sendEmail({
      to: email,
      subject: 'Verify your email',
      html: `Please click this link to verify your email: <a href="${verificationUrl}">${verificationUrl}</a>`,
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateAuthTokens(
      user._id.toString(),
      user.role
    );

    // Create a sanitized user object without sensitive data
    const sanitizedUser = {
      _id: user._id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.status(201).json({
      status: 'success',
      data: {
        user: sanitizedUser,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login user
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError(401, 'Invalid credentials');
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new AppError(401, 'Invalid credentials');
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      throw new AppError(401, 'Please verify your email first');
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateAuthTokens(
      user._id.toString(),
      user.role
    );

    // Create a sanitized user object without sensitive data
    const sanitizedUser = {
      _id: user._id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.status(200).json({
      status: 'success',
      data: {
        user: sanitizedUser,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Refresh access token
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      throw new AppError(401, 'Refresh token is required');
    }

    // Verify refresh token
    const decoded = verifyToken<TokenPayload>(token, config.jwtRefreshSecret);

    // Generate new tokens
    const { accessToken } = generateAuthTokens(
      decoded.userId,
      decoded.role
    );

    res.status(200).json({
      status: 'success',
      data: {
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Request password reset
export const requestPasswordReset = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Generate reset token
    const resetToken = generateResetToken(email);

    // Save reset token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // Send reset password email
    const resetUrl = `${config.clientUrl}/reset-password/${resetToken}`;
    await sendEmail({
      to: email,
      subject: 'Reset your password',
      html: `Please click this link to reset your password: <a href="${resetUrl}">${resetUrl}</a>`,
    });

    res.status(200).json({
      status: 'success',
      message: 'Password reset email sent',
    });
  } catch (error) {
    next(error);
  }
};

// Reset password
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token, password } = req.body;

    // Find user by reset token and check if token is expired
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new AppError(400, 'Invalid or expired password reset token');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update password and clear reset token fields
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Password reset successful',
    });
  } catch (error) {
    next(error);
  }
};

// Verify email
export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.params;

    // Verify token
    const decoded = verifyToken(token, config.resetTokenSecret) as { email: string };

    // Find user and update email verification status
    const user = await User.findOne({
      email: decoded.email,
      verificationToken: token,
    });

    if (!user) {
      throw new AppError(400, 'Invalid verification token');
    }

    user.isEmailVerified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully',
    });
  } catch (error) {
    next(error);
  }
};