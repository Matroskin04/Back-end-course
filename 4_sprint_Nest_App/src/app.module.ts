import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { BlogsService } from './features/blogs/application/blogs-service';
import { BlogsQueryRepository } from './features/blogs/infrastructure/query.repository/blogs-query-repository';
import { BlogsRepository } from './features/blogs/infrastructure/repository/blogs-repository';
import { Blog, BlogSchema } from './features/blogs/domain/blogs-schema-model';
import { BlogsController } from './features/blogs/api/blogs.controller';
import {
  LikesInfo,
  LikesInfoSchema,
  Post,
  PostSchema,
} from './features/posts/domain/posts-schema-model';
import {
  Comment,
  CommentatorInfo,
  CommentatorInfoSchema,
  CommentSchema,
} from './features/comments/domain/comments-schema-model';
import { PostsController } from './features/posts/api/posts-controller';
import { PostsService } from './features/posts/application/posts-service';
import { PostsQueryRepository } from './features/posts/infrastructure/query.repository/posts-query-repository';
import { PostsRepository } from './features/posts/infrastructure/repository/posts-repository';
import {
  EmailConfirmation,
  EmailConfirmationSchema,
  PasswordRecovery,
  PasswordRecoverySchema,
  User,
  UserSchema,
} from './features/users/domain/users-schema-model';
import { CommentsController } from './features/comments/api/comments-controller';
import { UsersController } from './features/users/api/users-controller';
import { CommentsQueryRepository } from './features/comments/infrastructure/query.repository/comments-query-repository';
import { UsersService } from './features/users/application/users-service';
import { UsersRepository } from './features/users/infrastructure/repository/users-repository';
import { UsersQueryRepository } from './features/users/infrastructure/query.repository/users-query-repository';
import { TestingController } from './features/test.delete/testing-controller';
import { TestingRepository } from './features/test.delete/testing-repository';
import { LocalStrategy } from './features/auth/strategy/local.strategy';
import { AuthService } from './features/auth/service/auth-service';
import { CryptoAdapter } from './adapters/crypto-adapter';
import { EmailManager } from './managers/email-manager';
import { EmailAdapter } from './adapters/email-adapter';
import { AuthController } from './features/auth/auth-controller';
import { JwtRefreshStrategy } from './features/auth/strategy/jwt-refresh.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from './features/jwt/jwt-service';
import { JwtQueryRepository } from './features/jwt/jwt-query-repository';
import { JwtAccessGuard } from './features/auth/guards/jwt-access.guard';
import { JwtAccessStrategy } from './features/auth/strategy/jwt-access.strategy';
import { BasicStrategy } from './features/auth/strategy/basic.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL!),
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
    JwtModule.register({
      //todo надо?
      secret: process.env.PRIVATE_KEY_ACCESS_TOKEN,
      signOptions: { expiresIn: process.env.EXPIRATION_TIME_ACCESS_TOKEN },
    }),
  ],
  controllers: [
    AuthController,
    BlogsController,
    PostsController,
    CommentsController,
    UsersController,
    TestingController,
  ],
  providers: [
    AuthService,
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
    JwtService,
    JwtQueryRepository,
    TestingRepository,
    //Strategy
    LocalStrategy,
    JwtRefreshStrategy,
    JwtAccessStrategy,
    BasicStrategy,

    //Managers && Adapters
    EmailManager,
    CryptoAdapter,
    EmailAdapter,
  ],
})
export class AppModule {}
