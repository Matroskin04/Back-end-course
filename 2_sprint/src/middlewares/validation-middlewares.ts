import {RequestWithBody} from "../types/types";
import {CreateBlogModel} from "../models/BlogsModels/CreateBlogModel";
import {CreatePostByBlogIdModel, CreatePostModel} from "../models/PostsModels/CreatePostModel";
import {validationResult} from "express-validator";
import {NextFunction, Response} from "express";
import {ViewAllErrorsModels} from "../models/ViewAllErrorsModels";
import {CreateUserModel} from "../models/UsersModels/CreateUserModel";
import {LoginAuthInputModel} from "../models/AuthModels/LoginAuthInputModel";
import {CreateCommentByPostIdModel} from "../models/CommentsModels/CreateCommentModel";

type getErrorsType = CreateBlogModel | CreatePostModel | CreatePostByBlogIdModel
                    | CreateUserModel | LoginAuthInputModel | CreateCommentByPostIdModel
export const getErrors = (req: RequestWithBody<getErrorsType>,
                          res: Response<ViewAllErrorsModels>, next: NextFunction) => { // todo void добавлять не нужно?

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