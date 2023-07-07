import mongoose from "mongoose";
import {LikesInfoDBType} from "../../types/db-types";
import {ObjectId} from "mongodb";

export const LikesInfoSchema = new mongoose.Schema<LikesInfoDBType>({
    commentId: {type: ObjectId, required: true},
    usersStatusLike: [{
        userId: {type: ObjectId, required: true},
        statusLike: {
            type: String,
            required: true,
            enum: ['Like', 'Dislike']
        }
    }]
});

export const LikesInfoModel = mongoose.model<LikesInfoDBType>('likesInfo', LikesInfoSchema);