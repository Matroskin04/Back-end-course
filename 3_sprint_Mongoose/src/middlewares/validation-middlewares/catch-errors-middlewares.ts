import {RequestWithBody} from "../../types/requests-types";
import {CreateBlogModel} from "../../models/BlogsModels/CreateBlogModel";
import {CreatePostByBlogIdModel, CreatePostModel} from "../../models/PostsModels/CreatePostModel";
import {validationResult} from "express-validator";
import {NextFunction, Response} from "express";
import {ViewAllErrorsModels} from "../../models/ViewAllErrorsModels";
import {CreateUserModel} from "../../models/UsersModels/CreateUserModel";
import {
    RegisterConfirmAuthModel, RegisterResendConfirmAuthModel,
    RegistrationAuthModel
} from "../../models/AuthModels/RegistrationAuthModel";
import {CreateCommentByPostIdModel} from "../../models/CommentsModels/CreateCommentModel";
import {LoginAuthInputModel} from "../../models/AuthModels/LoginAuthModels";
import {
    NewPasswordAuthModel,
    PasswordRecoveryAuthModel
} from "../../models/AuthModels/PasswordRecoveryFlowAuthModel";
import {UpdateLikeStatusModel} from "../../models/CommentsModels/UpdateCommentLikeStatus";

type getErrorsType = CreateBlogModel | CreatePostModel | CreatePostByBlogIdModel
                    | CreateUserModel | LoginAuthInputModel | CreateCommentByPostIdModel | RegistrationAuthModel
                    | RegisterConfirmAuthModel | RegisterResendConfirmAuthModel | NewPasswordAuthModel | PasswordRecoveryAuthModel
                    | UpdateLikeStatusModel
export const getErrors = (req: RequestWithBody<getErrorsType>,
                          res: Response<ViewAllErrorsModels>, next: NextFunction) => {

    const myValidationResult = validationResult.withDefaults({
        formatter: error => {

            return {
                message: error.msg,
                field: error.param
            }
        }
    });
    const errors = myValidationResult(req).array({onlyFirstError: true});

    if ( errors.length > 0 ) {

        res.status(400).send({
            errorsMessages: errors
        })

    } else next()
}