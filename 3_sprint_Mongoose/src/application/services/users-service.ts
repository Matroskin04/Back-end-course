import {
    BodyUserType,
    UserOutputType,
} from "../../infrastructure/repositories/repositories-types/users-types-repositories";
import bcrypt from "bcryptjs";
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from 'uuid'
import jwt from "jsonwebtoken";
import {env} from "../../config";
import {UserDBType} from "../../types/db-types";
import {mappingUser} from "../../helpers/functions/users-functions-helpers";
import {UsersRepository} from "../../infrastructure/repositories/users-repository";
import {UsersQueryRepository} from "../../infrastructure/queryRepository/users-query-repository";
import { injectable } from "inversify";


@injectable()
export class UsersService {

    constructor(protected usersRepository: UsersRepository,
                protected usersQueryRepository: UsersQueryRepository) {
    }

    async createUser(bodyUser: BodyUserType): Promise<UserOutputType> {

        const passHash = await this._generateHash(bodyUser.password);

        const user = new UserDBType(
            new ObjectId(),
            bodyUser.login,
            bodyUser.email,
            new Date().toISOString(),
            passHash,
            {
                confirmationCode: uuidv4(),
                expirationDate: new Date(),
                isConfirmed: true
            },
            {
                confirmationCode: uuidv4(),
                expirationDate: new Date()
            })


        await this.usersRepository.createUser(user);
        return mappingUser(user);
    }

    async deleteSingleUser(id: string): Promise<boolean> {

        return await this.usersRepository.deleteSingleUser(id);
    }

    async _generateHash(password: string): Promise<string> {

        return await bcrypt.hash(password, 10) //todo только степень алгоритма? Добавлять соль?
    }

    async checkCredentials(loginOrEmail: string, password: string): Promise<UserDBType | false> {

        const user = await this.usersQueryRepository.getUserByLoginOrEmail(loginOrEmail);
        if (!user || !user.emailConfirmation.isConfirmed) {
            return false
        }

        return await bcrypt.compare(password, user.passwordHash) ? user : false;
    }

    async getUserIdByAccessToken(token: string): Promise<null | ObjectId> {

        try {
            const decode = jwt.verify(token, env.PRIVATE_KEY_ACCESS_TOKEN) as { userId: string };
            return new ObjectId(decode.userId)

        } catch (err) {
            return null
        }
    }
}
