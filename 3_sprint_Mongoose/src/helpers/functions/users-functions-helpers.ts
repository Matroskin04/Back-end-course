import {UserOutputType} from "../../repositories/repositories-types/users-types-repositories";

export function mappingUser(user: any): UserOutputType {
    return {
        id: user._id,
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    }
}