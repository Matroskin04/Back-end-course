import {UserOutPutType} from "../../repositories/repositories-types/users-types-repositories";

export type UsersPaginationType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<UserOutPutType>
}