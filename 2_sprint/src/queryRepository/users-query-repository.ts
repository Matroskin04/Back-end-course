import {usersCollection} from "../db";
import {variablesForReturn} from "./blogs-query-repository";
import {renameMongoIdUser} from "../domain/users-service";
import {QueryModel} from "../models/UriModels";
import {usersPaginationType} from "./types-users-query-repository";
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
            items: allUsersOnPages.map(p => renameMongoIdUser(p))
        }
    }
}