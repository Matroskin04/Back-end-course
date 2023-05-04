import {UserDBType} from "../repositories/repositories-types/users-types-repositories";
import {usersService} from "./users-service";
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {usersRepositories} from "../repositories/users-repositories";
import {emailManager} from "../managers/email-manager";
import {usersQueryRepository} from "../queryRepository/users-query-repository";

export const authService = {

    async registerUser(email: string, login: string, password: string): Promise<boolean> {

        const userByEmail = await usersQueryRepository.getUserByLoginOrEmail(email);
        const userByLogin = await usersQueryRepository.getUserByLoginOrEmail(login);
        if (userByEmail || userByLogin) {
            return false;
        }

        const passwordHash = await usersService._generateHash(password);
        const user: UserDBType = {
            _id: new ObjectId(),
            login,
            email,
            passwordHash,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {hours: 5, seconds: 20}),
                isConfirmed: false
            }
        }

        await usersRepositories.createUser(user);
        try {
            await emailManager.sendEmailConfirmationMessage(user.email, user.emailConfirmation.confirmationCode)
            return true;
        } catch (err) {
            console.log(err)
            return false;
        }
    },

    async confirmEmail(code: string): Promise<boolean> {

        const user = await usersQueryRepository.getUserByCodeConfirmation(code);
        if (!user) return false
        if(user.emailConfirmation.expirationDate < new Date()) return false

        return await usersRepositories.updateConfirmation(user._id);
    },

    async resendConfirmationEmailMessage(email: string): Promise<boolean> {

        const userByEmail = await usersQueryRepository.getUserByLoginOrEmail(email);
        if (!userByEmail) return false
        if (userByEmail.emailConfirmation.isConfirmed) return false

        try {
            await emailManager.sendEmailConfirmationMessage(email, userByEmail.emailConfirmation.confirmationCode)
            return true
        } catch (err) {
            console.log(err);
            return false;
        }
    }
}