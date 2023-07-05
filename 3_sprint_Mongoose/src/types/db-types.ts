import {ObjectId} from "mongodb";
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

export class PostDBType {
    constructor(public _id: ObjectId,
                public title: string,
                public shortDescription: string,
                public content: string,
                public blogId: string,
                public blogName: string,
                public createdAt: string
    ) {
    }
}

export class CommentDBType {
    constructor(
        public _id: ObjectId,
        public content: string,
        public commentatorInfo: {
            userId: string
            userLogin: string
        },
        public createdAt: string,
        public postId: string
    ) {
    }
}


export class BlogDBType {
    constructor(
        public _id: ObjectId,
        public name: string,
        public description: string,
        public websiteUrl: string,
        public createdAt: string,
        public isMembership: boolean
    ) {}
}


export type DeviceDBType = DeviceType & { _id: ObjectId }

