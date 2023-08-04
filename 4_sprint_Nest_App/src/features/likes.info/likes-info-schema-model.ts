import { ObjectId } from 'mongodb';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  BlogDocument,
  BlogDTOType,
  BlogModelType,
} from '../blogs/domain/blogs.db.types';
import { Blog, BlogSchema } from '../blogs/domain/blogs-schema-model';
import {
  CommentsLikesInfoDBType,
  CommentLikesInfoDocument,
  CommentsLikesInfoDTOType,
  CommentsLikesInfoModelType,
  PostsLikesInfoDBType,
  PostLikesInfoDocument,
  PostsLikesInfoDTOType,
  PostsLikesInfoModelType,
} from './likes-info-db-types';

@Schema()
export class CommentsLikesInfo {
  _id: ObjectId;

  @Prop({ type: ObjectId, required: true })
  commentId: ObjectId;

  @Prop({ type: ObjectId, required: true })
  userId: ObjectId;

  @Prop({ required: true, enum: ['Like', 'Dislike'] })
  statusLike: 'Like' | 'Dislike';

  static createInstance(
    commentLikesInfoDTO: CommentsLikesInfoDTOType,
    CommentsLikesInfoModel: CommentsLikesInfoModelType,
  ): CommentLikesInfoDocument {
    return new CommentsLikesInfoModel(commentLikesInfoDTO);
  }
}

export const CommentsLikesInfoSchema =
  SchemaFactory.createForClass(CommentsLikesInfo);

CommentsLikesInfoSchema.statics = {
  createInstance: CommentsLikesInfo.createInstance,
};

@Schema()
export class PostsLikesInfo {
  _id: ObjectId;

  @Prop({ type: ObjectId, required: true })
  postId: { type: ObjectId; required: true };

  @Prop({ type: ObjectId, required: true })
  userId: { type: ObjectId; required: true };

  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  addedAt: string;

  @Prop({ required: true, enum: ['Like', 'Dislike', 'None'] })
  statusLike: 'Like' | 'Dislike';

  static createInstance(
    commentLikesInfoDTO: PostsLikesInfoDTOType,
    CommentsLikesInfoModel: PostsLikesInfoModelType,
  ): PostLikesInfoDocument {
    return new CommentsLikesInfoModel(commentLikesInfoDTO);
  }
}
export const PostsLikesInfoSchema =
  SchemaFactory.createForClass(PostsLikesInfo);

PostsLikesInfoSchema.statics = {
  createInstance: PostsLikesInfo.createInstance,
};
