import {ObjectId} from "mongodb";

export class LikesInfoDBType {
    constructor(
        public commentId: ObjectId,
        public userId: ObjectId,
        public statusLike: 'Like' | 'Dislike'
    ) {
    }
}