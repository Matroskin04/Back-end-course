import mongoose from "mongoose";
import {CommentDBType} from "../../types/db-types";

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
    // myStatus: {
    //     type: String,
    //     required: true,
    //     enum: ['None', 'Like', 'Dislike'],
    // }

});
export const CommentModel = mongoose.model<CommentDBType>('comments', CommentSchema);