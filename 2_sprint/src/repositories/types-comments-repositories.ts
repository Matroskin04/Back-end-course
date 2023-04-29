import {ObjectId} from "mongodb";

export type commentType = {
    id?: string
    _id?: ObjectId
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    },
    createdAt: string,
    postId: string
}

export type commentOutputType = {
    id: string
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    },
    createdAt: string,
}