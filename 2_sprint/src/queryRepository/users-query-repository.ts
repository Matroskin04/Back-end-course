import {usersCollection} from "../db";
import {mappingUser} from "../domain/users-service";
import {UsersPaginationType} from "./query-repository-types/users-types-query-repository";
import {UserTypeWith_Id} from "../repositories/repositories-types/users-types-repositories";
import {QueryUserModel} from "../models/UsersModels/QueryUserModel";
import {ObjectId} from "mongodb";
import {variablesForReturn} from "./utils/variables-for-return";
export const usersQueryRepository = {

    async getAllUsers(query: QueryUserModel | null = null): Promise<UsersPaginationType> {

        const searchLoginTerm: string | null = query?.searchLoginTerm ?? null;
        const searchEmailTerm: string | null = query?.searchEmailTerm ?? null;
        const paramsOfElems = await variablesForReturn(query);

        const countAllUsersSort = await usersCollection
            .countDocuments({$or: [ {login: {$regex: searchLoginTerm ?? '', $options: 'i'} },
                                          {email: {$regex: searchEmailTerm ?? '', $options: 'i'} } ]}); // todo КАК: при 1 параметре - пересечение. При двух - объединение


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

    async getUserByLoginOrEmail(logOrEmail: string): Promise<UserTypeWith_Id | null> {

        const user = await usersCollection.findOne({$or: [ {login: logOrEmail}, {email: logOrEmail} ] });

        if (user) {
            // @ts-ignore
            return user; // todo Ошибка вероятно из-за 'or' (2+ сущности) - ставить игнор нормально?
        }
        return null;
    },

    async getUserByUserId(userId: ObjectId): Promise<UserTypeWith_Id | null> {

        const user = await usersCollection.findOne({_id: userId}); // todo делать проверку? По идее userId всегда есть

        if (user) {
            return user;
        }
        return null;
    }
}