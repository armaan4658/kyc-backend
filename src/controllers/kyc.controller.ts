import express, { Request, Response, NextFunction } from 'express';
import KycService from '../services/kyc.service';
import roleMiddleware from '../middleware/role.middleware';
import multer from "multer";
import upload from '../middleware/upload.middleware';
import HttpError from '../utils/httpError';
import { autoInjectable } from 'tsyringe';

@autoInjectable()
export default class KycController {

  public router: express.Router;
  private kycService : KycService;

  constructor(kycService? : KycService) {
    this.router = express.Router();
    this.kycService = kycService!;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/submit', this.submitKyc);
    this.router.get('/status', this.getKycStatus);
    this.router.patch('/status/:userId', roleMiddleware(['Admin']), this.updateKycStatus);
    this.router.get('/submissions', roleMiddleware(['Admin']), this.getAllKycSubmissions);
    this.router.get('/kpis', roleMiddleware(['Admin']), this.getKpiStats);
  }


  private submitKyc = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    
    upload(req, res, async (err:any) => {
      if (err instanceof multer.MulterError) {
        return next(new HttpError(400, 'File upload error: ' + err.message));
      } else if (err) {
        return next(new HttpError(400, 'Error: ' + err.message));
      }

      try {
        const userId = res.locals.tokenData.id;
        const { name, email } = req.body;
        if(!name || !email) throw new HttpError(400, 'Name and email is required');
        const documentBase64 = req.file ? req.file.buffer.toString('base64') : '';

        if (!documentBase64) {
          throw new HttpError(400, 'No file uploaded');
        }

        const kyc = await this.kycService.submitKyc(userId, { name, email, document: documentBase64 });

        res.status(201).json({ message: 'KYC submitted successfully' });
      } catch (error) {
        next(error);
      }
    })
  }


  private getKycStatus =  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = res.locals.tokenData.id; 
      const kyc = await this.kycService.getKycStatus(userId);
      res.status(200).json({ message: 'KYC retrieved successfully', data: kyc });
    } catch (error) {
      next(error);
    }
  }


  private updateKycStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;
      const { status } = req.body;
      const approvedBy = res.locals.tokenData.email;

      const kyc = await this.kycService.updateKycStatus(userId, status, approvedBy);
      res.status(200).json({ message: 'KYC updated successfully', data: kyc });
    } catch (error) {
      next(error);
    }
  }


  private getAllKycSubmissions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = Number(req.query.page);
      const limit = Number(req.query.limit);
      const kycSubmissions = await this.kycService.getAllKycSubmissions(page, limit);
      res.status(200).json({ message: 'KYC data retrieved successfully',  data: kycSubmissions });
    } catch (error) {
      next(error);
    }
  }


  private getKpiStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const kpis = await this.kycService.getKpiStats();
      res.status(200).json({ message: 'KPIS retrieved successfully', data: kpis });
    } catch (error) {
      next(error);
    }
  }
}