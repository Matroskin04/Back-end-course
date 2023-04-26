import {bodyUserType, userOutPutType, userType} from "../../repositories/types-users-repositories";

export type ApiUserModel = userOutPutType

export type ApiAllUsersModels = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<userOutPutType>
}
