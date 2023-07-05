import {ObjectId} from "mongodb";
import {PostType} from "../repositories/repositories-types/posts-types-repositories";
import {CommentType} from "../repositories/repositories-types/comments-types-repositories";
import {BlogType} from "../repositories/repositories-types/blogs-types-repositories";
import {DeviceType} from "../repositories/repositories-types/devices-types-repositories";

export class UserDBType {
    constructor(public _id: ObjectId,
                public login: string,
                public email: string,
                public createdAt: string,
                public passwordHash: string,
                public emailConfirmation: {
                    confirmationCode: string
                    expirationDate: Date
                    isConfirmed: boolean
                },
                public passwordRecovery: {
                    confirmationCode: string
                    expirationDate: Date
                }) {
    }
}

export type PostDBType = PostType & { _id: ObjectId };

export type CommentDBType = CommentType & { _id: ObjectId };

export type BlogDBType = BlogType & { _id: ObjectId };

export type DeviceDBType = DeviceType & { _id: ObjectId }

