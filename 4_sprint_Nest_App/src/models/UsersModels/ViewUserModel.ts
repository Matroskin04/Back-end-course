import {UserOutputType} from "../../infrastructure/repositories/repositories-types/users-types-repositories";

export type ViewUserModel = UserOutputType

export type ViewAllUsersModels = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<UserOutputType>
}
