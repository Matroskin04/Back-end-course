import { UserDocument } from '../../domain/users.db.types';
import { BannedUserDocument } from '../../domain/users-banned/users-banned.db.types';

export type BodyUserType = {
  login: string;
  email: string;
  password: string;
};

export type UserInstanceType = UserDocument;

export type BannedUserInstanceType = BannedUserDocument;
