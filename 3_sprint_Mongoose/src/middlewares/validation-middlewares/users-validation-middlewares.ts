import {body} from "express-validator";

export const validateBodyOfUser = [

    body('login')
        .exists()
        .withMessage('There isn\'t such parameter')

        .isString()
        .trim()
        .withMessage('It should be a string')

        .matches(/^[a-zA-Z0-9_-]*$/)
        .withMessage('Incorrect login')

        .isLength({max: 10, min: 3})
        .withMessage('The length should be from 3 to 10 characters'),

    body('password')
        .exists()
        .withMessage('There isn\'t such parameter')

        .isString()
        .withMessage('It should be a string')

        .isLength({max: 20, min: 6})
        .withMessage('The length should be from 6 to 20 characters'),

    body('email')
        .exists()
        .withMessage('There isn\'t such parameter')

        .isString()
        .withMessage('It should be a string')

        .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
        .withMessage('Incorrect email')
]