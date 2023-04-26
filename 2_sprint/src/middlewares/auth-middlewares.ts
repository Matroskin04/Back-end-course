import {body} from "express-validator";

export const checkErrorsAuth = [

    body('loginOrEmail')
        .exists()
        .bail()
        .withMessage('There isn\'t this meaning')

        .isString()
        .trim()
        .bail()
        .withMessage('It should be a string')

        .isLength({max: 10, min: 3})
        .withMessage('The title should be string and its length should be less then 31'),

    body('password')
        .exists()
        .bail()
        .withMessage('There isn\'t this meaning')

        .isString()
        .bail()
        .withMessage('It should be a string')

        .isLength({max: 20, min: 6})
        .withMessage('The title should be string and its length should be less then 31'),
]