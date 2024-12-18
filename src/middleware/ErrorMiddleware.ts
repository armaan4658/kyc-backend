import { Request, Response, NextFunction } from 'express';
import HttpError from '../utils/httpError';

class ErrorMiddleware {
  public static handleErrors: (
    err: Error | HttpError,
    req: Request,
    res: Response,
    next: NextFunction
  ) => void = (err, req, res, next) => {
    if (err instanceof HttpError) {
      return res.status(err.statusCode).json({
        error: true,
        message: err.message,
        statusCode: err.statusCode,
      });
    }

    console.error('Unhandled Error:', err); 
    res.status(500).json({
      error: true,
      message: 'Internal Server Error',
      statusCode: 500,
    });
  };
}

export default ErrorMiddleware;
