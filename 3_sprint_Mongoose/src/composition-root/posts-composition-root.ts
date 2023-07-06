import {PostsRepository} from "../repositories/posts-repository";
import {PostsQueryRepository} from "../queryRepository/posts-query-repository";
import {PostsService} from "../domain/posts-service";
import {PostsController} from "../controllers/posts-controller";
import {commentService, commentsQueryRepository} from "./comments-composition-root";
import {blogsQueryRepository} from "./blogs-composition-root";

const postsRepository = new PostsRepository();
export const postsQueryRepository = new PostsQueryRepository();
const postsService = new PostsService(postsRepository, blogsQueryRepository);
export const postsController = new PostsController(postsQueryRepository, postsService, commentsQueryRepository, commentService);