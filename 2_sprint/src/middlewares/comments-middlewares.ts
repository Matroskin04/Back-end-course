import {body} from "express-validator";

export const validateBodyOfComment = [

    body('content')
        .exists()
        .bail()
        .withMessage('There isn\'t this meaning')

        .isString()
        .trim()
        .bail()
        .withMessage('It should be a string')

        .notEmpty()
        .bail()
        .withMessage('It should not be not empty')

        .isLength({min: 20, max: 300})
        .withMessage('The length must be between 20 and 300 characters'),
]