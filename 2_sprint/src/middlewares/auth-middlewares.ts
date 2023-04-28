import {body} from "express-validator";
import {NextFunction, Request, Response} from "express";
import {jwtService} from "../domain/jwt-service";

export const checkErrorsAuth = [

    body('loginOrEmail')
        .exists()
        .bail()
        .withMessage('There isn\'t this meaning')

        .isString()
        .trim()
        .bail()
        .withMessage('It should be a string')

        .if(body('loginOrEmail').not().matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/))
        .isLength({max: 10, min: 3})
        .withMessage('The length should be from 3 to 10'),

    body('password')
        .exists()
        .bail()
        .withMessage('There isn\'t this meaning')

        .isString()
        .bail()
        .withMessage('It should be a string')

        .isLength({max: 20, min: 6})
        .withMessage('The length should be from 6 to 20'),
]

export const checkToken = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.headers.authorization) {
        res.sendStatus(401);
        return;
    }

    const token = req.headers.authorization.split(' ')[1];
    const userId = await jwtService.getUserIdByToken(token);

    if (userId) {
        req.userId = userId;
        next();
    }
    res.sendStatus(401)
}