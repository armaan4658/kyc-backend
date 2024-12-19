import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import HttpError from '../utils/httpError';

const authorize = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new HttpError(401, 'Authentication required');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.body.tokenData = decoded; 
    next();
  } catch (error) {
    throw new HttpError(401, 'Invalid or expired token');
  }
};

export default authorize;
