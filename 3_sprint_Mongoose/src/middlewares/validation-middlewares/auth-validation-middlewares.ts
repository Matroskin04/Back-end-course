import {body} from "express-validator";
import {container} from "../../composition-root";
import {UsersQueryRepository} from "../../queryRepository/users-query-repository";

const usersQueryRepository = container.resolve(UsersQueryRepository)

export const validateLoginDataAuth = [

    body('loginOrEmail')
        .exists()
        .withMessage('There isn\'t such parameter')

        .isString()
        .trim()
        .withMessage('It should be a string')

        .if(body('loginOrEmail').not().matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/))
        .isLength({max: 10, min: 3})
        .withMessage('The length should be from 3 to 10 characters'),

    body('password')
        .exists()
        .withMessage('There isn\'t such parameter')

        .isString()
        .withMessage('It should be a string')

        .isLength({max: 20, min: 6})
        .withMessage('The length should be from 6 to 20 characters'),
]

export const validateRegistrationDataAuth = [

    body('login')
        .exists()
        .withMessage('There isn\'t such parameter')

        .isString()
        .trim()
        .withMessage('It should be a string')

        .matches(/^[a-zA-Z0-9_-]*$/)
        .withMessage('Incorrect login')

        .isLength({max: 10, min: 3})
        .withMessage('The length should be from 3 to 10 characters')
        .custom(async (login: string): Promise<boolean | void> => {
            const userByLogin = await usersQueryRepository.getUserByLoginOrEmail(login);
            if (userByLogin) {
                throw new Error(`This ${login} is already exists, point out another`);
            }
            return true;
        }),

    body('email')
        .exists()
        .withMessage('There isn\'t such parameter')

        .isString()
        .trim()
        .withMessage('It should be a string')

        .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
        .withMessage('Incorrect Email')
        .custom(async (email: string): Promise<true | void> => {
            const userByEmail = await usersQueryRepository.getUserByLoginOrEmail(email);
            if (userByEmail) {
                throw new Error(`This ${email} is already exists, point out another`);
            }
            return true;
        }),

    body('password')
        .exists()
        .withMessage('There isn\'t such parameter')

        .isString()
        .withMessage('It should be a string')

        .isLength({max: 20, min: 6})
        .withMessage('The length should be from 6 to 20 characters')
]

export const validateAuthConfirmationCode = [
    body('code')
        .exists()
        .withMessage('There isn\'t such parameter')

        .isString()
        .trim()
        .withMessage('It should be a string')
        .custom(async (code: string, {req}): Promise<true | void> => {
            const user = await usersQueryRepository.getUserByCodeConfirmation(code);
            if (!user) {
                throw new Error(`Code is incorrect`);
            }
            if (user.emailConfirmation.expirationDate < new Date()) {
                throw new Error(`Code is already expired`);
            }
            if (user.emailConfirmation.isConfirmed) {
                throw new Error(`Code is already been applied`);
            }
            if (user._id) {
                req.userId = user._id;
            }
            return true;
        })
]

export const validateAuthEmail = [
    body('email')
        .exists()
        .withMessage('There isn\'t such parameter')

        .isString()
        .trim()
        .withMessage('It should be a string')

        .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
        .withMessage('Incorrect Email')
        .custom(async (email: string, {req}): Promise<true | void> => {
            const user = await usersQueryRepository.getUserByLoginOrEmail(email);
            if (!user) {
                throw new Error('This email has not been registered yet');
            }
            if (user.emailConfirmation.isConfirmed) {
                throw new Error('Email is already confirmed');
            }
            if (user._id) {
                req.userId = user._id;
            }
            return true;
        })
]

export const validateAuthEmailForPassRecovery = [
    body('email')
        .exists()
        .withMessage('There isn\'t such parameter')

        .isString()
        .trim()
        .withMessage('It should be a string')

        .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
        .withMessage('Incorrect Email')
]

export const validateAuthNewPassword = [

    body('newPassword')
        .exists()
        .withMessage('There isn\'t such parameter')

        .isString()
        .withMessage('It should be a string')

        .isLength({max: 20, min: 6})
        .withMessage('The length should be from 6 to 20 characters'),

    body('recoveryCode')
        .exists()
        .withMessage('There isn\'t such parameter')

        .isString()
        .withMessage('It should be a string')
]