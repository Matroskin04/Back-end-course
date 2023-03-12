import {NextFunction, Request, Response} from "express";
import {body} from "express-validator";

export const authorization = (req: Request, res: Response, next: NextFunction) => {
    let authHeader: string | undefined = req.headers['authorization'];
    if (authHeader !== undefined && authHeader === `Basic ${btoa('admin:qwerty')}`) {
        next()
    } else {
        res.send(401)
    }
}

export const checkErrorsBlog = [
    body('name').isString().withMessage('The name should be string'),
    body('name').isLength({max: 15}).withMessage('The length should be less then 16'),

    body('description').isString().withMessage('The description should be string'),
    body('description').isLength({max: 500}).withMessage('The length should be less then 501'),

    body('websiteUrl').isString().withMessage('The websiteUrl should be string'),
    body('websiteUrl').isURL({require_protocol: true, allow_underscores: true, require_tld: false}).withMessage('The websiteUrl should be URL'),
    body('websiteUrl').isLength({max: 100}).withMessage('The length should be less then 101'),
]
