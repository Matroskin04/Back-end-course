import {ObjectId} from "mongodb";

export type UserType = {
    login: string
    email: string
    createdAt: string
    passwordHash: string
}

export type UserTypeWith_Id = UserType & {_id: ObjectId}

export type UserOutPutType = {
    id: string
    login: string
    email: string
    createdAt: string
}

export type BodyUserType = {
    login: string
    email: string
    password: string
}



