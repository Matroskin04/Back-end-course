/*
import mongoose from 'mongoose';
import { UserDBType } from './db-types/users-db-types';

export const UserSchema = new mongoose.Schema<UserDBType>({
  login: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: String, required: true },
  passwordHash: { type: String, required: true },
  emailConfirmation: {
    confirmationCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    isConfirmed: { type: Boolean, required: true },
  },
  passwordRecovery: {
    confirmationCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
  // },
});
export const UserModel = mongoose.model<UserDBType>('users', UserSchema);
*/
