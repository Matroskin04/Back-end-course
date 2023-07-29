import mongoose from 'mongoose';
import { PostDBFullType, PostDBType } from './posts-db-types';
import { ObjectId } from 'mongodb';
import { BodyPostType } from '../../infrastructure/repositories/repositories-types/posts-types-repositories';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

const PostSchema = new mongoose.Schema<PostDBType, PostDBFullType>({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true },
  blogId: { type: String, required: true },
  blogName: { type: String, required: true },
  createdAt: { type: String, required: true },
  likesInfo: {
    likesCount: { type: Number, required: true },
    dislikesCount: { type: Number, required: true },
  },
});

@Schema()
export class LikesInfo {
  @Prop({ type: Number, required: true })
  likesCount: number;

  @Prop({ type: Number, required: true })
  dislikesCount: number;
}

const LikesInfoSchema = SchemaFactory.createForClass(LikesInfo);
@Schema()
export class Post {
  _id: ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  shortDescription: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  blogId: string;

  @Prop({ required: true })
  blogName: string;

  @Prop({ required: true })
  createdAt: string;

  @Prop({ type: LikesInfoSchema, required: true })
  likesInfo: LikesInfo;
}

PostSchema.static(
  'makeInstance',
  function makeInstance(postBody: BodyPostType, blogName: string) {
    return new PostModel({
      _id: new ObjectId(),
      title: postBody.title,
      shortDescription: postBody.shortDescription,
      content: postBody.content,
      blogId: postBody.blogId,
      blogName: blogName,
      createdAt: new Date().toISOString(),
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
      },
    });
  },
);

export const PostModel = mongoose.model<PostDBType, PostDBFullType>(
  'posts',
  PostSchema,
);
