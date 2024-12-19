import Kyc from '../models/kyc.model';
import User from '../models/user.model';
import HttpError from '../utils/httpError';
import { injectable } from 'tsyringe';

@injectable()
export default class KycService {


   async submitKyc(userId: string, kycData: { name: string; email: string; document: string }): Promise<any> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new HttpError(404, 'User not found');
      }

      const kycExists = await Kyc.findOne({ user: userId });
      if (kycExists) {
        throw new HttpError(400, 'KYC already submitted');
      }

      const kyc = new Kyc({
        user: userId,
        name: kycData.name,
        email: kycData.email,
        documentBase64: kycData.document,
        status: 'Pending',
      });

      await kyc.save();
      return kyc;
    } catch (error) {
      console.error(error);
      if (error instanceof HttpError) {
        throw error;  
      }
      throw new HttpError(500, 'Error submitting KYC');
    }
  }


   async getKycStatus(user: string): Promise<any> {
    try {
      const kyc = await Kyc.findOne({ user },{_id: 1, name: 1, email: 1, status: 1});
      if (!kyc) {
        throw new HttpError(404, 'KYC not found');
      }
      return kyc;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;  
      }
      throw new HttpError(500, 'Error fetching KYC status');
    }
  }

 
   async updateKycStatus(user: string, status: 'Pending' | 'Approved' | 'Rejected'): Promise<any> {
    try {
      const kyc = await Kyc.findOne({ user }, {_id: 1, name: 1, email: 1, status: 1});
      if (!kyc) {
        throw new HttpError(404, 'KYC not found');
      }

      kyc.status = status;
      await kyc.save();
      return kyc;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;  
      }
      throw new HttpError(500, 'Error updating KYC status');
    }
  }

  
   async getAllKycSubmissions(): Promise<any[]> {
    try {
      const kycSubmissions = await Kyc.find({},{_id: 1, user: 1, name: 1, email: 1, status: 1});
      return kycSubmissions;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;  
      }
      throw new HttpError(500, 'Error fetching KYC submissions');
    }
  }


   async getKpiStats(): Promise<any> {
    try {
      const totalUsers = await User.countDocuments();
      const approved = await Kyc.countDocuments({ status: 'Approved' });
      const rejected = await Kyc.countDocuments({ status: 'Rejected' });
      const pending = await Kyc.countDocuments({ status: 'Pending' });

      return { totalUsers, approved, rejected, pending };
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;  
      }
      throw new HttpError(500, 'Error fetching KPIs');
    }
  }
}