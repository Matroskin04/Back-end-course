import {UserOutPutType} from "../../repositories/repositories-types/users-types-repositories";

export type ViewUserModel = UserOutPutType

export type ViewAllUsersModels = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<UserOutPutType>
}
