import mongoose from "mongoose";
import {WithId} from "mongodb";
import {UserType} from "../repositories/repositories-types/users-types-repositories";

export const UserSchema = new mongoose.Schema<WithId<UserType>>({
    login: {type: String, required: true},
    email: {type: String, required: true},
    createdAt: {type: String, required: true},
    passwordHash: {type: String, required: true},
    emailConfirmation: {
        confirmationCode: {type: String, required: true},
        expirationDate: {type: Date, required: true},
        isConfirmed: {type: Boolean, required: true},
    },
    passwordRecovery: {
        confirmationCode: {type: String, required: true},
        expirationDate: {type: Date, required: true},
    }
});
export const UserModel = mongoose.model<WithId<UserType>>('users', UserSchema);