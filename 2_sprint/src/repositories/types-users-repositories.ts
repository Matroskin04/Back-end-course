import {ObjectId} from "mongodb";

export type userType = {
    id?: string
    _id?: ObjectId
    login: string
    email: string
    createdAt: string
    passwordHash: string
}

export type userOutPutType = {
    id?: string
    login: string
    email: string
    createdAt: string
}

export type bodyUserType = {
    login: string
    email: string
    password: string
}

export type userTypeWithoutPass = {
    login: string
    email: string
    createdAt: string
}


