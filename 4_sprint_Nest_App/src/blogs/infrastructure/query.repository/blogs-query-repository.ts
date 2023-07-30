import {
  BlogPaginationType,
  BlogViewType,
} from './blogs-types-query-repository';
import { ObjectId } from 'mongodb';
import { QueryBlogModel } from '../../api/models/QueryBlogModel';
import { variablesForReturn } from '../../../infrastructure/queryRepositories/utils/variables-for-return';
import { Blog } from '../../domain/blogs-schema-model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BlogModelType } from '../../domain/blogs.db.types';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
  ) {}
  async getAllBlogs(query: QueryBlogModel): Promise<BlogPaginationType> {
    const searchNameTerm: string | null = query?.searchNameTerm ?? null;
    const paramsOfElems = await variablesForReturn(query);
    if (paramsOfElems.sortBy === 'createdAt') paramsOfElems.sortBy = '_id';

    const countAllBlogsSort = await this.BlogModel.countDocuments({
      name: { $regex: searchNameTerm ?? '', $options: 'i' },
    });

    const allBlogsOnPages = await this.BlogModel.find({
      name: { $regex: searchNameTerm ?? '', $options: 'i' },
    })
      .skip((+paramsOfElems.pageNumber - 1) * +paramsOfElems.pageSize)
      .limit(+paramsOfElems.pageSize)
      .sort(paramsOfElems.paramSort);

    return {
      pagesCount: Math.ceil(countAllBlogsSort / +paramsOfElems.pageSize),
      page: +paramsOfElems.pageNumber,
      pageSize: +paramsOfElems.pageSize,
      totalCount: countAllBlogsSort,
      items: allBlogsOnPages.map((p) => p.modifyIntoViewModel()),
    };
  }

  async getBlogById(id: string): Promise<null | BlogViewType> {
    const blog = await this.BlogModel.findOne({ _id: new ObjectId(id) });

    if (blog) {
      return blog.modifyIntoViewModel();
    }
    return null;
  }
}
