/*
import { RequestWithBody } from '../../types/requests-types';
import { CreateBlogModel } from '../../blogs/api/models/CreateBlogModel';
import {
  CreatePostByBlogIdModel,
  CreatePostModel,
} from '../../posts/api/models/CreatePostModel';
import { validationResult } from 'express-validator';
import { NextFunction, Response } from 'express';
import { ViewAllErrorsModels } from '../../models/ViewAllErrorsModels';
import { CreateUserModel } from '../../users/api/models/CreateUserModel';
import {
  RegisterConfirmAuthModel,
  RegisterResendConfirmAuthModel,
  RegistrationAuthModel,
} from '../../models/AuthModels/RegistrationAuthModel';
import { CreateCommentByPostIdModel } from '../../comments/api/models/CreateCommentModel';
import { LoginAuthInputModel } from '../../models/AuthModels/LoginAuthModels';
import {
  NewPasswordAuthModel,
  PasswordRecoveryAuthModel,
} from '../../models/AuthModels/PasswordRecoveryFlowAuthModel';
import { UpdateLikeStatusModel } from '../../comments/api/models/UpdateCommentLikeStatus';

type getErrorsType =
  | CreateBlogModel
  | CreatePostModel
  | CreatePostByBlogIdModel
  | CreateUserModel
  | LoginAuthInputModel
  | CreateCommentByPostIdModel
  | RegistrationAuthModel
  | RegisterConfirmAuthModel
  | RegisterResendConfirmAuthModel
  | NewPasswordAuthModel
  | PasswordRecoveryAuthModel
  | UpdateLikeStatusModel;
export const getErrors = (
  req: RequestWithBody<getErrorsType>,
  res: Response<ViewAllErrorsModels>,
  next: NextFunction,
) => {
  const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
      return {
        message: error.msg,
        field: error.param,
      };
    },
  });
  const errors = myValidationResult(req).array({ onlyFirstError: true });

  if (errors.length > 0) {
    res.status(400).send({
      errorsMessages: errors,
    });
  } else next();
};
*/
