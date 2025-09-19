import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/token';
import { config } from '../config/config';
import { AppError } from './error';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Unauthorized', 401));
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyToken(token, config.jwtSecret);
    req.user = decoded; // Gắn thông tin user vào request
    next();
  } catch (err) {
    next(new AppError('Invalid token', 401));
  }
};

// Role-based authorization middleware
export const authorize = (...roles: string[]) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      return next(new AppError('Not authenticated', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('Not authorized to access this resource', 403)
      );
    }

    next();
  };
};