import { ObjectId } from 'mongodb';
import { UserDBType } from '../../../users/domain/users.db.types';

export type ARTokensAndUserIdType = {
  accessToken: string;
  refreshToken: string;
  userId: ObjectId;
};

export class UserInfoType {
  email: string;
  login: string;
  userId: string;
}

export type ErrorsTypeService = {
  errorsMessages: Array<{
    message: string;
    field: string;
  }>;
};

export type UserDBServiceType = {
  _id: ObjectId;
  login: string;
  email: string;
  createdAt: string;
  passwordHash: string;
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
  };
  passwordRecovery: {
    confirmationCode: string;
    expirationDate: Date;
  };
  banInfo: {
    isBanned: boolean;
    banDate: string | null;
    banReason: string | null;
  };
};
