import { ObjectId } from 'mongodb';
import { HydratedDocument, Model } from 'mongoose';
import { User } from './users-schema-model';

export type UserDBType = {
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
};

export type UserDTOType = {
  login: string;
  email: string;
  password: string;
};

export type UserDocument = HydratedDocument<User>;

export type UserModelType = Model<UserDocument> & UserModelStaticMethodsType;

export type UserModelStaticMethodsType = {
  createInstance: (
    userDTO: UserDTOType,
    UserModel: UserModelType,
  ) => UserDocument;
};
