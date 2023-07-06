import {BlogsRepository} from "../repositories/blogs-repository";
import {BlogsQueryRepository} from "../queryRepository/blogs-query-repository";
import {BlogsService} from "../domain/blogs-service";
import {BlogsController} from "../controllers/blogs-controller";
import {postsQueryRepository} from "./posts-composition-root";

const blogsRepository = new BlogsRepository();
export const blogsQueryRepository = new BlogsQueryRepository();
const blogsService = new BlogsService(blogsRepository, blogsQueryRepository);
export const blogsController = new BlogsController(blogsService, blogsQueryRepository, postsQueryRepository);