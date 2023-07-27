import {ObjectId} from "mongodb";

export type BlogType = {
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

export type BlogTypeWithId = BlogType & {id: ObjectId} //todo убрать из репозитория
export type BlogTypeWithMongoId = BlogType & {_id: ObjectId}

export type BodyBlogType = {
    name: string
    description: string
    websiteUrl: string
}


