import {ObjectId} from "mongodb";

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