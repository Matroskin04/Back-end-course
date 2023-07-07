import {Router} from "express";
import {
    checkCommentByIdAndToken,
    validateContentOfComment
} from "../middlewares/validation-middlewares/comments-validation-middlewares";
import {getErrors} from "../middlewares/validation-middlewares/catch-errors-middlewares";
import {validateAccessToken} from "../middlewares/validation-middlewares/jwt-validation-middlewares";
import {validateFormatOfUrlParams} from "../middlewares/urlParams-validation-middleware";
import {commentsController} from "../composition-root";
import {validateBodyOfLikeStatus} from "../middlewares/validation-middlewares/likes-validation-middlewares";

export const commentsRoutes = Router();

commentsRoutes.get('/:id',
    validateFormatOfUrlParams,
    commentsController.getCommentById.bind(commentsController));

commentsRoutes.put('/:id',
    validateFormatOfUrlParams,
    validateAccessToken,
    checkCommentByIdAndToken,
    validateContentOfComment,
    getErrors,
    commentsController.updateComment.bind(commentsController));

commentsRoutes.delete('/:id',
    validateFormatOfUrlParams,
    validateAccessToken,
    checkCommentByIdAndToken,
    commentsController.deleteComment.bind(commentsController));

commentsRoutes.put('/:id/like-status',
    validateAccessToken,
    validateBodyOfLikeStatus,
    getErrors,
    commentsController.updateLikeStatusOfComment.bind(commentsController));

