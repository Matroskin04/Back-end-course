import {usersCollection} from "../db";
import {variablesForReturn} from "./blogs-query-repository";
import {mappingUser} from "../domain/users-service";
import {QueryModel} from "../models/UriModels";
import {usersPaginationType} from "./types-users-query-repository";
import {userType} from "../repositories/types-users-repositories";
export const usersQueryRepository = {

    async getAllUsers(query: QueryModel | null = null): Promise<usersPaginationType> {

        const searchNameTerm: string | null = query?.searchNameTerm ?? null;
        const paramsOfElems = await variablesForReturn(query);

        const countAllUsersSort = await usersCollection
            .countDocuments({name: {$regex: searchNameTerm ?? '', $options: 'i'} });

        const allUsersOnPages = await usersCollection
            .find({name: {$regex: searchNameTerm ?? '', $options: 'i'} })
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