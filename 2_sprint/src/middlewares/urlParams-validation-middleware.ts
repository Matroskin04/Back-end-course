import {Request, Response, NextFunction} from "express";
import {ObjectId} from "mongodb";

export const validateFormatOfUrlParams = async (req: Request, res: Response, next: NextFunction) => {

    if (req.params.blogId) {
        req.params.id = req.params.blogId;
    }

    if ( !ObjectId.isValid(req.params.id) ) {
        res.status(404).send('Incorrect value of id (wrong format)');
        return;
    }
    next();
}