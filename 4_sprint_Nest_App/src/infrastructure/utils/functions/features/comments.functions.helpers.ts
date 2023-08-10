import { CommentViewType } from '../../../../features/comments/infrastructure/repository/comments.types.repositories';
import { CommentDBType } from '../../../../features/comments/domain/comments.db.types';
import { ObjectId } from 'mongodb';
import { LikesInfoQueryRepository } from '../../../../features/likes-info/infrastructure/query.repository/likes-info.query.repository';
import { StatusOfLike } from '../../../../features/comments/infrastructure/query.repository/comments.types.query.repository';

export function mappingComment(
  comment: any,
  myStatus: StatusOfLike,
): CommentViewType {
  return {
    id: comment._id,
    content: comment.content,
    commentatorInfo: {
      userId: comment.commentatorInfo.userId,
      userLogin: comment.commentatorInfo.userLogin,
    },
    createdAt: comment.createdAt,
    likesInfo: {
      likesCount: comment.likesInfo.likesCount,
      dislikesCount: comment.likesInfo.dislikesCount,
      myStatus,
    },
  };
}

export async function mappingCommentForAllDocs(
  comment: CommentDBType,
  userId: ObjectId | null,
  likesInfoQueryRepository: LikesInfoQueryRepository,
): Promise<CommentViewType> {
  let myStatus: StatusOfLike = 'None';

  if (userId) {
    const likeInfo =
      await likesInfoQueryRepository.getLikesInfoByCommentAndUser(
        comment._id.toString(),
        userId.toString(),
      );
    if (likeInfo) {
      myStatus = likeInfo.statusLike;
    }
  }

  return {
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: {
      userId: comment.commentatorInfo.userId,
      userLogin: comment.commentatorInfo.userLogin,
    },
    createdAt: comment.createdAt,
    likesInfo: {
      likesCount: comment.likesInfo.likesCount,
      dislikesCount: comment.likesInfo.dislikesCount,
      myStatus: myStatus,
    },
  };
}
