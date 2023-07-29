import {
  BlogDataForUpdatingType,
  BlogDocument,
  BlogModelType,
} from './blogs.db.types';
import { ObjectId } from 'mongodb';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BlogViewType } from '../infrastructure/query.repository/blogs-types-query-repository';

@Schema()
export class Blog {
  _id: ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  websiteUrl: string;

  @Prop({ required: true, default: new Date().toISOString() })
  createdAt: string;

  @Prop({ type: Boolean, required: true, default: false })
  isMembership: boolean;

  renameIntoViewModel(): BlogViewType {
    return {
      id: this._id,
      name: this.name,
      description: this.description,
      websiteUrl: this.websiteUrl,
      createdAt: this.createdAt,
      isMembership: this.isMembership,
    };
  }

  updateBlogInfo(
    blog: BlogDocument,
    updateData: BlogDataForUpdatingType,
  ): void {
    blog.name = updateData.name;
    blog.description = updateData.description;
    blog.websiteUrl = updateData.websiteUrl;
    return;
  }

  static createInstance(
    blogDTO: BlogDataForUpdatingType,
    BlogModel: BlogModelType,
  ): BlogDocument {
    return new BlogModel(blogDTO);
  }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

BlogSchema.methods = {
  renameIntoViewModel: Blog.prototype.renameIntoViewModel,
  updateBlogInfo: Blog.prototype.updateBlogInfo,
};
BlogSchema.statics = {
  makeInstance: Blog.createInstance,
};
