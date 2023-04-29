import {commentsCollection} from "../db";
import {commentOutputType} from "../repositories/types-comments-repositories";
import {mappingComment} from "../domain/comments-service";
import {ObjectId} from "mongodb";

export const commentsQueryRepository = {

    async getCommentById(id: string): Promise<commentOutputType | null> {

        const comment = await commentsCollection.findOne({_id: new ObjectId(id)});
        console.log(comment)
        if (!comment) {
            return null
        }
        return mappingComment(comment)
    }
}