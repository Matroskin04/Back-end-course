import {PostDBType} from "../../../domain/db-types/posts-db-types";

export type PostType = {
    title:	string
    shortDescription:	string
    content:	string
    blogId:	string
    blogName:	string
    createdAt: string
}

export type PostTypeWithId = PostType & {id: string}

export type NewestLikesType = Array<{
    addedAt: string
    userId: string
    login: string
}>

export type PostViewType = PostTypeWithId & {
    extendedLikesInfo: {
        likesCount: number
        dislikesCount: number
        myStatus: 'None'| 'Like' | 'Dislike'
        newestLikes: NewestLikesType
    }
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

