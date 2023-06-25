import {usersRepository} from "../repositories/users-repository";
import {
    BodyUserType,
    UserOutPutType,
} from "../repositories/repositories-types/users-types-repositories";
import bcrypt from "bcryptjs";
import {usersQueryRepository} from "../queryRepository/users-query-repository";
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from 'uuid'
import jwt from "jsonwebtoken";
import {UserDBType} from "../types/types";
import {env} from "../config";

export function mappingUser(user: any): UserOutPutType {
    return {
        id: user._id,
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    }
}
export const usersService = {

    async createUser(bodyUser: BodyUserType): Promise<UserOutPutType> {

        const passHash = await this._generateHash(bodyUser.password);

        const user: UserDBType = {
            _id: new ObjectId(),
            login: bodyUser.login,
            email: bodyUser.email,
            createdAt: new Date().toISOString(),
            passwordHash: passHash,
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: new Date(),
                isConfirmed: true
            },
            passwordRecovery: {
                confirmationCode: uuidv4(),
                expirationDate: new Date()
            }
        }

        await usersRepository.createUser(user);
        return mappingUser(user);
    },

    async deleteSingleUser(id: string): Promise<boolean> {

        return await usersRepository.deleteSingleUser(id);
    },

    async _generateHash(password: string): Promise<string> {

        return await bcrypt.hash(password, 10)
    },

    async checkCredentials(loginOrEmail: string, password: string): Promise<UserDBType | false> {

        const user = await usersQueryRepository.getUserByLoginOrEmail(loginOrEmail);
        if (!user || !user.emailConfirmation.isConfirmed) {
            return false
        }

        return await bcrypt.compare(password, user.passwordHash) ? user : false;
    },

    async getUserIdByAccessToken(token: string): Promise<null | ObjectId> {

        try {
            const decode = jwt.verify(token, env.PRIVATE_KEY_ACCESS_TOKEN) as {userId: string};
            return new ObjectId(decode.userId)

        } catch (err) {
            return null
        }
    }
}