import {usersRepositories} from "../repositories/users-repositories";
import {
    BodyUserType,
    UserOutPutType,
    UserDBType
} from "../repositories/repositories-types/users-types-repositories";
import bcrypt from "bcrypt";
import {usersQueryRepository} from "../queryRepository/users-query-repository";
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from 'uuid'

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
                expirationDate: new Date(), // todo здесь тоже такие свойства добавлять?
                isConfirmed: true
            }
        }

        await usersRepositories.createUser(user);
        return mappingUser(user);
    },

    async deleteSingleUser(id: string): Promise<boolean> {

        return await usersRepositories.deleteSingleUser(id);
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
    }
}