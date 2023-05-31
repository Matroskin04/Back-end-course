import {Router} from "express";
import {authorization} from "../middlewares/authorization-middelwares";
import {validateBodyOfPost} from "../middlewares/validation-middlewares/posts-validation-middlewares";
import {getErrors} from "../middlewares/validation-middlewares/validation-middlewares";
import {validateBodyOfComment} from "../middlewares/validation-middlewares/comments-validation-middlewares";
import {validateAccessToken} from "../middlewares/validation-middlewares/jwt-validation-middlewares";
import {validateFormatOfUrlParams} from "../middlewares/urlParams-validation-middleware";
import {postsController} from "../controllers/posts-controller";

export const postsRoutes = Router();


postsRoutes.get('/',
    postsController.getAllPosts);

postsRoutes.get('/:id',
    validateFormatOfUrlParams,
    postsController.getPostById);

postsRoutes.get('/:id/comments',
    validateFormatOfUrlParams,
    postsController.getAllCommentsOfPost);

postsRoutes.post('/',
    authorization,
    validateBodyOfPost,
    getErrors,
    postsController.createPost);

postsRoutes.post('/:id/comments',
    validateFormatOfUrlParams,
    validateAccessToken,
    validateBodyOfComment,
    getErrors,
    postsController.createCommentByPostId);

postsRoutes.put('/:id',
    validateFormatOfUrlParams,
    authorization,
    validateBodyOfPost,
    getErrors,
    postsController.updatePost);

postsRoutes.delete('/:id',
    validateFormatOfUrlParams,
    authorization,
    postsController.deletePost);



