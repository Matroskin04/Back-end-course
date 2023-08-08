import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Blog, BlogSchema } from './features/blogs/domain/blogs.entity';
import {
  LikesInfo,
  LikesInfoSchema,
  Post,
  PostSchema,
} from './features/posts/domain/posts.entity';
import {
  Comment,
  CommentatorInfo,
  CommentatorInfoSchema,
  CommentSchema,
} from './features/comments/domain/comments.entity';
import { PostsController } from './features/posts/api/posts.controller';
import { PostsService } from './features/posts/application/posts.service';
import { PostsQueryRepository } from './features/posts/infrastructure/query.repository/posts.query.repository';
import { PostsRepository } from './features/posts/infrastructure/repository/posts.repository';
import { User, UserSchema } from './features/users/domain/users.entity';
import { CommentsController } from './features/comments/api/comments.controller';
import { UsersController } from './features/users/api/users.controller';
import { CommentsQueryRepository } from './features/comments/infrastructure/query.repository/comments.query.repository';
import { UsersService } from './features/users/application/users.service';
import { UsersRepository } from './features/users/infrastructure/repository/users.repository';
import { UsersQueryRepository } from './features/users/infrastructure/query.repository/users.query.repository';
import { TestingController } from './features/testing/api/testing.controller';
import { TestingRepository } from './features/testing/repository/testing.repository';
import { LocalStrategy } from './infrastructure/strategy/local.strategy';
import { AuthService } from './features/auth/application/auth.service';
import { CryptoAdapter } from './infrastructure/adapters/crypto.adapter';
import { EmailManager } from './infrastructure/managers/email-manager';
import { EmailAdapter } from './infrastructure/adapters/email.adapter';
import { AuthController } from './features/auth/api/auth.controller';
import { JwtRefreshStrategy } from './infrastructure/strategy/jwt-refresh.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessStrategy } from './infrastructure/strategy/jwt-access.strategy';
import { BasicStrategy } from './infrastructure/strategy/basic.strategy';
import {
  CommentLikesInfo,
  CommentsLikesInfoSchema,
  PostLikesInfo,
  PostsLikesInfoSchema,
} from './features/likes-info/domain/likes-info.entity';
import { LikesInfoService } from './features/likes-info/application/likes-info.service';
import { LikesInfoQueryRepository } from './features/likes-info/infrastructure/query.repository/likes-info.query.repository';
import { LikesInfoRepository } from './features/likes-info/infrastructure/repository/likes-info.repository';
import { CommentsService } from './features/comments/application/comments.service';
import { CommentsRepository } from './features/comments/infrastructure/repository/comments.repository';
import { IsBlogByIdExistsConstraint } from './infrastructure/decorators/posts/blog-id-exists.decorator';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { DevicesController } from './features/devices/api/devices.controller';
import { DevicesService } from './features/devices/application/devices.service';
import { DevicesQueryRepository } from './features/devices/infrastructure/query.repository/devices.query.repository';
import { DevicesRepository } from './features/devices/infrastructure/repository/devices.repository';
import { Device, DeviceSchema } from './features/devices/domain/devices.entity';
import { JwtQueryRepository } from './infrastructure/general-features/jwt/jwt.query.repository';
import { JwtService } from './infrastructure/general-features/jwt/jwt.service';
import {
  EmailConfirmation,
  EmailConfirmationSchema,
  PasswordRecovery,
  PasswordRecoverySchema,
} from './features/users/domain/users.subschemas';
import { BlogsPublicController } from './features/blogs/public-blogs/api/blogs-public.controller';
import { BlogsBloggerController } from './features/blogs/blogger-blogs/api/blogs-blogger.controller';
import { BlogsSAController } from './features/blogs/super-admin-blogs/api/blogs-sa.controller';
import { BlogsBloggerService } from './features/blogs/blogger-blogs/application/blogs-blogger.service';
import { BlogsSAService } from './features/blogs/super-admin-blogs/application/blogs-sa.service';
import { BlogsPublicQueryRepository } from './features/blogs/public-blogs/infrastructure/query.repository/blogs-public.query.repository';
import { BlogsBloggerQueryRepository } from './features/blogs/blogger-blogs/infrastructure/query.repository/blogs-blogger.query.repository';
import { BlogsSAQueryRepository } from './features/blogs/super-admin-blogs/infrastructure/query.repository/blogs-sa.query.repository';
import { BlogsBloggerRepository } from './features/blogs/blogger-blogs/infrastructure/repository/blogs-blogger.repository';
import { BlogsSARepository } from './features/blogs/super-admin-blogs/infrastructure/repository/blogs-sa-repository';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 5,
    }),
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
      {
        name: CommentLikesInfo.name,
        schema: CommentsLikesInfoSchema,
      },
      {
        name: PostLikesInfo.name,
        schema: PostsLikesInfoSchema,
      },
      {
        name: Device.name,
        schema: DeviceSchema,
      },
    ]),
    JwtModule.register({
      //todo как сделать разные?
      secret: process.env.PRIVATE_KEY_ACCESS_TOKEN,
      signOptions: { expiresIn: process.env.EXPIRATION_TIME_ACCESS_TOKEN },
    }),
  ],
  controllers: [
    AuthController,
    BlogsPublicController,
    BlogsBloggerController,
    BlogsSAController,
    DevicesController,
    PostsController,
    CommentsController,
    UsersController,
    TestingController,
  ],
  providers: [
    AuthService,
    BlogsBloggerService,
    BlogsSAService,
    BlogsPublicQueryRepository,
    BlogsBloggerQueryRepository,
    BlogsSAQueryRepository,
    BlogsBloggerRepository,
    BlogsSARepository,
    CommentsService,
    CommentsQueryRepository,
    CommentsRepository,
    DevicesService,
    DevicesQueryRepository,
    DevicesRepository,
    LikesInfoService,
    LikesInfoQueryRepository,
    LikesInfoRepository,
    PostsService,
    PostsQueryRepository,
    PostsRepository,
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    JwtService,
    JwtQueryRepository,
    TestingRepository,
    IsBlogByIdExistsConstraint,
    //Strategy
    LocalStrategy,
    JwtRefreshStrategy,
    JwtAccessStrategy,
    BasicStrategy,

    //Managers && Adapters
    EmailManager,
    CryptoAdapter,
    EmailAdapter,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
