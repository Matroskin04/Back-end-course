import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UsersRepository } from '../infrastructure/repository/users.repository';
import { BodyUserType } from '../infrastructure/repository/users.types.repositories';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../domain/users.entity';
import { UserModelType } from '../domain/users.db.types';
import { UserViewType } from '../infrastructure/query.repository/users.types.query.repository';
import { CryptoAdapter } from '../../../infrastructure/adapters/crypto.adapter';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { BanInfoType } from './dto/ban-info.dto';
import { UsersQueryRepository } from '../infrastructure/query.repository/users.query.repository';
import { DevicesService } from '../../devices/application/devices.service';
import { PostsQueryRepository } from '../../posts/infrastructure/query.repository/posts.query.repository';
import { BlogsBloggerQueryRepository } from '../../blogs/blogger-blogs/infrastructure/query.repository/blogs-blogger.query.repository';
import { BlogsSAQueryRepository } from '../../blogs/super-admin-blogs/infrastructure/query.repository/blogs-sa.query.repository';
import { CommentsQueryRepository } from '../../comments/infrastructure/query.repository/comments.query.repository';
import { LikesInfo } from '../../posts/domain/posts.entity';
import { LikesInfoQueryRepository } from '../../likes-info/infrastructure/query.repository/likes-info.query.repository';
import { BannedUser } from '../domain/users-banned/users-banned.entity';
import { BannedUserModelType } from '../domain/users-banned/users-banned.db.types';
import { PostsRepository } from '../../posts/infrastructure/repository/posts.repository';
import { CommentsRepository } from '../../comments/infrastructure/repository/comments.repository';
import { LikesInfoRepository } from '../../likes-info/infrastructure/repository/likes-info.repository';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
    @InjectModel(BannedUser.name)
    private BannedUserModel: BannedUserModelType,
    protected cryptoAdapter: CryptoAdapter,
    protected usersRepository: UsersRepository,
    protected usersQueryRepository: UsersQueryRepository,
    protected devicesService: DevicesService,
    protected postsQueryRepository: PostsQueryRepository,
    protected blogsSAQueryRepository: BlogsSAQueryRepository,
    protected commentsQueryRepository: CommentsQueryRepository,
    protected likesInfoQueryRepository: LikesInfoQueryRepository,
    protected postsRepository: PostsRepository,
    protected commentsRepository: CommentsRepository,
    protected likesInfoRepository: LikesInfoRepository,
  ) {}

  async createUser(inputBodyUser: BodyUserType): Promise<UserViewType> {
    //Проверяем, есть ли пользователь с такими данными
    const userByEmail = await this.usersQueryRepository.getUserByLoginOrEmail(
      inputBodyUser.email,
    );
    if (userByEmail)
      new BadRequestException([
        { message: 'User with such email already exists', field: 'email' },
      ]);

    const userByLogin = await this.usersQueryRepository.getUserByLoginOrEmail(
      inputBodyUser.login,
    );
    if (userByLogin)
      new BadRequestException([
        { message: 'User with such email already exists', field: 'email' },
      ]);

    //создаем юзера
    const passwordHash = await this.cryptoAdapter._generateHash(
      inputBodyUser.password,
    );

    const userInfo = {
      email: inputBodyUser.email,
      login: inputBodyUser.login,
      passwordHash,
    };

    const user = this.UserModel.createInstance(userInfo, this.UserModel);

    await this.usersRepository.save(user);
    return user.modifyIntoViewModel();
  }

  async updateBanInfoOfUser(
    userId: string,
    banInfo: BanInfoType,
  ): Promise<void> {
    const user = await this.usersRepository.getUserById(new ObjectId(userId));
    if (!user) throw new NotFoundException('User is not found');
    //проверка, чтобы значение isBanned отличалось от текущего
    if (banInfo.isBanned === user.banInfo.isBanned)
      throw new BadRequestException([
        {
          message: `User is already ${
            banInfo.isBanned ? 'banned' : 'unbanned'
          }`,
          field: 'isBanned',
        },
      ]);

    //обновляем инфо о юзере
    user.updateBanInfo(banInfo, user);
    await this.usersRepository.save(user);

    //удаляем все девайсы
    await this.devicesService.deleteAllDevicesByUserId(userId);

    //ищем блог юзера (для дальнейшего поиска постов)
    const blog = await this.blogsSAQueryRepository.getBlogByUserId(
      new ObjectId(userId),
    );
    let posts;
    if (blog) {
      //если найден, то ищем посты
      posts = await this.postsQueryRepository.getAllPostsOfBlogDBFormat(
        blog._id,
      );
    }
    const comments =
      await this.commentsQueryRepository.getAllCommentsOfUserDBFormat(
        new ObjectId(userId),
      );
    const postsLikesInfo =
      await this.likesInfoQueryRepository.getPostsLikesInfoByUserId(
        new ObjectId(userId),
      );
    const commentsLikesInfo =
      await this.likesInfoQueryRepository.getCommentsLikesInfoByUserId(
        new ObjectId(userId),
      );
    //объединяем информацию о забаненном юзере
    const userBannedInfo: BannedUser = {
      _id: new ObjectId(userId),
      posts,
      comments,
      postsLikesInfo,
      commentsLikesInfo,
    };
    //сохраняем её
    const bannedUser = this.BannedUserModel.createInstance(
      userBannedInfo,
      this.BannedUserModel,
    );
    await this.usersRepository.save(bannedUser);

    //Удаляем информацию из обычных коллекций
    if (posts && blog) {
      //если найден, то ищем посты
      const result1 = await this.postsRepository.deletePostsByUserId(blog._id);
      if (!result1) throw new Error('Deletion failed');
    }
    if (comments) {
      const result2 = await this.commentsRepository.deleteCommentsByUserId(
        new ObjectId(userId),
      );
      if (!result2) throw new Error('Deletion failed');
    }
    if (postsLikesInfo) {
      const result3 =
        await this.likesInfoRepository.deleteLikesInfoPostsByUserId(
          new ObjectId(userId),
        );
      if (!result3) throw new Error('Deletion failed');
    }
    if (commentsLikesInfo) {
      const result4 =
        await this.likesInfoRepository.deleteLikesInfoCommentsByUserId(
          new ObjectId(userId),
        );
      if (!result4) throw new Error('Deletion failed');
    }

    //обновляею количество лайков/дизлайков для постов и комментариев
    for (const e of postsLikesInfo) {
      const result =
        await this.likesInfoRepository.decrementNumberOfLikesOfPost(
          e.postId,
          e.statusLike,
        );
      if (!result)
        throw new Error('Decrementing number of likes/dislikes failed');
    }

    for (const e of commentsLikesInfo) {
      const result =
        await this.likesInfoRepository.decrementNumberOfLikesOfComment(
          e.commentId,
          e.statusLike,
        );
      if (!result)
        throw new Error('Decrementing number of likes/dislikes failed');
    }

    return;
  }

  async deleteSingleUser(id: string): Promise<boolean> {
    return this.usersRepository.deleteSingleUser(id);
  }

  async getUserIdByAccessToken(token: string): Promise<null | ObjectId> {
    try {
      const decode = jwt.verify(
        token,
        process.env.PRIVATE_KEY_ACCESS_TOKEN!,
      ) as {
        userId: string;
      };
      return new ObjectId(decode.userId);
    } catch (err) {
      return null;
    }
  }
}
