import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  role: 'Admin' | 'User';
  createdAt: Date;
  comparePassword(password: string): Promise<boolean>; 
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


UserSchema.pre<User>('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10); 
    next();
  } catch (err: any) {
    next(err);
  }
});


UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password as string); 
};

export default mongoose.model<User>('User', UserSchema);