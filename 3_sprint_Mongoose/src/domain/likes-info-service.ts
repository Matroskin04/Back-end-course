import {ObjectId} from "mongodb";
import {LikesInfoRepository} from "../repositories/likes-info-repository";
import {LikesInfoDBType} from "../types/db-types";

export class LikesInfoService {

    constructor(protected likesInfoRepository: LikesInfoRepository) {
    }

    async createLikeInfoComment(userId: ObjectId, commentId: ObjectId, statusLike: 'Like' | 'Dislike'): Promise<void> {

        const likeInfo = new LikesInfoDBType(
            commentId,
            userId,
            statusLike
        )

        await this.likesInfoRepository.createLikeInfoComment(likeInfo);
        return;
    }

    async updateLikeInfoComment(userId: ObjectId, commentId: ObjectId, statusLike: 'Like' | 'Dislike'): Promise<boolean> {

        return this.likesInfoRepository.updateLikeInfoComment(userId, commentId, statusLike);
    }

    async deleteLikeInfoComment(userId: ObjectId, commentId: ObjectId): Promise<boolean> {

        return this.likesInfoRepository.deleteLikeInfoComment(userId, commentId);
    }
}