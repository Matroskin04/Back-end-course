import { ObjectId } from 'mongodb';

export type ViewAllBlogsModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Array<BlogSAOutputType>;
};

export type BlogSAOutputType = { id: ObjectId } & BlogBodyType;

export type BlogSAOutputDBType = {
  _id: ObjectId;
} & BlogBodyType;

type BlogBodyType = {
  name: string;

  description: string;

  websiteUrl: string;

  createdAt: string;

  isMembership: boolean;

  blogOwnerInfo: {
    userId: string;
    userLogin: string;
  };
};
