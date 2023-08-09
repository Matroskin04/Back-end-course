import { ObjectId } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { PostsQueryRepository } from '../../../posts/infrastructure/query.repository/posts.query.repository';
import { CommentViewType } from '../repository/comments.types.repositories';
import { InjectModel } from '@nestjs/mongoose';
import { CommentModelType } from '../../domain/comments.db.types';
import { QueryPostInputModel } from '../../../posts/api/models/input/query-post.input.model';
import {
  CommentOfPostPaginationType,
  PostsDBType,
} from '../../../posts/infrastructure/query.repository/posts.types.query.repository';
import { variablesForReturn } from '../../../../infrastructure/helpers/functions/variables-for-return.function.helper';
import {
  mappingComment,
  mappingCommentForAllDocs,
} from '../../../../infrastructure/helpers/functions/features/comments.functions.helpers';
import {
  CommentsDBType,
  StatusOfLike,
} from './comments.types.query.repository';
import { Comment } from '../../domain/comments.entity';
import { LikesInfoQueryRepository } from '../../../likes-info/infrastructure/query.repository/likes-info.query.repository';

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
    query: QueryPostInputModel,
    userId: ObjectId | null,
  ): Promise<CommentOfPostPaginationType | null> {
    const post = await this.postsQueryRepository.getPostById(
      new ObjectId(postId),
      userId,
    );
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

  async getAllCommentsOfUserDBFormat(
    userId: ObjectId,
  ): Promise<CommentsDBType | null> {
    const comments = await this.CommentModel.find({
      'commentatorInfo.userId': userId,
    }).lean();
    return comments.length ? comments : null; //if length === 0 -> return null
  }
}
