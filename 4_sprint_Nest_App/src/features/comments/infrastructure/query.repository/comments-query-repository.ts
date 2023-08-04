import { ObjectId } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { PostsQueryRepository } from '../../../posts/infrastructure/query.repository/posts-query-repository';
import { CommentViewType } from '../repository/comments-types-repositories';
import { InjectModel } from '@nestjs/mongoose';
import { CommentModelType } from '../../domain/comments-db-types';
import { QueryPostModel } from '../../../posts/api/models/QueryPostModel';
import { CommentOfPostPaginationType } from '../../../posts/infrastructure/query.repository/posts-types-query-repository';
import { variablesForReturn } from '../../../../infrastructure/queryRepositories/utils/variables-for-return';
import {
  mappingComment,
  mappingCommentForAllDocs,
} from '../../../../helpers/functions/comments-functions-helpers';
import { StatusOfLike } from './comments-types-query-repository';
import { Comment } from '../../domain/comments-schema-model';
import { LikesInfoQueryRepository } from '../../../likes.info/likes-info-query-repository';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: CommentModelType,
    protected postsQueryRepository: PostsQueryRepository,
    protected likesInfoQueryRepository: LikesInfoQueryRepository,
  ) {}

  async getCommentById(
    commentId: string,
    userId: ObjectId | null,
  ): Promise<CommentViewType | null> {
    const comment = await this.CommentModel.findOne({
      _id: new ObjectId(commentId),
    });
    if (!comment) {
      return null;
    }

    let myStatus: StatusOfLike = 'None';
    if (userId) {
      const likeInfo =
        await this.likesInfoQueryRepository.getLikesInfoByCommentAndUser(
          new ObjectId(commentId),
          userId,
        );

      if (likeInfo) {
        myStatus = likeInfo.statusLike;
      }
    }

    return mappingComment(comment, myStatus);
  }

  async getCommentsOfPost(
    postId: string,
    query: QueryPostModel,
    userId: ObjectId | null,
  ): Promise<CommentOfPostPaginationType | null> {
    const post = await this.postsQueryRepository.getPostById(postId, userId);
    if (!post) {
      return null;
    }

    const paramsOfElems = await variablesForReturn(query);
    const countAllCommentsOfPost = await this.CommentModel.countDocuments({
      postId: postId,
    });

    const allCommentsOfPostOnPages = await this.CommentModel.find({
      postId: postId,
    })
      .skip((+paramsOfElems.pageNumber - 1) * +paramsOfElems.pageSize)
      .limit(+paramsOfElems.pageSize)
      .sort(paramsOfElems.paramSort)
      .lean();

    const allCommentsOfPost = await Promise.all(
      allCommentsOfPostOnPages.map(async (p) =>
        mappingCommentForAllDocs(p, userId, this.likesInfoQueryRepository),
      ),
    );

    return {
      pagesCount: Math.ceil(countAllCommentsOfPost / +paramsOfElems.pageSize),
      page: +paramsOfElems.pageNumber,
      pageSize: +paramsOfElems.pageSize,
      totalCount: countAllCommentsOfPost,
      items: allCommentsOfPost,
    };
  }
}
