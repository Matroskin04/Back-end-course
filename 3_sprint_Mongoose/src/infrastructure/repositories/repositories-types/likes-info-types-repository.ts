import {ObjectId} from "mongodb";

export type LikeInfoType = {
    commentId: ObjectId
    userId: ObjectId
    statusLike: 'Like' | 'Dislike'
}