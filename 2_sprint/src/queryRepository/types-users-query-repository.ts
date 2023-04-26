import {userOutPutType, userType} from "../repositories/types-users-repositories";

export type usersPaginationType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<userOutPutType>
}