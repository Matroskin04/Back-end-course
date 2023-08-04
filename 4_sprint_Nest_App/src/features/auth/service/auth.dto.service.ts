import { ObjectId } from 'mongodb';

export type ARTokensAndUserId = {
  accessToken: string;
  refreshToken: string;
  userId: ObjectId;
};
