/*
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

export const CommentsLikesInfoModel = mongoose.model<CommentsLikesInfoDBType>('LikesInfoComments', CommentsLikesInfoSchema);

const PostsLikesInfoSchema = new mongoose.Schema<PostsLikesInfoDBType>({
    postId: {type: ObjectId, required: true},
    userId: {type: ObjectId, required: true},
    login: {type: String, required: true},
    addedAt: {type: String, required: true},
    statusLike: {
        type: String,
        required: true,
        enum: ['Like', 'Dislike', 'None']
    }
});
export const PostsLikesInfoModel = mongoose.model<PostsLikesInfoDBType>('LikesInfoPosts', PostsLikesInfoSchema);
*/
