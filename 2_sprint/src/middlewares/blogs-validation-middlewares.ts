import {body} from "express-validator";


export const validateBodyOfBlog = [

    body('name')
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

        .isLength({max: 15})
        .withMessage('The length should be less than 16'),

    body('description')
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

        .isLength({max: 500})
        .withMessage('The description\'s length should be less than 501'),

    body('websiteUrl')
        .exists()
        .bail()
        .withMessage('There isn\'t such parameter')

        .isString()
        .trim()
        .bail()
        .withMessage('It should be a string')

        .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
        .bail()
        .withMessage('It should be valid URL')

        .isLength({max: 100})
        .withMessage('The length should be less than 101'),
]
