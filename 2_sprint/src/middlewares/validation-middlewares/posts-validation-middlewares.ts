import {body} from "express-validator";
import {blogsCollection} from "../../db";
import {ObjectId} from "mongodb";

export const validateBodyOfPost = [

    body('title')
        .exists()
        .withMessage('There isn\'t such parameter')

        .isString()
        .trim()
        .withMessage('It should be a string')

        .notEmpty()
        .withMessage('The string should not be empty')

        .isLength({max: 30})
        .withMessage('The length should be less than 31'),

    body('shortDescription')
        .exists()
        .withMessage('There isn\'t such parameter')

        .isString()
        .trim()
        .withMessage('It should be a string')

        .notEmpty()
        .withMessage('The string should not be empty')

        .isLength({max: 100})
        .withMessage('The length should be less than 101'),

    body('content')
        .exists()
        .withMessage('There isn\'t such parameter')

        .isString()
        .trim()
        .withMessage('It should be a string')

        .notEmpty()
        .withMessage('The string should not be empty')

        .isLength({max: 1000})
        .withMessage('The length should be less than 1001'),

    body('blogId')
        .exists()
        .withMessage('There isn\'t such parameter')

        .isString()
        .trim()
        .withMessage('It should be a string')

        .notEmpty()
        .withMessage('The string should not be empty')
        .custom( async (value): Promise<boolean | void> => {

            const result = await blogsCollection.findOne({_id: new ObjectId(value)})

            if (result) {
                return true;
            }

            throw new Error('There isn\'t such blogId')
        })
]

export const checkErrorsPostByBlogId = [

    body('title')
        .exists()
        .withMessage('There isn\'t such parameter')

        .isString()
        .trim()
        .withMessage('It should be a string')

        .notEmpty()
        .withMessage('The string should not be empty')

        .isLength({max: 30})
        .withMessage('The length should be less than 31'),

    body('shortDescription')
        .exists()
        .withMessage('There isn\'t such parameter')

        .isString()
        .trim()
        .withMessage('It should be a string')

        .notEmpty()
        .withMessage('The string should not be empty')

        .isLength({max: 100})
        .withMessage('The length should be less than 101'),

    body('content')
        .exists()
        .withMessage('There isn\'t such parameter')

        .isString()
        .trim()
        .withMessage('It should be a string')

        .notEmpty()
        .withMessage('The string should not be empty')

        .isLength({max: 1000})
        .withMessage('The length should be less than 1001')
]
