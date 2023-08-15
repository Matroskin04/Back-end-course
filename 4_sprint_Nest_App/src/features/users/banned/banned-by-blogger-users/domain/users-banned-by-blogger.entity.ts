import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import {
  BannedUsersByBloggerDocument,
  BannedUsersByBloggerModelType,
} from './users-banned-by-blogger.db.types';

@Schema()
export class BannedUsersByBlogger {
  @Prop({ required: true })
  blogId: string;

  @Prop({ type: [String] })
  bannedUsers: string[];

  static createInstance(
    blogId: string,
    bannedUsersId: string,
    BannedUserModel: BannedUsersByBloggerModelType,
  ): BannedUsersByBloggerDocument {
    return new BannedUserModel({
      blogId: blogId,
      bannedUsers: [bannedUsersId],
    });
  }
}
export const BannedUsersByBloggerSchema =
  SchemaFactory.createForClass(BannedUsersByBlogger);

BannedUsersByBloggerSchema.statics = {
  createInstance: BannedUsersByBlogger.createInstance,
};
