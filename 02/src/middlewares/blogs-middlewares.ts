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
    body('name').isString()
                      .trim()
                      .not()
                      .isEmpty()
                      .isLength({max: 15})
                      .withMessage('The name should be sting and its length must be less then 16'),

    body('description').isString()
                      .trim()
                      .not()
                      .isEmpty()
                      .isLength({max: 500})
                      .withMessage('The description should be sting and its length must be less then 501'),

    body('websiteUrl').isString()
                            .trim()
                            .isURL({require_protocol: true, allow_underscores: true, require_tld: false})
                            .isLength({max: 100})
                            .withMessage('The websiteUrl should be URL and its length must be less then 101'),
]
