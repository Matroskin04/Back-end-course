import {CommentViewType} from "../../infrastructure/repositories/repositories-types/comments-types-repositories";
import {ObjectId} from "mongodb";
import {LikesInfoQueryRepository} from "../../infrastructure/queryRepository/likes-info-query-repository";

export function mappingComment(comment: any, myStatus: 'None' | 'Like' | 'Dislike'): CommentViewType {

    return {
        id: comment._id,
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin
        },
        createdAt: comment.createdAt,
        likesInfo: {
            likesCount: comment.likesInfo.likesCount,
            dislikesCount: comment.likesInfo.dislikesCount,
            myStatus
        }
    }
}


export async function mappingCommentForAllDocs(comment: any, userId: ObjectId | null): Promise<CommentViewType> {

    const likesInfoQueryRepository = new LikesInfoQueryRepository();

    let myStatus: 'Like' | 'Dislike' | 'None' = 'None'

    if (userId) {
        const likeInfo = await likesInfoQueryRepository.getLikesInfoByCommentAndUser(comment._id, userId);
        if (likeInfo) {
            myStatus = likeInfo.statusLike;
        }
    }

    return {
        id: comment._id,
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin
        },
        createdAt: comment.createdAt,
        likesInfo: {
            likesCount: comment.likesInfo.likesCount,
            dislikesCount: comment.likesInfo.dislikesCount,
            myStatus: myStatus
        }
    }
}