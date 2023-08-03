/*
import { injectable } from "inversify";
import {ObjectId} from "mongodb";
import {CommentsLikesInfoModel, PostsLikesInfoModel} from "../../domain/likes-info-schema-models";
import {CommentsLikesInfoDBType, PostsLikesInfoDBType} from "../../domain/db-types/likes-info-db-types";
import {NewestLikesType} from "../repositories/repositories-types/posts-types-repositories";


@injectable()
export class LikesInfoQueryRepository {

    async getLikesInfoByCommentAndUser(commentId: ObjectId, userId: ObjectId): Promise<CommentsLikesInfoDBType | null> {

        return CommentsLikesInfoModel.findOne({commentId, userId});
    }

    async getLikesInfoByPostAndUser(postId: ObjectId, userId: ObjectId): Promise<PostsLikesInfoDBType | null> {

        return PostsLikesInfoModel.findOne({postId, userId});
    }

    async getNewestLikesOfPost(postId: ObjectId): Promise<NewestLikesType> {

        return PostsLikesInfoModel
            .find({postId, statusLike: 'Like'})
            .sort({addedAt: -1})
            .limit(3)
            .lean();
    }
}*/
