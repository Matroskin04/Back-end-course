import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { CommentDBType } from '../../../comments/domain/comments.db.types';
import {
  CommentsLikesInfoDBType,
  PostsLikesInfoDBType,
} from '../../../likes-info/domain/likes-info.db.types';
import { PostDBType } from '../../../posts/domain/posts.db.types';
import {
  LikesInfoSchema,
  PostSchema,
} from '../../../posts/domain/posts.entity';
import {
  CommentsLikesInfoSchema,
  PostsLikesInfoSchema,
} from '../../../likes-info/domain/likes-info.entity';
import { UserDocument, UserDTOType, UserModelType } from '../users.db.types';
import { User, UserSchema } from '../users.entity';
import {
  BannedUserDocument,
  BannedUserDTOType,
  BannedUserModelType,
} from './users-banned.db.types';

@Schema()
export class BannedUser {
  @Prop({ required: true })
  userId: string;

  @Prop({ type: [LikesInfoSchema] || null })
  comments: CommentDBType[] | null;

  @Prop({ type: [PostSchema] || null })
  posts: PostDBType[] | null;

  @Prop({ type: [CommentsLikesInfoSchema] || null })
  commentsLikesInfo: CommentsLikesInfoDBType[] | null;

  @Prop({ type: [PostsLikesInfoSchema] || null })
  postsLikesInfo: PostsLikesInfoDBType[] | null;

  static createInstance(
    bannedUserDTO: BannedUserDTOType,
    BannedUserModel: BannedUserModelType,
  ): BannedUserDocument {
    return new BannedUserModel(bannedUserDTO);
  }
}
export const BannedUserSchema = SchemaFactory.createForClass(BannedUser);

BannedUserSchema.statics = {
  createInstance: BannedUser.createInstance,
};
