import mongoose, { Schema, Document } from 'mongoose';

export interface KYC extends Document {
  user: mongoose.Schema.Types.ObjectId; 
  name: string;
  email: string;
  documentBase64: string; 
  status: 'Pending' | 'Approved' | 'Rejected'; 
  submittedAt: Date;
}

const KYCSchema: Schema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    documentBase64: { type: String, required: true }, 
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  },
  {
    timestamps: { createdAt: 'submittedAt', updatedAt: false },
  }
);

export default mongoose.model<KYC>('KYC', KYCSchema);