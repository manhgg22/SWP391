import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { AppError } from '../utils/AppError';

export const validateBody = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      throw new AppError(400, error.details[0].message);
    }
    next();
  };
};