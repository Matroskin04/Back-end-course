import {usersRepositories} from "../repositories/users-repositories";
import {bodyUserType, userOutPutType, userType} from "../repositories/types-users-repositories";
import bcrypt from "bcrypt";
import {usersQueryRepository} from "../queryRepository/users-query-repository";

export function mappingUser(user: any): userOutPutType { // todo поправить тип с монгощной айди
    return {
        id: user._id,
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    }
}
export const usersService = {

    async createUser(bodyUser: bodyUserType): Promise<userOutPutType> {

        // const hasEmail = await usersCollection.findOne({email: bodyUser.email}); - проверка на наличие такого же емаила
        // const hasLogin = await usersCollection.findOne({login: bodyUser.login});

        const passHash = await this._generateHash(bodyUser.password);

        const user: userType = {
            login: bodyUser.login,
            email: bodyUser.email,
            createdAt: new Date().toISOString(),
            passwordHash: passHash
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

    async checkCredentials(loginOrEmail: string, password: string): Promise<userType | false> {

        const user = await usersQueryRepository.getUserByLoginOrEmail(loginOrEmail);
        if (!user) {
            return false
        }

        return await bcrypt.compare(password, user.passwordHash) ? user : false;
    }
}