import { ObjectId } from 'mongodb';

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
