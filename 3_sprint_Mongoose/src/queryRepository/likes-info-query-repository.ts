import {ObjectId} from "mongodb";
import {LikesInfoModel} from "../db/shemasModelsMongoose/likes-info-schema-model";

export class LikesInfoQueryRepository {

    async getLikesInfoByCommentAndUser(commentId: ObjectId, userId: ObjectId) { //todo типизация

        return LikesInfoModel.findOne({commentId, userId});
    }
}