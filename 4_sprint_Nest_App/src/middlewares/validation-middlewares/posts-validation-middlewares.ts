/*
import {body} from "express-validator";

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

const validateBlogId =  body('blogId')
    .exists()
    .withMessage('There isn\'t such parameter')

    .isString()
    .trim()
    .withMessage('It should be a string')

    .notEmpty()
    .withMessage('The string should not be empty')


export const checkErrorsPostByBlogId = [validateTitle, validateShortDescription, validateContent]
export const validateBodyOfPost = [validateTitle, validateShortDescription, validateContent,validateBlogId]

*/
