import {body} from "express-validator";
import {blogsCollection} from "../db";
import {ObjectId} from "mongodb";

export const validateBodyOfPost = [

    body('title')
        .exists()
        .bail()
        .withMessage('There isn\'t this meaning')
        .isString()
        .bail()
        .trim()
        .not()
        .isEmpty()
        .isLength({max: 30})
        .withMessage('The title should be string and its length should be less then 31'),

    body('shortDescription')
        .exists()
        .bail()
        .withMessage('There isn\'t this meaning')
        .isString()
        .bail()
        .trim()
        .not()
        .isEmpty()
        .isLength({max: 100})
        .withMessage('The shortDescription should be string and its length should be less then 101'),

    body('content')
        .exists()
        .bail()
        .withMessage('There isn\'t this meaning')
        .isString()
        .bail()
        .trim()
        .not()
        .isEmpty()
        .isLength({max: 1000})
        .withMessage('The content should be string and its length should be less then 1001'),

    body('blogId')
        .exists()
        .bail()
        .withMessage('There isn\'t this meaning')

        .isString()
        .bail()
        .withMessage('The title must be string')
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
        .bail()
        .withMessage('There isn\'t this meaning')

        .isString()
        .trim()
        .bail()
        .withMessage('It should be a string')

        .notEmpty()
        .bail()
        .withMessage('It should not be not empty')

        .isLength({max: 30})
        .withMessage('The title should be string and its length should be less then 31'),

    body('shortDescription')
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

        .isLength({max: 100})
        .withMessage('The shortDescription should be string and its length should be less then 101'),

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

        .isLength({max: 1000})
        .withMessage('The content should be string and its length should be less then 1001')
]
