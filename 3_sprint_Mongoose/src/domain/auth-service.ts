import {ObjectId} from "mongodb";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {ARTokensAndUserId, UserInformation} from "./service-types/auth-types-service";
import {ErrorsTypeService} from "./service-types/responses-types-service";
import {UserDBType} from "../types/db-types";
import {UsersService} from "./users-service";
import {UsersRepository} from "../repositories/users-repository";
import {UsersQueryRepository} from "../queryRepository/users-query-repository";
import {JwtService} from "./jwt-service";
import {EmailManager} from "../managers/email-manager";


export class AuthService {

    emailManager: EmailManager;
    jwtService: JwtService;
    usersService: UsersService;
    usersRepository: UsersRepository;
    usersQueryRepository: UsersQueryRepository;
    constructor() {
        this.emailManager = new EmailManager();
        this.jwtService = new JwtService();
        this.usersService = new UsersService();
        this.usersRepository = new UsersRepository();
        this.usersQueryRepository = new UsersQueryRepository();
    }

    async registerUser(email: string, login: string, password: string): Promise<void> {

        const passwordHash = await this.usersService._generateHash(password);
        const user = new UserDBType(
            new ObjectId(),
            login,
            email,
            passwordHash,
            new Date().toISOString(),
            {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {hours: 5, seconds: 20}),
                isConfirmed: false
            },
            {
                confirmationCode: uuidv4(),
                expirationDate: new Date()
            })

        await this.usersRepository.createUser(user);
        await this.emailManager.sendEmailConfirmationMessage(user.email, user.emailConfirmation.confirmationCode);

        return;

    }

    async confirmEmail(userId: ObjectId): Promise<void> {

        const result = await this.usersRepository.updateConfirmation(userId);
        if (!result) {
            throw new Error('Email confirmation failed.')
        }

        return;
    }

    async resendConfirmationEmailMessage(userId: ObjectId, email: string): Promise<void> {

        const newCode = uuidv4();
        const newDate = add(new Date(), {hours: 5, seconds: 20});

        const result = await this.usersRepository.updateCodeConfirmation(userId, newCode, newDate);
        if (!result) {
            throw new Error('Resending confirmation email message failed.');
        }

        await this.emailManager.sendEmailConfirmationMessage(email, newCode);
        return;
    }

    async loginUser(loginOrEmail: string, password: string): Promise<ARTokensAndUserId | null> {

        const user = await this.usersService.checkCredentials(loginOrEmail, password);
        if (!user) {
            return null
        }

        const accessToken = this.jwtService.createAccessToken(user._id.toString());
        const refreshToken = this.jwtService.createRefreshToken(user._id.toString(), null);

        return {
            accessToken,
            refreshToken,
            userId: user._id
        }
    }

    async getUserInformation(userId: ObjectId): Promise<UserInformation | null> {

        const user = await this.usersQueryRepository.getUserByUserId(userId);

        if (!user) {
            return null;
        }

        return {
            email: user.email,
            login: user.login,
            userId: user._id.toString()
        }
    }

    async sendEmailPasswordRecovery(email: string): Promise<void> {

        const user: UserDBType | null = await this.usersQueryRepository.getUserByLoginOrEmail(email);
        if (!user) return;

        const newCode = uuidv4();
        const newDate = add(new Date(), {hours: 1});

        await this.usersRepository.updateCodePasswordRecovery(user._id, newCode, newDate);
        await this.emailManager.sendEmailPasswordRecovery(email, newCode);

        return;
    }

    async saveNewPassword(newPassword: string, recoveryCode: string): Promise<true | ErrorsTypeService> {

        const user = await this.usersQueryRepository.getUserByRecoveryCode(recoveryCode);
        if (!user) {
            return {errorsMessages: [{message: 'RecoveryCode is incorrect or expired', field: "recoveryCode"}]}
        }

        if (user.passwordRecovery.expirationDate < new Date()) {
            return {errorsMessages: [{message: 'RecoveryCode is incorrect or expired', field: "recoveryCode"}]}
        }

        const passwordHash = await this.usersService._generateHash(newPassword);
        await this.usersRepository.updatePassword(passwordHash, user._id);

        return true;
    }
}

