import {body} from "express-validator";
import {NextFunction, Request, Response} from "express";
import {jwtService} from "../domain/jwt-service";

export const validateLoginDataAuth = [

    body('loginOrEmail')
        .exists()
        .bail()
        .withMessage('There isn\'t such parameter')

        .isString()
        .trim()
        .bail()
        .withMessage('It should be a string')

        .if(body('loginOrEmail').not().matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/))
        .isLength({max: 10, min: 3})
        .withMessage('The length should be from 3 to 10 characters'),

    body('password')
        .exists()
        .bail()
        .withMessage('There isn\'t such parameter')

        .isString()
        .bail()
        .withMessage('It should be a string')

        .isLength({max: 20, min: 6})
        .withMessage('The length should be from 6 to 20 characters'),
]

export const validateRegistrationDataAuth = [

    body('login')
        .exists()
        .bail()
        .withMessage('There isn\'t such parameter')

        .isString()
        .trim()
        .bail()
        .withMessage('It should be a string')

        .matches(/^[a-zA-Z0-9_-]*$/)
        .bail()
        .withMessage('Incorrect login')

        .isLength({max: 10, min: 3})
        .withMessage('The length should be from 3 to 10 characters'),

    body('email')
        .exists()
        .bail()
        .withMessage('There isn\'t such parameter')

        .isString()
        .trim()
        .bail()
        .withMessage('It should be a string')

        .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
        .withMessage('Incorrect Email'),

    body('password')
        .exists()
        .bail()
        .withMessage('There isn\'t such parameter')

        .isString()
        .bail()
        .withMessage('It should be a string')

        .isLength({max: 20, min: 6})
        .withMessage('The length should be from 6 to 20 characters'),
]

export const validateAuthConfirmationCode = [
    body('code')
        .exists()
        .bail()
        .withMessage('There isn\'t such parameter')

        .isString()
        .trim()
        .bail()
        .withMessage('It should be a string')
]

export const validateAuthEmail = [
    body('email')
        .exists()
        .bail()
        .withMessage('There isn\'t such parameter')

        .isString()
        .trim()
        .bail()
        .withMessage('It should be a string')

        .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
        .withMessage('Incorrect Email')
]

export const checkToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    if (!req.headers.authorization) {
        res.sendStatus(401);
        return;
    }

    const token = req.headers.authorization.split(' ')[1];
    const userId = await jwtService.getUserIdByToken(token);

    if (userId) {
        req.userId = userId;
        next();
        return;
    }
    res.sendStatus(401)
}