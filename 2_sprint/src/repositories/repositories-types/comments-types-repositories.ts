import {ObjectId} from "mongodb";

export type CommentType = {
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    },
    createdAt: string
    postId: string
}

export type CommentTypeWith_Id = CommentType & {_id: ObjectId}

export type CommentOutputType = {
    id: string
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    },
    createdAt: string,
}