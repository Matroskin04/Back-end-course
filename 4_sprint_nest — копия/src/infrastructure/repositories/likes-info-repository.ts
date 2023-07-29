/*
import {CommentsLikesInfoModel, PostsLikesInfoModel} from "../../domain/likes-info-schema-model";
import {LikeInfoCommentType, LikeInfoPostType} from "./repositories-types/likes-info-types-repository";
import {ObjectId} from "mongodb";
import { injectable } from "inversify";

@injectable()
export class LikesInfoRepository {

    async createLikeInfoComment(likeInfo: LikeInfoCommentType): Promise<void> {

        const likesInfoInstance = new CommentsLikesInfoModel(likeInfo);
        await likesInfoInstance.save();

        return;
    }

    async createLikeInfoPost(likeInfo: LikeInfoPostType): Promise<void> {

        const likesInfoInstance = new PostsLikesInfoModel(likeInfo);
        await likesInfoInstance.save();

        return;
    }

    async updateLikeInfoComment(userId: ObjectId, commentId: ObjectId, statusLike: 'Like' | 'Dislike'): Promise<boolean> {

        const result = await CommentsLikesInfoModel.updateOne({userId, commentId}, {statusLike});
        return result.modifiedCount === 1;
    }

    async updateLikeInfoPost(userId: ObjectId, postId: ObjectId, statusLike: 'Like' | 'Dislike' | 'None'): Promise<boolean> {

        const result = await PostsLikesInfoModel.updateOne({userId, postId}, {statusLike});
        return result.modifiedCount === 1;
    }

    async deleteLikeInfoComment(userId: ObjectId, commentId: ObjectId): Promise<boolean> {

        const result = await CommentsLikesInfoModel.deleteMany({userId, commentId});
        return result.deletedCount >= 1;
    }
}*/
