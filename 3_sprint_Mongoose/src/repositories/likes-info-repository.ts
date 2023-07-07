import {LikesInfoModel} from "../db/shemasModelsMongoose/likes-info-schema-model";
import {LikeInfoType} from "./repositories-types/likes-info-types-repository";
import {ObjectId} from "mongodb";

export class LikesInfoRepository {

    async createLikeInfoComment(likeInfo: LikeInfoType): Promise<void> {

        await LikesInfoModel.create(likeInfo);
        return;
    }

    async updateLikeInfoComment(userId: ObjectId, commentId: ObjectId, statusLike: 'Like' | 'Dislike'): Promise<boolean> {

        const result = await LikesInfoModel.updateOne({userId, commentId}, {statusLike});
        return result.modifiedCount === 1;
    }

    async deleteLikeInfoComment(userId: ObjectId, commentId: ObjectId): Promise<boolean> {

        const result = await LikesInfoModel.deleteOne({userId, commentId});
        return result.deletedCount === 1;
    }
}