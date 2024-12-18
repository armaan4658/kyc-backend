import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import ErrorMiddleware from './middleware/ErrorMiddleware';

// Load environment variables
dotenv.config();

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeErrorHandling();
    this.connectToDatabase();
  }

  private initializeMiddlewares(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private initializeErrorHandling(): void {
    this.app.use(ErrorMiddleware.handleErrors); 
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
