import {ObjectId} from "mongodb";

export type CommentType = {
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    },
    createdAt: string,
    postId: string
}

export type CommentTypeWith_Id = {
    _id: ObjectId
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    },
    createdAt: string,
    postId: string
}

export type CommentOutputType = {
    id: string
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    },
    createdAt: string,
}