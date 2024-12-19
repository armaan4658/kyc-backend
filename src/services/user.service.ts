import UserModel, { User } from '../models/user.model';  
import HttpError from '../utils/httpError';
import { injectable } from 'tsyringe';

@injectable()
export default class UserService {

  async createUser(userData: User): Promise<User> {
    try {
      const existingUser = await UserModel.findOne({ email: userData.email });

      if (existingUser) {
        throw new HttpError(400, 'User with this email already exists');
      }

      const newUser = new UserModel(userData);
      return await newUser.save();
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;  
      }
      throw new HttpError(500, 'Error creating user');
    }
  }


  async getUserById(userId: string): Promise<User> {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new HttpError(404, 'User not found');
      }
      const userObject = user.toObject();
      delete (userObject as any).password;
      return userObject;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;  
      }
      throw new HttpError(500, 'Error fetching user');
    }
  }


  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    try {
      const user = await UserModel.findByIdAndUpdate(userId, userData, { new: true });
      if (!user) {
        throw new HttpError(404, 'User not found');
      }
      const userObject = user.toObject();
      delete (userObject as any).password;
      return userObject;
    } catch (error) {
      console.error(error);
      if (error instanceof HttpError) {
        throw error;  
      }
      throw new HttpError(500, 'Error updating user');
    }
  }


  async deleteUser(userId: string): Promise<void> {
    try {
      const user = await UserModel.findByIdAndDelete(userId);
      if (!user) {
        throw new HttpError(404, 'User not found');
      }
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;  
      }
      throw new HttpError(500, 'Error deleting user');
    }
  }

  async getAllUsers(): Promise<User[]> {
    return await UserModel.find({},{name: 1, email: 1, _id: 1});
  }

  async createAdmin(): Promise<string | User> {
    try {
      const existingAdmin = await UserModel.findOne({ role: 'Admin' });
  
      if (existingAdmin) {
        return 'Admin user already exists';
      }
      
      const adminData = {
        name: 'Admin',
        email: 'admin@test.com',
        password: 'test', 
        role: 'Admin',
      };
  
      const adminUser = new UserModel(adminData);
      return await adminUser.save();
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError(500, 'Error creating admin user');
    }
  }
  
}
