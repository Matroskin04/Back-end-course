import mongoose from "mongoose";
import {CommentDBType} from "./db-types/comments-db-types";

export const CommentSchema = new mongoose.Schema<CommentDBType>({
    content: {type: String, required: true},
    commentatorInfo: {
        userId: {type: String, required: true},
        userLogin: {type: String, required: true},
    },
    createdAt: {type: String, required: true},
    postId: {type: String, required: true},
    likesInfo: {
        likesCount: {type: Number, required: true},
        dislikesCount: {type: Number, required: true}
    }
});
export const CommentModel = mongoose.model<CommentDBType>('comments', CommentSchema);