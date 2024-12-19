// src/middlewares/validation.middleware.ts
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export default function validationMiddleware (type: any) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const dtoInstance = plainToInstance(type, req.body);
    validate(dtoInstance, { whitelist: true, forbidNonWhitelisted: true }).then(errors => {
      if (errors.length > 0) {
        const message = errors
          .map(err => Object.values(err.constraints || {}).join(', '))
          .join('; ');
        res.status(400).json({ message });
      } else {
        next();
      }
    });
  };
};
