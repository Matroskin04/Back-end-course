import {RequestWithBody} from "../types/types";
import {CreateBlogModel} from "../models/BlogsModels/CreateBlogModel";
import {CreatePostByBlogIdModel, CreatePostModel} from "../models/PostsModels/CreatePostModel";
import {validationResult} from "express-validator";
import {NextFunction, Response} from "express";
import {ApiAllErrorsModels} from "../models/ApiAllErrorsModels";
import {CreateUserModel} from "../models/UsersModels/CreateUserModel";
import {LoginInputModel} from "../models/AuthModels/LoginInputModel";

export const getErrors = (req: RequestWithBody<CreateBlogModel | CreatePostModel
                              | CreatePostByBlogIdModel | CreateUserModel | LoginInputModel>,
                          res: Response<ApiAllErrorsModels>, next: NextFunction) => { // todo void добавлять не нужно?

    const myValidationResult = validationResult.withDefaults({
        formatter: error => {

            return {
                message: error.msg,
                field: error.param
            }
        }
    });
    const errors = myValidationResult(req);

    if ( errors.array().length > 0 ) {

        res.status(400).send({
            errorsMessages: errors.array()
        })

    } else next()
}