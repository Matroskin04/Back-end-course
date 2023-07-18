import {Router} from "express";
import {
    checkCommentByIdAndToken,
    validateContentOfComment
} from "../middlewares/validation-middlewares/comments-validation-middlewares";
import {getErrors} from "../middlewares/validation-middlewares/catch-errors-middlewares";
import {
    validateAccessToken,
    validateAccessTokenGetRequests
} from "../middlewares/validation-middlewares/jwt-validation-middlewares";
import {validateFormatOfUrlParams} from "../middlewares/urlParams-validation-middleware";
import {validateBodyOfLikeStatus} from "../middlewares/validation-middlewares/likes-validation-middlewares";
import {container} from "../composition-root";
import {CommentsController} from "../controllers/comments-controller";

export const commentsRoutes = Router();
const commentsController = container.resolve(CommentsController);


commentsRoutes.get('/:id',
    validateFormatOfUrlParams,
    validateAccessTokenGetRequests,
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

