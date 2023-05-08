import {UserDBType} from "../repositories/repositories-types/users-types-repositories";
import {usersService} from "./users-service";
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {usersRepositories} from "../repositories/users-repositories";
import {emailManager} from "../managers/email-manager";

export const authService = {

    async registerUser(email: string, login: string, password: string): Promise<void> {

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
            return;
        } catch (err) {
            throw new Error(`Error: ${err}`)
        }
    },

    async confirmEmail(userId: ObjectId): Promise<void> {

        await usersRepositories.updateConfirmation(userId);
        return;
    },

    async resendConfirmationEmailMessage(userId: ObjectId, email: string): Promise<true | string> {

        const newCode = uuidv4();
        await usersRepositories.updateCodeConfirmation(userId, newCode)
        try {
            await emailManager.sendEmailConfirmationMessage(email, newCode)
            return true
        } catch (err) {
            throw new Error(`Error: ${err}`) // todo после ошибки не нужно return
        }
    }
}