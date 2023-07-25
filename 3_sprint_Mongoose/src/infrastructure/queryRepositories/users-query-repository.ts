import {EmailAndLoginTerm, UsersPaginationType} from "./query-repository-types/users-types-query-repository";
import {QueryUserModel} from "../../models/UsersModels/QueryUserModel";
import {ObjectId} from "mongodb";
import {variablesForReturn} from "./utils/variables-for-return";
import {UserModel} from "../../domain/users-schema-model";
import {mappingUser} from "../../helpers/functions/users-functions-helpers";
import { injectable } from "inversify";
import {UserDBType} from "../../domain/db-types/users-db-types";


@injectable()
export class UsersQueryRepository {

    async getAllUsers(query: QueryUserModel): Promise<UsersPaginationType> {

        const emailAndLoginTerm: EmailAndLoginTerm = []
        let paramsOfSearch: Object = {}
        const searchLoginTerm: string | null = query?.searchLoginTerm ?? null;
        const searchEmailTerm: string | null = query?.searchEmailTerm ?? null;
        const paramsOfElems = await variablesForReturn(query);

        if (searchEmailTerm) emailAndLoginTerm.push({email: {$regex: searchEmailTerm ?? '', $options: 'i'}});
        if (searchLoginTerm) emailAndLoginTerm.push({login: {$regex: searchLoginTerm ?? '', $options: 'i'}});
        if (emailAndLoginTerm.length) paramsOfSearch = {$or: emailAndLoginTerm};

        const countAllUsersSort = await UserModel
            .countDocuments(paramsOfSearch);


        const allUsersOnPages = await UserModel
            .find(paramsOfSearch)
            .skip((+paramsOfElems.pageNumber - 1) * +paramsOfElems.pageSize)
            .limit(+paramsOfElems.pageSize)
            .sort(paramsOfElems.paramSort).lean();

        return {
            pagesCount: Math.ceil(countAllUsersSort / +paramsOfElems.pageSize),
            page: +paramsOfElems.pageNumber,
            pageSize: +paramsOfElems.pageSize,
            totalCount: countAllUsersSort,
            items: allUsersOnPages.map(p => mappingUser(p))
        }
    }

    async getUserByLoginOrEmail(logOrEmail: string): Promise<UserDBType | null> {

        const user = await UserModel.findOne({$or: [{login: logOrEmail}, {email: logOrEmail}]});

        if (user) {
            return user;
        }
        return null;
    }

    async getUserByUserId(userId: ObjectId): Promise<UserDBType | null> { // todo создавать ли отдельный метод для взятия логина

        const user = await UserModel.findOne({_id: userId});

        if (user) {
            return user;
        }
        return user;
    }

    async getUserByCodeConfirmation(code: string): Promise<UserDBType | null> {

        return UserModel.findOne({'emailConfirmation.confirmationCode': code});
    }

    async getUserByRecoveryCode(recoveryCode: string): Promise<UserDBType | null> {

        return UserModel.findOne({'passwordRecovery.confirmationCode': recoveryCode})
    }
}

