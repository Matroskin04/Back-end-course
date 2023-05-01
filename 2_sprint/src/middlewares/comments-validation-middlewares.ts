import {body} from "express-validator";

export const validateBodyOfComment = [

    body('content')
        .exists()
        .bail()
        .withMessage('There isn\'t such parameter')

        .isString()
        .trim()
        .bail()
        .withMessage('It should be a string')

        .notEmpty()
        .bail()
        .withMessage('The string should not be empty')

        .isLength({min: 20, max: 300})
        .withMessage('The length should be from 20 to 300 characters'),
]