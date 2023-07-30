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
        name: Comment.name, //todo вложенные схемы тоже здесь указывать?
        schema: CommentSchema,
      },
      {
        name: CommentatorInfo.name, //todo вложенные схемы тоже здесь указывать?
        schema: CommentatorInfoSchema,
      },
    ]),
  ],
  controllers: [BlogsController, PostsController],
  providers: [
    BlogsService,
    BlogsQueryRepository,
    BlogsRepository,
    PostsService,
    PostsQueryRepository,
    PostsRepository,
  ],
})
export class AppModule {}
