import {usersService} from "./users-service";
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {usersRepository} from "../repositories/users-repository";
import {emailManager} from "../managers/email-manager";
import {UserDBType} from "../types/types";
import {jwtService} from "./jwt-service";
import {ARTokensAndUserId, UserInformation} from "./service-types/auth-types-service";
import {usersQueryRepository} from "../queryRepository/users-query-repository";
import {ErrorsTypeService} from "./service-types/errors-type-service";

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
            },
            passwordRecovery: {
                confirmationCode: uuidv4(),
                expirationDate: new Date() //todo immediately created an object during registration - ok?
            }
        }

        await usersRepository.createUser(user);
        await emailManager.sendEmailConfirmationMessage(user.email, user.emailConfirmation.confirmationCode);

        return;

    },

    async confirmEmail(userId: ObjectId): Promise<void> {

        const result = await usersRepository.updateConfirmation(userId);
        if (!result) {
            throw new Error('Email confirmation failed.')
        }

        return;
    },

    async resendConfirmationEmailMessage(userId: ObjectId, email: string): Promise<void> {

        const newCode = uuidv4();
        const newDate = add(new Date(), {hours: 5, seconds: 20});

        const result = await usersRepository.updateCodeConfirmation(userId, newCode, newDate);
        if (!result) {
            throw new Error('Resending confirmation email message failed.');
        }

        await emailManager.sendEmailConfirmationMessage(email, newCode);
        return;
    },

    async loginUser(loginOrEmail: string, password: string): Promise<ARTokensAndUserId | null> {

        const user = await usersService.checkCredentials(loginOrEmail, password);
        if (!user) {
            return null
        }

        const accessToken = jwtService.createAccessToken(user._id.toString());
        const refreshToken = jwtService.createRefreshToken(user._id.toString(), null);

        return {
            accessToken,
            refreshToken,
            userId: user._id
        }
    },

    async getUserInformation(userId: ObjectId): Promise<UserInformation | null> {

        const user = await usersQueryRepository.getUserByUserId(userId);

        if (!user) {
            return null;
        }

        return {
            email: user.email,
            login: user.login,
            userId: user._id.toString()
        }
    },

    async sendEmailPasswordRecovery(email: string): Promise<void> {

        const user: UserDBType | null = await usersQueryRepository.getUserByLoginOrEmail(email);
        if (!user) return;

        const newCode = uuidv4();
        const newDate = add(new Date(), {hours: 1});

        await usersRepository.updateCodePasswordRecovery(user._id, newCode, newDate);
        await emailManager.sendEmailPasswordRecovery(email, newCode);

        return;
    },

    async saveNewPassword(newPassword: string, recoveryCode: string): Promise<true | ErrorsTypeService> {

        const user = await usersQueryRepository.getUserByRecoveryCode(recoveryCode);
        if (!user) {
            return {errorsMessages: [{message: 'RecoveryCode is incorrect or expired', field: "recoveryCode"}]}
        }

        if (user.passwordRecovery.expirationDate < new Date()) {
            return {errorsMessages: [{message: 'RecoveryCode is incorrect or expired', field: "recoveryCode"}]}
        }

        const passwordHash = await usersService._generateHash(newPassword);
        await usersRepository.updatePassword(passwordHash, user._id);

        return true;
    }
}