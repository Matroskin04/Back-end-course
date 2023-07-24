import {ObjectId} from "mongodb";

export class CommentsLikesInfoDBType {
    constructor(
        public commentId: ObjectId,
        public userId: ObjectId,
        public statusLike: 'Like' | 'Dislike'
    ) {
    }
}

export type PostsLikesInfoDBType = {
    postId: ObjectId
    userId: ObjectId
    login: string
    addedAt: string
    statusLike: 'Like' | 'Dislike'
}