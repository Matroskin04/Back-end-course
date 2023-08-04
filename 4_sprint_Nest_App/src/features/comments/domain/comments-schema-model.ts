import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import {
  LikesInfo,
  LikesInfoSchema,
} from '../../posts/domain/posts-schema-model';

@Schema()
export class CommentatorInfo {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  userLogin: string;
}
export const CommentatorInfoSchema =
  SchemaFactory.createForClass(CommentatorInfo);
@Schema()
export class Comment {
  _id: ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ type: CommentatorInfoSchema, required: true }) //todo create addition schema?
  commentatorInfo: CommentatorInfo;

  @Prop({ required: true })
  createdAt: string;

  @Prop({ required: true })
  postId: string;

  @Prop({ type: LikesInfoSchema, required: true }) //todo перенести из постов схему лайкинфо?
  likesInfo: LikesInfo;
}
export const CommentSchema = SchemaFactory.createForClass(Comment);
