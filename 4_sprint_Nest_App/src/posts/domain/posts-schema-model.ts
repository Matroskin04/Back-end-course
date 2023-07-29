import { ObjectId } from 'mongodb';
import { BodyPostType } from '../../infrastructure/repositories/repositories-types/posts-types-repositories';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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

  static createInstance(postBody: BodyPostType, blogName: string, PostModel) {
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
  }
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.statics = {
  createInstance: Post.createInstance,
};
