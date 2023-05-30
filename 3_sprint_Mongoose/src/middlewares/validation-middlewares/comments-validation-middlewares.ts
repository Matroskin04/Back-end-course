import {body} from "express-validator";
import {NextFunction, Request, Response} from "express";
import {commentsCollection} from "../../db";
import {ObjectId} from "mongodb";

export const validateBodyOfComment = [

    body('content')
        .exists()
        .withMessage('There isn\'t such parameter')

        .isString()
        .trim()
        .withMessage('It should be a string')

        .notEmpty()
        .withMessage('The string should not be empty')

        .isLength({min: 20, max: 300})
        .withMessage('The length should be from 20 to 300 characters'),
]

export const checkCommentByIdAndToken = async (req: Request, res: Response, next: NextFunction) => {

    const comment = await commentsCollection.findOne({_id: new ObjectId(req.params.id)});
    if (!comment) {
        res.sendStatus(404);
        return;
    }
    if (comment.commentatorInfo.userId !==  req.userId!.toString()) {
        res.sendStatus(403);
        return;
    }
    next();
}