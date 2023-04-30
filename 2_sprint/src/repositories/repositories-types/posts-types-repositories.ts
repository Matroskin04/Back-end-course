import {ObjectId} from "mongodb";

export type PostType = {
    title:	string
    shortDescription:	string
    content:	string
    blogId:	string
    blogName:	string
    createdAt: string
}

export type PostTypeWithId = {
    id:	string
    title:	string
    shortDescription:	string
    content:	string
    blogId:	string
    blogName:	string
    createdAt: string
}

export type PostTypeWith_Id = {
    _id: ObjectId
    title:	string
    shortDescription:	string
    content:	string
    blogId:	string
    blogName:	string
    createdAt: string
}

export type BodyPostType = {
    title:	string
    shortDescription:	string
    content:	string
    blogId:	string
}

export type BodyPostByBlogIdType = {
    title:	string
    shortDescription:	string
    content:	string
}

