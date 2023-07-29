import { CommentViewType } from '../../posts/infrastructure/repository/comments-types-repositories';
import { ObjectId } from 'mongodb';
import { LikesInfoQueryRepository } from '../../infrastructure/queryRepositories/likes-info-query-repository';
import { CommentDBType } from '../../domain/db-types/comments-db-types';

export function mappingComment(
  comment: any,
  myStatus: 'None' | 'Like' | 'Dislike',
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
): Promise<CommentViewType> {
  const likesInfoQueryRepository = new LikesInfoQueryRepository();

  let myStatus: 'Like' | 'Dislike' | 'None' = 'None';

  if (userId) {
    const likeInfo =
      await likesInfoQueryRepository.getLikesInfoByCommentAndUser(
        comment._id,
        userId,
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
