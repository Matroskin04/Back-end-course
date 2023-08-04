import {Router} from "express";
import {validateBodyOfBlog} from "../../middlewares/validation-middlewares/blogs-validation-middlewares";
import {getErrors} from "../../middlewares/validation-middlewares/catch-errors-middlewares";
import {validateBodyOfPostByBlogId} from "../../middlewares/validation-middlewares/posts-validation-middlewares";
import {authorization} from "../../middlewares/authorization-middelwares";
import {validateFormatOfUrlParams} from "../../middlewares/urlParams-validation-middleware";
import {container} from "../../composition-root";
import {BlogsController} from "../controllers/blogs-controller";
import {validateAccessTokenGetRequests} from "../../middlewares/validation-middlewares/jwt-validation-middlewares";

export const blogsRoutes = Router();
const blogsController = container.resolve(BlogsController);


blogsRoutes.get('/',
    blogsController.getAllBlogs.bind(blogsController));

blogsRoutes.get('/:id',
    validateFormatOfUrlParams,
    blogsController.getBlogById.bind(blogsController));

blogsRoutes.get('/:blogId/posts',
    validateFormatOfUrlParams,
    validateAccessTokenGetRequests,
    blogsController.getAllPostsOfBlog.bind(blogsController));

blogsRoutes.post('/',
    authorization,
    validateBodyOfBlog,
    getErrors,
    blogsController.createBlog.bind(blogsController));

blogsRoutes.post('/:blogId/posts',
    validateFormatOfUrlParams,
    authorization,
    validateBodyOfPostByBlogId,
    getErrors,
    blogsController.createPostByBlogId.bind(blogsController));

blogsRoutes.put('/:id',
    validateFormatOfUrlParams,
    authorization,
    validateBodyOfBlog,
    getErrors,
    blogsController.updateBlog.bind(blogsController));

blogsRoutes.delete('/:id',
    validateFormatOfUrlParams,
    authorization,
    blogsController.deleteBlog.bind(blogsController));
