import {ObjectId} from "mongodb";

export type UserType = {
    login: string
    email: string
    createdAt: string
    passwordHash: string
}

export type UserTypeWith_Id = {
    _id: ObjectId
    login: string
    email: string
    createdAt: string
    passwordHash: string
}

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



