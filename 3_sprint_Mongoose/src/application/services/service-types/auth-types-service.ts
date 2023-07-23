import {ObjectId} from "mongodb";

export type ARTokensAndUserId = {
    accessToken: string;
    refreshToken: string
    userId: ObjectId
}

export type UserInformation = {
    email: string
    login: string
    userId: string
}