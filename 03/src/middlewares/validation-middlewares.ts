import {RequestWithBody} from "../types";
import {CreateBlogModel} from "../models/BlogsModels/CreateBlogModel";
import {CreatePostByBlogIdModel, CreatePostModel} from "../models/PostsModels/CreatePostModel";
import {validationResult} from "express-validator";
import {NextFunction, Response} from "express";

export const getErrors = (req: RequestWithBody<CreateBlogModel | CreatePostModel | CreatePostByBlogIdModel>,
                          res: Response, next: NextFunction) => {

    const myValidationResult = validationResult.withDefaults({
        formatter: error => {

            return {
                message: error.msg,
                field: error.param
            };
        },
    });
    const errors = myValidationResult(req);

    if (errors.array)

    if ( errors.array().length > 0 ) {

        res.status(400).send({
            errorsMessages: errors.array()
        })

    } else next()
}