import mongoose, { Schema, Document } from 'mongoose';

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  role: 'Admin' | 'User'; 
  createdAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'User'], default: 'User' }
  },
  {
    timestamps: { createdAt: true, updatedAt: true }
  }
);

export default mongoose.model<User>('User', UserSchema);