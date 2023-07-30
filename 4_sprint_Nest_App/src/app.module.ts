import { Module, Post } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { BlogsService } from './blogs/application/blogs-service';
import { BlogsQueryRepository } from './blogs/infrastructure/query.repository/blogs-query-repository';
import { BlogsRepository } from './blogs/infrastructure/repository/blogs-repository';
import { Blog, BlogSchema } from './blogs/domain/blogs-schema-model';
import { BlogsController } from './blogs/api/blogs.controller';
import {
  LikesInfo,
  LikesInfoSchema,
  PostSchema,
} from './posts/domain/posts-schema-model';
import {
  Comment,
  CommentatorInfo,
  CommentatorInfoSchema,
  CommentSchema,
} from './comments/domain/comments-schema-model';
import { PostsController } from './posts/api/posts-controller';
import { PostsService } from './posts/application/posts-service';
import { PostsQueryRepository } from './posts/infrastructure/query.repository/posts-query-repository';
import { PostsRepository } from './posts/infrastructure/repository/posts-repository';
import {
  EmailConfirmation,
  EmailConfirmationSchema,
  PasswordRecovery,
  PasswordRecoverySchema,
  User,
  UserSchema,
} from './users/domain/users-schema-model';
import { CommentsController } from './comments/api/comments-controller';
import { UsersController } from './users/api/users-controller';
import { CommentsQueryRepository } from './comments/infrastructure/query.repository/comments-query-repository';
import { UsersService } from './users/application/users-service';
import { UsersRepository } from './users/infrastructure/repository/users-repository';
import { UsersQueryRepository } from './users/infrastructure/query.repository/users-query-repository';
import { TestingController } from './test.delete/testing-controller';
import { TestingRepository } from './test.delete/testing-repository';

const mongoURL =
  process.env.MONGO_URL ||
  `mongodb://0.0.0.0:27017/Website_for_programmers_Nest`;

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(mongoURL),
    MongooseModule.forFeature([
      {
        name: Blog.name,
        schema: BlogSchema,
      },
      {
        name: Post.name,
        schema: PostSchema,
      },
      {
        name: LikesInfo.name, //todo вложенные схемы тоже здесь указывать?
        schema: LikesInfoSchema,
      },
      {
        name: Comment.name,
        schema: CommentSchema,
      },
      {
        name: CommentatorInfo.name,
        schema: CommentatorInfoSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: EmailConfirmation.name,
        schema: EmailConfirmationSchema,
      },
      {
        name: PasswordRecovery.name,
        schema: PasswordRecoverySchema,
      },
    ]),
  ],
  controllers: [
    BlogsController,
    PostsController,
    CommentsController,
    UsersController,
    TestingController,
  ],
  providers: [
    BlogsService,
    BlogsQueryRepository,
    BlogsRepository,
    PostsService,
    PostsQueryRepository,
    PostsRepository,
    CommentsQueryRepository,
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    TestingRepository,
  ],
})
export class AppModule {}
