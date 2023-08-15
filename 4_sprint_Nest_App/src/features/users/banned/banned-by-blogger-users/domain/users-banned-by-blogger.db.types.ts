import { HydratedDocument, Model } from 'mongoose';
import { BannedUsersByBlogger } from './users-banned-by-blogger.entity';

export type BannedUsersByBloggerDocument =
  HydratedDocument<BannedUsersByBlogger>;

export type BannedUsersByBloggerModelType =
  Model<BannedUsersByBloggerDocument> & BannedUsersBloggerStaticMethodsType;

export type BannedUsersBloggerStaticMethodsType = {
  createInstance: (
    blogId: string,
    bannedUsersId: string,
    BannedUserModel: BannedUsersByBloggerModelType,
  ) => BannedUsersByBloggerDocument;
};
