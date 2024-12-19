import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import ErrorMiddleware from './middleware/ErrorMiddleware';
import UserController from './controllers/user.controller';
import AuthController from './controllers/auth.controller';
import KycController from './controllers/kyc.controller';
import authorize from './middleware/authorize.middleware';
import { container } from 'tsyringe';

// Load environment variables
dotenv.config();

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeControllers();
    this.initializeErrorHandling();
    this.connectToDatabase();
    this.createAdmin();
  }

  private initializeMiddlewares(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private initializeErrorHandling(): void {
    this.app.use(ErrorMiddleware.handleErrors); 
  }

  private initializeControllers(): void {
    const userController = container.resolve(UserController);
    const authController = container.resolve(AuthController);
    const kycController = container.resolve(KycController);
    this.app.use('/api/v1/auth', authController.router);
    this.app.use(authorize);
    this.app.use('/api/v1/users', userController.router);
    this.app.use('/api/v1/kyc', kycController.router);
  }

  private async createAdmin(): Promise<void> {
    const userController = container.resolve(UserController);
    const res = await userController.createAdmin();
    console.log(res);
  }

  private connectToDatabase(): void {
    const mongoURI = process.env.MONGO_URI as string;
    mongoose
      .connect(mongoURI)
      .then(() => console.log('Connected to MongoDB'))
      .catch((error) => console.error('MongoDB connection error:', error));
  }
}

export default new App().app;
