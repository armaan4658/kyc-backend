// src/controllers/auth.controller.ts
import { Request, Response, NextFunction, Router } from 'express';
import AuthService from '../services/auth.service';
import HttpError from '../utils/httpError';
import { User as IUser } from '../models/user.model';
import UserService from '../services/user.service';
import validationMiddleware from '../middleware/validation.middleware';
import { CreateUserDTO } from '../dtos/user.dto';
import { autoInjectable } from 'tsyringe';

@autoInjectable()
class AuthController {
  public router = Router();
  private authService: AuthService;
  private userService: UserService

  constructor() {
    this.authService = new AuthService();
    this.userService = new UserService();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/login', this.login);
    this.router.post('/reset', this.resetPassword);
    this.router.post('/signup', validationMiddleware(CreateUserDTO), this.signup);
  }

  private login = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new HttpError(400,'Email and password are required');
      }

      const result = await this.authService.login(email, password);
      res.status(200).json({ message: 'User logged in successfully', data: result });
    } catch (error) {
      next(error);
    }
  };

  private resetPassword = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new HttpError(400,'Email and password are required');
      }

      const result = await this.authService.resetPassword(email, password);
      res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
      next(error);
    }
  };


    private signup = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
      try {
        if(req.body.role !== 'User') throw new HttpError(400, 'Role must be User');
        const userData: IUser = req.body;
        const createdUser: IUser = await this.userService.createUser(userData);
        res.status(201).json({ message: 'User successfully created' });
      } catch (error) {
        next(error);
      }
    };

}

export default AuthController;