import { ObjectId } from 'mongodb';
import { HydratedDocument, Model } from 'mongoose';
import { Post } from './posts.entity';

export type PostDBType = {
  _id: ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
  };
};
export type PostDTOType = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export type PostDocument = HydratedDocument<Post>;

export type PostModelType = Model<PostDocument> & PostModelStaticMethodsType;

export type PostModelStaticMethodsType = {
  createInstance: (
    postBody: PostDTOType,
    blogName: string,
    PostModel: PostModelType,
  ) => PostDocument;
};
