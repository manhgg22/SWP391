import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodEffects } from 'zod';

export const validate = (schema: AnyZodObject | ZodEffects<any>) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body); // Không bọc trong { body: ... }
      return next();
    } catch (error) {
      return res.status(400).json(error);
    }
  };