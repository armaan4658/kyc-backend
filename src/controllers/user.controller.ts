import { Request, Response, NextFunction, Router } from 'express';
import UserService from '../services/user.service';
import { User as IUser } from '../models/user.model';
import validationMiddleware from '../middleware/validation.middleware';
import { CreateUserDTO, UpdateUserDTO } from '../dtos/user.dto';
import roleMiddleware from '../middleware/role.middleware';
import { autoInjectable } from 'tsyringe';

@autoInjectable()
class UserController {
  public router = Router();
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/create',
      validationMiddleware(CreateUserDTO), 
      roleMiddleware(['Admin']),
      this.createUser
    );
    this.router.get('/list', roleMiddleware(['Admin']), this.getAllUser);
    this.router.get('/profile/:id', this.getUser);
    this.router.patch('/:id', validationMiddleware(UpdateUserDTO), this.updateUser);
    this.router.delete('/:id', this.deleteUser);
  }

  private createUser = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
      const userData: IUser = req.body;
      const createdUser: IUser = await this.userService.createUser(userData);
      res.status(201).json({ message: 'User successfully created' });
    } catch (error) {
      next(error);
    }
  };

  private getUser = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
      const userId = req.params.id;
      const user: IUser = await this.userService.getUserById(userId);
      res.status(200).json({ message: 'User successfully fetched' , data: user });
    } catch (error) {
      next(error);
    }
  };

  private getAllUser = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
      const user = await this.userService.getAllUsers();
      res.status(200).json({ message: 'Users successfully fetched' , data: user });
    } catch (error) {
      next(error);
    }
  };

  private updateUser = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
      const userId = req.params.id;
      const userData: Partial<UpdateUserDTO> = req.body;
      delete (userData as any)['tokenData'];
      const updatedUser: IUser = await this.userService.updateUser(userId, userData);
      res.status(200).json({ message: 'User successfully updated' , data: updatedUser });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  private deleteUser = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
      const userId = req.params.id;
      await this.userService.deleteUser(userId);
      res.status(200).json({ message: 'User successfully deleted' });
    } catch (error) {
      next(error);
    }
  };

  createAdmin = async () : Promise<IUser | string> => {
    return await this.userService.createAdmin();
  }
}

export default UserController;