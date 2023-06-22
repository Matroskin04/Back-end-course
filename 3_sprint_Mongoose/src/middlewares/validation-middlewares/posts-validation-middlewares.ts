import {body} from "express-validator";
import {ObjectId} from "mongodb";
import {BlogModel} from "../../db/shemasModelsMongoose/blogs-shema-model";

const validateTitle = body('title')
    .exists()
    .withMessage('There isn\'t such parameter')

    .isString()
    .trim()
    .withMessage('It should be a string')

    .notEmpty()
    .withMessage('The string should not be empty')

    .isLength({max: 30})
    .withMessage('The length should be less than 31')

const validateShortDescription = body('shortDescription')
    .exists()
    .withMessage('There isn\'t such parameter')

    .isString()
    .trim()
    .withMessage('It should be a string')

    .notEmpty()
    .withMessage('The string should not be empty')

    .isLength({max: 100})
    .withMessage('The length should be less than 101')

const validateContent = body('content')
    .exists()
    .withMessage('There isn\'t such parameter')

    .isString()
    .trim()
    .withMessage('It should be a string')

    .notEmpty()
    .withMessage('The string should not be empty')

    .isLength({max: 1000})
    .withMessage('The length should be less than 1001')


export const checkErrorsPostByBlogId = [validateTitle, validateShortDescription, validateContent]
export const validateBodyOfPost = [validateTitle, validateShortDescription, validateContent,

    body('blogId')
        .exists()
        .withMessage('There isn\'t such parameter')

        .isString()
        .trim()
        .withMessage('It should be a string')

        .notEmpty()
        .withMessage('The string should not be empty')
        .custom( async (value): Promise<boolean | void> => {

            const result = await BlogModel.findOne({_id: new ObjectId(value)})

            if (result) {
                return true;
            }

            throw new Error('There isn\'t such blogId')
        })
]


