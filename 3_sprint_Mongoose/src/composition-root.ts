import {BlogsRepository} from "./repositories/blogs-repository";
import {BlogsQueryRepository} from "./queryRepository/blogs-query-repository";
import {BlogsService} from "./domain/blogs-service";
import {BlogsController} from "./controllers/blogs-controller";
import {CommentsRepository} from "./repositories/comments-repository";
import {CommentsQueryRepository} from "./queryRepository/comments-query-repository";
import {CommentsService} from "./domain/comments-service";
import {CommentsController} from "./controllers/comments-controller";
import {DevicesRepository} from "./repositories/devices-repository";
import {DevicesQueryRepository} from "./queryRepository/devices-query-repository";
import {DevicesService} from "./domain/devices-service";
import {DevicesController} from "./controllers/devices-controller";
import {PostsRepository} from "./repositories/posts-repository";
import {PostsQueryRepository} from "./queryRepository/posts-query-repository";
import {PostsService} from "./domain/posts-service";
import {PostsController} from "./controllers/posts-controller";

//blogs
const blogsRepository = new BlogsRepository();
const blogsQueryRepository = new BlogsQueryRepository();
const blogsService = new BlogsService(blogsRepository, blogsQueryRepository);
export const blogsController = new BlogsController(blogsService, blogsQueryRepository, postsQueryRepository)

//comments
const commentsRepository = new CommentsRepository();
const commentsQueryRepository = new CommentsQueryRepository(postsQueryRepository);
const commentService = new CommentsService(commentsRepository, usersQueryRepository);
export const commentsController = new CommentsController(commentsQueryRepository, commentService);

//devices
const devicesRepository = new DevicesRepository();
const devicesQueryRepository = new DevicesQueryRepository();
const devicesService = new DevicesService(jwtQueryRepository, devicesQueryRepository, devicesRepository);
export const devicesController = new DevicesController(devicesQueryRepository, devicesService);

//posts
const postsRepository = new PostsRepository();
const postsQueryRepository = new PostsQueryRepository();
const postsService = new PostsService(postsRepository, blogsQueryRepository);
export const postsController = new PostsController(postsQueryRepository, postsService, commentsQueryRepository, commentService);





