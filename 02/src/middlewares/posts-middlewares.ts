import {body} from "express-validator";
import {allBlogs} from "../repositories/blogs-repositories";


export let CountElemOfPost: number = 0;

export const checkErrorsPost = [

    body('title').isString().withMessage('The title must be string'),
    body('title').isLength({max: 30}).withMessage('The length should be less then 31'),

    body('shortDescription').isString().withMessage('The shortDescription must be string'),
    body('shortDescription').isLength({max: 100}).withMessage('The length should be less then 101'),

    body('content').isString().withMessage('The content must be string'),
    body('content').isLength({max: 1000}).withMessage('The length should be less then 1001'),

    body('blogId').isString().withMessage('The title must be string'),
    body('blogId').custom( value => {

        for ( let key of allBlogs ) {

            if ( +value === +key.id ) {
                return true
            }
        }
        throw new Error('There isn\'t such blogId')
    })
]
