import {usersCollection} from "../db";
import {mappingUser} from "../domain/users-service";
import {UsersPaginationType} from "./query-repository-types/users-types-query-repository";
import {UserDBType} from "../repositories/repositories-types/users-types-repositories";
import {QueryUserModel} from "../models/UsersModels/QueryUserModel";
import {ObjectId} from "mongodb";
import {variablesForReturn} from "./utils/variables-for-return";
export const usersQueryRepository = {

    async getAllUsers(query: QueryUserModel): Promise<UsersPaginationType> {

        const paramsOfSearch = [] //todo типизация
        const searchLoginTerm: string | null = query?.searchLoginTerm ?? null;
        const searchEmailTerm: string | null = query?.searchEmailTerm ?? null;
        const paramsOfElems = await variablesForReturn(query);

        if (searchEmailTerm) paramsOfSearch.push({login: {$regex: searchEmailTerm ?? '', $options: 'i'} });
        if (searchLoginTerm) paramsOfSearch.push({login: {$regex: searchLoginTerm ?? '', $options: 'i'} });

        const countAllUsersSort = await usersCollection
            .countDocuments({$and: [ {login: {$regex: searchLoginTerm ?? '', $options: 'i'} },
                                          {email: {$regex: searchEmailTerm ?? '', $options: 'i'} } ]});


        const allUsersOnPages = await usersCollection
            .find({$and: [ {login: {$regex: searchLoginTerm ?? '', $options: 'i'} },
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

    async getUserByLoginOrEmail(logOrEmail: string): Promise<UserDBType | null> {

        const user = await usersCollection.findOne({$or: [ {login: logOrEmail}, {email: logOrEmail} ] });

        if (user) {
            return user;
        }
        return null;
    },

    async getUserByUserId(userId: ObjectId): Promise<UserDBType | null> {

        const user = await usersCollection.findOne({_id: userId});

        if (user) {
            return user;
        }
        return user;
    },

    async getUserByCodeConfirmation(code: string): Promise<UserDBType | null> {
        return await usersCollection.findOne({'emailConfirmation.confirmationCode': code})
    }
}