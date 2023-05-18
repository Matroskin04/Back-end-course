import {commentsCollection} from "../db";
import {ObjectId} from "mongodb";

export const commentsRepository = {

    async updateComment(id: string, idFromToken: string, content: string): Promise<void> {

        await commentsCollection.updateOne({_id: new ObjectId(id)}, {$set: {content: content}});
        return;
    },

    async deleteComment(id: string): Promise<void> {

        await commentsCollection.deleteOne({_id: new ObjectId(id)});
        return;
    }
}