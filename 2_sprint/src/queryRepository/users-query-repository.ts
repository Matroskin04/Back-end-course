import {usersCollection} from "../db";
import {variablesForReturn} from "./blogs-query-repository";
import {mappingUser} from "../domain/users-service";
import {usersPaginationType} from "./types-users-query-repository";
import {userType} from "../repositories/types-users-repositories";
import {QueryUserModel} from "../models/UsersModels/UriUserModel";
export const usersQueryRepository = {

    async getAllUsers(query: QueryUserModel | null = null): Promise<usersPaginationType> {

        const searchLoginTerm: string | null = query?.searchLoginTerm ?? null;
        const searchEmailTerm: string | null = query?.searchEmailTerm ?? null;
        const paramsOfElems = await variablesForReturn(query);

        const countAllUsersSort = await usersCollection
            .countDocuments({$or: [ {login: {$regex: searchLoginTerm ?? '', $options: 'i'} },
                                          {email: {$regex: searchEmailTerm ?? '', $options: 'i'} } ]});


        const allUsersOnPages = await usersCollection
            .find({$or: [ {login: {$regex: searchLoginTerm ?? '', $options: 'i'} },
                               {email: {$regex: searchEmailTerm ?? '', $options: 'i'} } ]})
            .skip((+paramsOfElems.pageNumber - 1) * +paramsOfElems.pageSize )
            .limit(+paramsOfElems.pageSize)
            .sort(paramsOfElems.paramSort).toArray();

        return {
            pagesCount: Math.ceil(countAllUsersSort / +paramsOfElems.pageSize),
            page: +paramsOfElems.pageNumber,
            pageSize: +paramsOfElems.pageSize,
            totalCount: countAllUsersSort,
            items: allUsersOnPages.map(p => mappingUser(p))
        }
    },

    async getUserByLoginOrEmail(logOrEmail: string): Promise<userType | null> {

        const user = await usersCollection.findOne({$or: [ {login: logOrEmail}, {email: logOrEmail} ] });

        if (user) {
            // @ts-ignore
            return user; // todo Ошибка вероятно из-за 'or' (2+ сущности) - ставить игнор нормально?
        }
        return null;
    }
}