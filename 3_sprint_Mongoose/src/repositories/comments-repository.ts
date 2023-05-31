import {ObjectId} from "mongodb";
import {CommentModel} from "../shemasModelsMongoose/comments-shema-model";
import {CommentDBType} from "../types/types";

export const commentsRepository = {

    async updateComment(id: string, idFromToken: string, content: string): Promise<void> {

        await CommentModel.updateOne({_id: new ObjectId(id)}, {$set: {content: content}});
        return;
    },

    async deleteComment(id: string): Promise<void> {

        await CommentModel.deleteOne({_id: new ObjectId(id)});
        return;
    },

    async createCommentByPostId(comment: CommentDBType): Promise<void> {

        await CommentModel.create(comment);
        return;
    },
}