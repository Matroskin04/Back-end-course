import {UserOutputType} from "../../repositories/repositories-types/users-types-repositories";

export type UsersPaginationType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<UserOutputType>
}

export type EmailAndLoginTerm = Array<{
    email?: {$regex: string, $options: string},
    login?: {$regex: string, $options: string},
}>