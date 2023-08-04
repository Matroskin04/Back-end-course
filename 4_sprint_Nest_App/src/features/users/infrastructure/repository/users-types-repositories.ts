import { UserDocument } from '../../domain/users-db-types';

export type BodyUserType = {
  login: string;
  email: string;
  password: string;
};

export type UserInstanceType = UserDocument;
