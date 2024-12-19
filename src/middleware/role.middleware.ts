import { Request, Response, NextFunction } from 'express';
import HttpError from '../utils/httpError';


const roleMiddleware = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!res.locals.tokenData) {
      throw new HttpError(401, 'Authentication required');
    }

 
    const userRole = res.locals.tokenData.role;
    if (!roles.includes(userRole)) {
      throw new HttpError(403, 'Forbidden: Insufficient role');
    }

    next();
  };
};

export default roleMiddleware;