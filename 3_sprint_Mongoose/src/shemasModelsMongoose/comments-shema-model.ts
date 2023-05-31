import mongoose from "mongoose";
import {WithId} from "mongodb";
import {CommentType} from "../repositories/repositories-types/comments-types-repositories";

export const CommentSchema = new mongoose.Schema<WithId<CommentType>>({
    content: {type: String, required: true},
    commentatorInfo: {
        userId: {type: String, required: true},
        userLogin: {type: String, required: true},
    },
    createdAt: {type: String, required: true},
    postId: {type: String, required: true},
});
export const CommentModel = mongoose.model<WithId<CommentType>>('comments', CommentSchema);