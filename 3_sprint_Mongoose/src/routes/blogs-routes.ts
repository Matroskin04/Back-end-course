import {Router} from "express";
import {validateBodyOfBlog} from "../middlewares/validation-middlewares/blogs-validation-middlewares";
import {getErrors} from "../middlewares/validation-middlewares/catch-errors-middlewares";
import {checkErrorsPostByBlogId} from "../middlewares/validation-middlewares/posts-validation-middlewares";
import {authorization} from "../middlewares/authorization-middelwares";
import {validateFormatOfUrlParams} from "../middlewares/urlParams-validation-middleware";
import {blogsController} from "../controllers/blogs-controller";

export const blogsRoutes = Router();


blogsRoutes.get('/',
    blogsController.getAllBlogs)

blogsRoutes.get('/:id',
    validateFormatOfUrlParams,
    blogsController.getBlogById)

blogsRoutes.get('/:blogId/posts',
    validateFormatOfUrlParams,
    blogsController.getAllPostsOfBlog)

blogsRoutes.post('/',
    authorization,
    validateBodyOfBlog,
    getErrors,
    blogsController.createBlog)

blogsRoutes.post('/:blogId/posts',
    validateFormatOfUrlParams,
    authorization,
    checkErrorsPostByBlogId,
    getErrors,
    blogsController.createPostByBlogId)

blogsRoutes.put('/:id',
    validateFormatOfUrlParams,
    authorization,
    validateBodyOfBlog,
    getErrors,
    blogsController.updateBlog)

blogsRoutes.delete('/:id',
    validateFormatOfUrlParams,
    authorization,
    blogsController.deleteBlog)
