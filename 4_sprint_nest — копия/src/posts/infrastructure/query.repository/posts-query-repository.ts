import { PostPaginationType } from './posts-types-query-repository';
import { PostViewType } from '../../../infrastructure/repositories/repositories-types/posts-types-repositories';
import { ObjectId } from 'mongodb';
import { QueryPostModel } from '../../api/models/QueryPostModel';
import { variablesForReturn } from '../../../infrastructure/queryRepositories/utils/variables-for-return';
import { QueryBlogModel } from '../../../blogs/api/models/QueryBlogModel';
import { PostsOfBlogPaginationType } from '../../../blogs/infrastructure/query.repository/blogs-types-query-repository';
import { PostModel } from '../../domain/posts-schema-model';
import {
  mappingPostForAllDocs,
  renameMongoIdPost,
} from '../../../helpers/functions/posts-functions-helpers';
import { StatusOfLike } from '../../../infrastructure/queryRepositories/query-repository-types/comments-types-query-repository';
import { BlogsQueryRepository } from '../../../blogs/infrastructure/query.repository/blogs-query-repository';
import { Injectable } from '@nestjs/common';
import { PostDBType } from '../../domain/posts-db-types';

@Injectable()
export class PostsQueryRepository {
  constructor(
    // protected likesInfoQueryRepository: LikesInfoQueryRepository,
    protected blogQueryRepository: BlogsQueryRepository,
  ) {}

  async getAllPosts(
    query: QueryPostModel,
    userId: ObjectId | null,
  ): Promise<PostPaginationType> {
    const searchNameTerm: string | null = query?.searchNameTerm ?? null;
    const paramsOfElems = await variablesForReturn(query);

    const countAllPostsSort = await PostModel.countDocuments({
      title: { $regex: searchNameTerm ?? '', $options: 'i' },
    });

    const allPostsOnPages = await PostModel.find({
      title: { $regex: searchNameTerm ?? '', $options: 'i' },
    })
      .skip((+paramsOfElems.pageNumber - 1) * +paramsOfElems.pageSize)
      .limit(+paramsOfElems.pageSize)
      .sort(paramsOfElems.paramSort)
      .lean();

    const allPosts = await Promise.all(
      allPostsOnPages.map(async (p) => mappingPostForAllDocs(p, userId)),
    );

    return {
      pagesCount: Math.ceil(countAllPostsSort / +paramsOfElems.pageSize),
      page: +paramsOfElems.pageNumber,
      pageSize: +paramsOfElems.pageSize,
      totalCount: countAllPostsSort,
      items: allPosts,
    };
  }

  async getPostsOfBlog(
    blogId: string,
    query: QueryBlogModel,
    // userId: ObjectId | null,
  ): Promise<null | PostsOfBlogPaginationType> {
    //Проверка есть ли блог
    const blog = await this.blogQueryRepository.getBlogById(blogId);
    if (!blog) {
      return null;
    }

    const paramsOfElems = await variablesForReturn(query);
    const countAllPostsSort = await PostModel.countDocuments({
      blogId: blogId,
    });

    const allPostsOnPages = await PostModel.find({ blogId: blogId })
      .skip((+paramsOfElems.pageNumber - 1) * +paramsOfElems.pageSize)
      .limit(+paramsOfElems.pageSize)
      .sort(paramsOfElems.paramSort)
      .lean();

    if (allPostsOnPages.length === 0) return null;

    const allPostsOfBlog = await Promise.all(
      allPostsOnPages.map(async (p) => mappingPostForAllDocs(p)), //2 parameter = userId
      //todo type!!!
    );
    return {
      pagesCount: Math.ceil(countAllPostsSort / +paramsOfElems.pageSize),
      page: +paramsOfElems.pageNumber,
      pageSize: +paramsOfElems.pageSize,
      totalCount: countAllPostsSort,
      items: allPostsOfBlog,
    };
  }

  async getPostById(
    postId: string,
    userId: ObjectId | null,
  ): Promise<null | PostViewType> {
    const post = await PostModel.findOne({ _id: new ObjectId(postId) });
    if (!post) {
      return null;
    }

    //set StatusLike
    let myStatus: StatusOfLike = 'None';
    if (userId) {
      const likeInfo =
        await this.likesInfoQueryRepository.getLikesInfoByPostAndUser(
          new ObjectId(postId),
          userId,
        );

      if (likeInfo) {
        myStatus = likeInfo.statusLike;
      }
    }

    //find last 3 Likes
    const newestLikes =
      await this.likesInfoQueryRepository.getNewestLikesOfPost(
        new ObjectId(postId),
      );
    const reformedNewestLikes = reformNewestLikes(newestLikes);

    return renameMongoIdPost(post, reformedNewestLikes, myStatus);
  }
}
