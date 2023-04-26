import {usersRepositories} from "../repositories/users-repositories";
import {bodyUserType, userType} from "../repositories/types-users-repositories";

export function renameMongoIdUser(user: any): userType { // todo поправить тип с монгощной айди
    return {
        id: user._id,
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    }
}
export const usersService = {

    async createUser(bodyUser: bodyUserType): Promise<userType> {

        const user: userType = {
            login: bodyUser.login,
            email: bodyUser.email,
            createdAt: new Date().toISOString(),
        }

        await usersRepositories.createUser(user)
        return renameMongoIdUser(user)
    },

    async deleteSingleUser(id: string): Promise<boolean> {

        return await usersRepositories.deleteSingleUser(id)
    }
}