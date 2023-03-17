import {body} from "express-validator";
import {allBlogs} from "../repositories/blogs-db-repositories";


export let CountElemOfPost: number = 0;

export const checkErrorsPost = [

    body('title')
        .exists()
        .bail()
        .withMessage('There isn\'t this meaning')
        .isString()
        .bail()
        .trim()
        .not()
        .isEmpty()
        .isLength({max: 30}).withMessage('The title should be string and its length should be less then 31'),

    body('shortDescription')
        .exists()
        .bail()
        .withMessage('There isn\'t this meaning')
        .isString()
        .bail()
        .trim()
        .not()
        .isEmpty()
        .isLength({max: 100}).withMessage('The shortDescription should be string and its length should be less then 101'),

    body('content')
        .exists()
        .bail()
        .withMessage('There isn\'t this meaning')
        .isString()
        .bail()
        .trim()
        .not()
        .isEmpty().isLength({max: 1000}).withMessage('The content should be string and its length should be less then 1001'),

    body('blogId')
        .exists()
        .bail()
        .withMessage('There isn\'t this meaning')

        .isString()
        .bail()
        .withMessage('The title must be string')
        .custom( value => {

        for ( let key of allBlogs ) {

            if ( +value === +key.id ) {
                return true
            }
        }
        throw new Error('There isn\'t such blogId')
    })
]
