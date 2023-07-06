import {CommentsRepository} from "../repositories/comments-repository";
import {CommentsQueryRepository} from "../queryRepository/comments-query-repository";
import {CommentsService} from "../domain/comments-service";
import {CommentsController} from "../controllers/comments-controller";
import {postsQueryRepository} from "./posts-composition-root";
import {usersQueryRepository} from "./users-composition-root";

const commentsRepository = new CommentsRepository();
export const commentsQueryRepository = new CommentsQueryRepository(postsQueryRepository);
export const commentService = new CommentsService(commentsRepository, usersQueryRepository);
export const commentsController = new CommentsController(commentsQueryRepository, commentService);