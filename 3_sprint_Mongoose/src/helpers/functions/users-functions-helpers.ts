import {UserOutPutType} from "../../repositories/repositories-types/users-types-repositories";

export function mappingUser(user: any): UserOutPutType {
    return {
        id: user._id,
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    }
}