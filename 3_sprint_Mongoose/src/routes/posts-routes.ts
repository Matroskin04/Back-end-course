import {Router} from "express";
import {authorization} from "../middlewares/authorization-middelwares";
import {validateBodyOfPost} from "../middlewares/validation-middlewares/posts-validation-middlewares";
import {getErrors} from "../middlewares/validation-middlewares/catch-errors-middlewares";
import {validateBodyOfComment} from "../middlewares/validation-middlewares/comments-validation-middlewares";
import {validateAccessToken} from "../middlewares/validation-middlewares/jwt-validation-middlewares";
import {validateFormatOfUrlParams} from "../middlewares/urlParams-validation-middleware";
import {postsController} from "../composition-root";

export const postsRoutes = Router();


postsRoutes.get('/',
    postsController.getAllPosts.bind(postsController));

postsRoutes.get('/:id',
    validateFormatOfUrlParams,
    postsController.getPostById.bind(postsController));

postsRoutes.get('/:id/comments',
    validateFormatOfUrlParams,
    postsController.getAllCommentsOfPost.bind(postsController));

postsRoutes.post('/',
    authorization,
    validateBodyOfPost,
    getErrors,
    postsController.createPost.bind(postsController));

postsRoutes.post('/:id/comments',
    validateFormatOfUrlParams,
    validateAccessToken,
    validateBodyOfComment,
    getErrors,
    postsController.createCommentByPostId.bind(postsController));

postsRoutes.put('/:id',
    validateFormatOfUrlParams,
    authorization,
    validateBodyOfPost,
    getErrors,
    postsController.updatePost.bind(postsController));

postsRoutes.delete('/:id',
    validateFormatOfUrlParams,
    authorization,
    postsController.deletePost.bind(postsController));



