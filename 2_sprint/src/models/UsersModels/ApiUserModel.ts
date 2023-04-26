import {userType} from "../../repositories/types-users-repositories";

export type ApiUserModel = userType

export type ApiAllUsersModels = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<userType>
}
