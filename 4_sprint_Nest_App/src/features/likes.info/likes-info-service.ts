/*
import { injectable } from "inversify";
import {ObjectId} from "mongodb";
import {LikesInfoRepository} from "../../infrastructure/repositories/likes-info-repository";
import {CommentsLikesInfoDBType, PostsLikesInfoDBType} from "../../domain/db-types/likes-info-db-types";


@injectable()
export class LikesInfoService {

    constructor(protected likesInfoRepository: LikesInfoRepository) {
    }

    async createLikeInfoComment(userId: ObjectId, commentId: ObjectId, statusLike: 'Like' | 'Dislike'): Promise<void> {

        const likeInfoOfComment = new CommentsLikesInfoDBType(
            commentId,
            userId,
            statusLike
        )

        await this.likesInfoRepository.createLikeInfoComment(likeInfoOfComment);
        return;
    }

    async createLikeInfoPost(userId: ObjectId, postId: ObjectId, login: string, statusLike: 'Like' | 'Dislike'): Promise<void> {

        const likeInfoOfPost = new PostsLikesInfoDBType(
            postId,
            userId,
            login,
            new Date().toISOString(),
            statusLike
        )

        await this.likesInfoRepository.createLikeInfoPost(likeInfoOfPost);
        return;
    }

    async updateLikeInfoComment(userId: ObjectId, commentId: ObjectId, statusLike: 'Like' | 'Dislike'): Promise<boolean> {

        return this.likesInfoRepository.updateLikeInfoComment(userId, commentId, statusLike);
    }

    async updateLikeInfoPost(userId: ObjectId, postId: ObjectId, statusLike: 'Like' | 'Dislike' | 'None'): Promise<boolean> {

        return this.likesInfoRepository.updateLikeInfoPost(userId, postId, statusLike);
    }

    async deleteLikeInfoComment(userId: ObjectId, commentId: ObjectId): Promise<boolean> {

        return this.likesInfoRepository.deleteLikeInfoComment(userId, commentId);
    }

    async deleteLikeInfoPost(userId: ObjectId, postId: ObjectId): Promise<boolean> {

        return this.likesInfoRepository.deleteLikeInfoComment(userId, postId);
    }
}*/
