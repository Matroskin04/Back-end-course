import {UserDBType} from "../repositories/repositories-types/users-types-repositories";
import {usersService} from "./users-service";
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {usersRepositories} from "../repositories/users-repositories";
import {emailManager} from "../managers/email-manager";
import {usersQueryRepository} from "../queryRepository/users-query-repository";

export const authService = {

    async registerUser(email: string, login: string, password: string): Promise<string | true> {

        const userByEmail = await usersQueryRepository.getUserByLoginOrEmail(email);
        if (userByEmail) {
            return "email"
        }
        const userByLogin = await usersQueryRepository.getUserByLoginOrEmail(login);
        if (userByLogin) {
            return "login";
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
            throw new Error(`Error: ${err}`)
        }
    },

    async confirmEmail(code: string): Promise<true | string> {

        const user = await usersQueryRepository.getUserByCodeConfirmation(code);
        if (!user) {
            return 'Code is incorrect';
        }
        if(user.emailConfirmation.expirationDate < new Date()) {
            return 'Code is already expired';
        }
        if(user.emailConfirmation.isConfirmed) {
            return 'Code is already been applied';
        }

        await usersRepositories.updateConfirmation(user._id);
        return true;
    },

    async resendConfirmationEmailMessage(email: string): Promise<true | string> {

        const userByEmail = await usersQueryRepository.getUserByLoginOrEmail(email);
        if (!userByEmail) {
            return 'This email has not been registered yet';
        }
        if (userByEmail.emailConfirmation.isConfirmed) {
            return 'Email is already confirmed';
        }

        try {
            await emailManager.sendEmailConfirmationMessage(email, userByEmail.emailConfirmation.confirmationCode)
            return true
        } catch (err) {
            throw new Error(`Error: ${err}`) // todo после ошибки не нужно return
        }
    }
}