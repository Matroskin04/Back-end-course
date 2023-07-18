import "reflect-metadata";
import {PostsRepository} from "./repositories/posts-repository";
import {BlogsRepository} from "./repositories/blogs-repository";
import {BlogsQueryRepository} from "./queryRepository/blogs-query-repository";
import {BlogsService} from "./domain/blogs-service";
import {PostsQueryRepository} from "./queryRepository/posts-query-repository";
import {PostsService} from "./domain/posts-service";
import {BlogsController} from "./controllers/blogs-controller";
import {PostsController} from "./controllers/posts-controller";
import {DevicesRepository} from "./repositories/devices-repository";
import {DevicesQueryRepository} from "./queryRepository/devices-query-repository";
import {DevicesService} from "./domain/devices-service";
import {DevicesController} from "./controllers/devices-controller";
import {AuthService} from "./domain/auth-service";
import {AuthController} from "./controllers/auth-controller";
import {CommentsRepository} from "./repositories/comments-repository";
import {CommentsQueryRepository} from "./queryRepository/comments-query-repository";
import {CommentsService} from "./domain/comments-service";
import {CommentsController} from "./controllers/comments-controller";
import {JwtQueryRepository} from "./queryRepository/jwt-query-repository";
import {JwtService} from "./domain/jwt-service";
import {TestingRepository} from "./repositories/testing-repository";
import {TestingController} from "./controllers/testing-controller";
import {UsersRepository} from "./repositories/users-repository";
import {UsersQueryRepository} from "./queryRepository/users-query-repository";
import {UsersService} from "./domain/users-service";
import {UsersController} from "./controllers/users-controller";
import {LikesInfoQueryRepository} from "./queryRepository/likes-info-query-repository";
import {LikesInfoService} from "./domain/likes-info-service";
import {LikesInfoRepository} from "./repositories/likes-info-repository";
import { Container } from "inversify";
import {EmailAdapter} from "./adapters/email-adapter";
import {EmailManager} from "./managers/email-manager";


export const container = new Container();
container.bind(BlogsRepository).to(BlogsRepository);
container.bind(BlogsQueryRepository).to(BlogsQueryRepository);
container.bind(BlogsService).to(BlogsService);
container.bind(BlogsController).to(BlogsController);

container.bind(PostsRepository).to(PostsRepository);
container.bind(PostsQueryRepository).to(PostsQueryRepository);
container.bind(PostsService).to(PostsService);
container.bind(PostsController).to(PostsController);

container.bind(CommentsRepository).to(CommentsRepository);
container.bind(CommentsQueryRepository).to(CommentsQueryRepository);
container.bind(CommentsService).to(CommentsService);
container.bind(CommentsController).to(CommentsController);

container.bind(DevicesRepository).to(DevicesRepository);
container.bind(DevicesQueryRepository).to(DevicesQueryRepository);
container.bind(DevicesService).to(DevicesService);
container.bind(DevicesController).to(DevicesController);

container.bind(JwtQueryRepository).to(JwtQueryRepository);
container.bind(JwtService).to(JwtService);

container.bind(LikesInfoQueryRepository).to(LikesInfoQueryRepository);
container.bind(LikesInfoRepository).to(LikesInfoRepository);
container.bind(LikesInfoService).to(LikesInfoService);

container.bind(UsersRepository).to(UsersRepository);
container.bind(UsersQueryRepository).to(UsersQueryRepository);
container.bind(UsersService).to(UsersService);
container.bind(UsersController).to(UsersController);

container.bind(TestingRepository).to(TestingRepository);
container.bind(TestingController).to(TestingController);

container.bind(AuthService).to(AuthService);
container.bind(AuthController).to(AuthController);

container.bind(EmailAdapter).to(EmailAdapter);
container.bind(EmailManager).to(EmailManager);
//
//
// const postsRepository = new PostsRepository();
// const blogsRepository = new BlogsRepository();
// const blogsQueryRepository = new BlogsQueryRepository();
// const blogsService = new BlogsService(blogsRepository, blogsQueryRepository);
// const postsQueryRepository = new PostsQueryRepository();
// const postsService = new PostsService(postsRepository, blogsQueryRepository);
// const commentsRepository = new CommentsRepository();
// const likesInfoQueryRepository = new LikesInfoQueryRepository();
// const commentsQueryRepository = new CommentsQueryRepository(postsQueryRepository, likesInfoQueryRepository);
// export const usersQueryRepository = new UsersQueryRepository();
// const likesInfoRepository = new LikesInfoRepository();
// const likesInfoService = new LikesInfoService(likesInfoRepository);
// const commentService = new CommentsService(commentsRepository, usersQueryRepository, commentsQueryRepository, likesInfoService, likesInfoQueryRepository);
// export const devicesRepository = new DevicesRepository();
// export const devicesQueryRepository = new DevicesQueryRepository();
// export const jwtQueryRepository = new JwtQueryRepository();
//
// const devicesService = new DevicesService(jwtQueryRepository, devicesQueryRepository, devicesRepository);
// export const jwtService = new JwtService(jwtQueryRepository, devicesService);
//
// const emailAdapter = new EmailAdapter();
// export const emailManager = new EmailManager(emailAdapter);
// export const usersRepository = new UsersRepository();
// export const usersService = new UsersService(usersRepository, usersQueryRepository);
// const authService = new AuthService(emailManager, jwtService, usersService, usersRepository, usersQueryRepository);
// const testingRepository = new TestingRepository();
//
// //controllers
// export const blogsController = new BlogsController(blogsService, blogsQueryRepository, postsQueryRepository);
// export const authController = new AuthController(jwtService, devicesService, authService);
// export const devicesController = new DevicesController(devicesQueryRepository, devicesService);
// export const postsController = new PostsController(postsQueryRepository, postsService, commentsQueryRepository, commentService);
// export const commentsController = new CommentsController(commentsQueryRepository, commentService);
// export const usersController = new UsersController(usersQueryRepository, usersService);
// export const testingController = new TestingController(testingRepository);