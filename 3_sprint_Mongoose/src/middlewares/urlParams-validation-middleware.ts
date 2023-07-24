import {Request, Response, NextFunction} from "express";
import {ObjectId} from "mongodb";

export const validateFormatOfUrlParams = async (req: Request, res: Response, next: NextFunction) => {


    for (let i in req.params) {
        if ( !ObjectId.isValid(req.params[i]) ) {
            res.status(404).send('Incorrect value of id (wrong format)');
            return;
        }
    }
    next();
}