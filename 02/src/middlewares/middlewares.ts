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

export const checkErrors = ((req: Request, res: Response, next: NextFunction) => {
    body('name').isString().isLength({max: 15})
        .withMessage('The name should be string with length less then 16');
    body('description').isString().isLength({max: 500})
        .withMessage('The name should be string with length less then 501');
    next()
})
