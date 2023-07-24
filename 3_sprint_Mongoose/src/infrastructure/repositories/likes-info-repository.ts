import {CommentsLikesInfoModel} from "../../domain/likes-info-schema-model";
import {LikeInfoType} from "./repositories-types/likes-info-types-repository";
import {ObjectId} from "mongodb";
import { injectable } from "inversify";

@injectable()
export class LikesInfoRepository {

    async createLikeInfoComment(likeInfo: LikeInfoType): Promise<void> {

        const likesInfoInstance = new CommentsLikesInfoModel(likeInfo);
        await likesInfoInstance.save();

        return;
    }

    async updateLikeInfoComment(userId: ObjectId, commentId: ObjectId, statusLike: 'Like' | 'Dislike'): Promise<boolean> {

        const result = await CommentsLikesInfoModel.updateOne({userId, commentId}, {statusLike});
        return result.modifiedCount === 1;
    }

    async deleteLikeInfoComment(userId: ObjectId, commentId: ObjectId): Promise<boolean> {

        const result = await CommentsLikesInfoModel.deleteMany({userId, commentId});
        return result.deletedCount >= 1;
    }
}