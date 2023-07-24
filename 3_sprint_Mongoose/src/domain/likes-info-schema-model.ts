import mongoose from "mongoose";
import {ObjectId} from "mongodb";
import {CommentsLikesInfoDBType, PostsLikesInfoDBType} from "./db-types/likes-info-db-types";

const CommentsLikesInfoSchema = new mongoose.Schema<CommentsLikesInfoDBType>({
    commentId: {type: ObjectId, required: true},
    userId: {type: ObjectId, required: true},
    statusLike: {
        type: String,
        required: true,
        enum: ['Like', 'Dislike']
    }
});
export const CommentsLikesInfoModel = mongoose.model<CommentsLikesInfoDBType>('LikesInfo', CommentsLikesInfoSchema);

const PostsLikesInfoSchema = new mongoose.Schema<PostsLikesInfoDBType>({
    postId: {type: ObjectId, required: true},
    userId: {type: ObjectId, required: true},
    login: {type: String, required: true},
    addedAt: {type: String, required: true},
    statusLike: {
        type: String,
        required: true,
        enum: ['Like', 'Dislike']
    }
});
export const PostsLikesInfoModel = mongoose.model<PostsLikesInfoDBType>('LikesInfo', PostsLikesInfoSchema);
