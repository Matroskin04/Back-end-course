import {Router} from "express";
import {
    checkCommentByIdAndToken,
    validateBodyOfComment
} from "../middlewares/validation-middlewares/comments-validation-middlewares";
import {getErrors} from "../middlewares/validation-middlewares/validation-middlewares";
import {validateAccessToken} from "../middlewares/validation-middlewares/jwt-validation-middlewares";
import {validateFormatOfUrlParams} from "../middlewares/urlParams-validation-middleware";
import {commentsController} from "../controllers/comments-controller";

export const commentsRoutes = Router();

commentsRoutes.get('/:id',
    validateFormatOfUrlParams,
    commentsController.getCommentById)

commentsRoutes.put('/:id',
    validateFormatOfUrlParams,
    validateAccessToken,
    checkCommentByIdAndToken,
    validateBodyOfComment,
    getErrors,
    commentsController.updateComment)

commentsRoutes.delete('/:id',
    validateFormatOfUrlParams,
    validateAccessToken,
    checkCommentByIdAndToken,
    commentsController.deleteComment)