import {ObjectId} from "mongodb";
import {CommentModel} from "../db/shemasModelsMongoose/comments-schema-model";
import {CommentDBType} from "../types/db-types";
import {LikeStatus} from "../helpers/enums/like-status";

export class CommentsRepository {

    async updateComment(id: string, idFromToken: string, content: string): Promise<void> {

        await CommentModel.updateOne({_id: new ObjectId(id)}, {$set: {content: content}});
        return;
    }

    async deleteComment(id: string): Promise<void> {

        await CommentModel.deleteOne({_id: new ObjectId(id)});
        return;
    }

    async createCommentByPostId(comment: CommentDBType): Promise<void> {

        await CommentModel.create(comment);
        return;
    }

    async updateLikeStatusOfComment(_id: string, likeStatus: LikeStatus): Promise<boolean> {

        const result = await CommentModel.updateOne({_id}, {$set: {myStatus: likeStatus}});
        return result.modifiedCount === 1;
    }
}
