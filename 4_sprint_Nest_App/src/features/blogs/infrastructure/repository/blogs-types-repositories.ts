import { ObjectId } from 'mongodb';
import { BlogDocument } from '../../domain/blogs.db.types';

export type BlogType = {
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};

export type BodyBlogType = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type BlogInstanceType = BlogDocument;
