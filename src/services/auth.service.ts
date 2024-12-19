// src/services/auth.service.ts
import jwt from 'jsonwebtoken';
import User, { User as IUser } from '../models/user.model';
import HttpError from '../utils/httpError';
import bcrypt from "bcrypt";
import { injectable } from 'tsyringe';

@injectable()
class AuthService {
  private jwtSecret: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'your_secret_key';
  }

  public async login(email: string, password: string): Promise<{ token: string }> {

    try {
    
        const user = await User.findOne({ email });
        if (!user) {
          throw new HttpError(404,'User not found');
        }
  
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
          throw new HttpError(400,'Invalid credentials');
        }
    
        const token = this.generateToken(user);
        const userObject = user.toObject();
        delete (userObject as any).password;
        return { token, ...userObject };
    } catch (error) {
        if (error instanceof HttpError) {
          throw error;  
        }
        throw new HttpError(500, 'Error logging in');
    }
  }

  public async resetPassword(email: string, newPassword: string): Promise<void> {
    try {

      const user = await User.findOne({email})
      if (!user) {
        throw new HttpError(404, 'User not found');
      }

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError(500, 'Error resetting password');
    }
  }

  private generateToken(user: IUser): string {
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, this.jwtSecret, { expiresIn: '1h' });
  }
}

export default AuthService;