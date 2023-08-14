import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from '../infrastructure/repository/users.repository';
import { BodyUserType } from '../infrastructure/repository/users.types.repositories';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../domain/users.entity';
import { UserModelType } from '../domain/users.db.types';
import { UserViewType } from '../infrastructure/query.repository/users.types.query.repository';
import { CryptoAdapter } from '../../../../infrastructure/adapters/crypto.adapter';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { BanInfoType } from './dto/ban-info.dto';
import { UsersQueryRepository } from '../infrastructure/query.repository/users.query.repository';
import { DevicesService } from '../../../devices/application/devices.service';
import { PostsQueryRepository } from '../../../posts/infrastructure/query.repository/posts.query.repository';
import { BlogsSAQueryRepository } from '../../../blogs/super-admin-blogs/infrastructure/query.repository/blogs-sa.query.repository';
import { CommentsQueryRepository } from '../../../comments/infrastructure/query.repository/comments.query.repository';
import { LikesInfo } from '../../../posts/domain/posts.entity';
import { LikesInfoQueryRepository } from '../../../likes-info/infrastructure/query.repository/likes-info.query.repository';
import { BannedUser } from '../../banned/domain/users-banned.entity';
import { BannedUserModelType } from '../../banned/domain/users-banned.db.types';
import { PostsRepository } from '../../../posts/infrastructure/repository/posts.repository';
import { CommentsRepository } from '../../../comments/infrastructure/repository/comments.repository';
import { LikesInfoRepository } from '../../../likes-info/infrastructure/repository/likes-info.repository';
import { BannedUsersQueryRepository } from '../../banned/infrastructure/banned-users.query.repository';
import { BannedUsersRepository } from '../../banned/infrastructure/banned-users.repository';
@Injectable()
export class UsersSaService {
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
    private bannedUsersQueryRepository: BannedUsersQueryRepository,
    protected bannedUsersRepository: BannedUsersRepository,
  ) {}

  async createUser(inputBodyUser: BodyUserType): Promise<UserViewType> {
    //Проверяем, есть ли пользователь с такими данными
    const userByEmail = await this.usersQueryRepository.getUserByLoginOrEmail(
      inputBodyUser.email,
    );
    if (userByEmail) {
      throw new BadRequestException([
        { message: 'User with such email already exists', field: 'email' },
      ]);
    }

    const userByLogin = await this.usersQueryRepository.getUserByLoginOrEmail(
      inputBodyUser.login,
    );
    if (userByLogin)
      throw new BadRequestException([
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

    if (banInfo.isBanned) {
      //Если юзера банят:

      //удаляем все девайсы
      await this.devicesService.deleteAllDevicesByUserId(userId);

      //если найден, то ищем посты
      const posts = await this.postsQueryRepository.getPostsByUserId(userId);
      const comments =
        await this.commentsQueryRepository.getCommentsOfUserDBFormat(
          new ObjectId(userId),
        );
      const postsLikesInfo =
        await this.likesInfoQueryRepository.getPostsLikesInfoByUserId(userId);
      const commentsLikesInfo =
        await this.likesInfoQueryRepository.getCommentsLikesInfoByUserId(
          userId,
        );
      //объединяем информацию о забаненном юзере
      const userBannedInfo: BannedUser = {
        userId: userId,
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
      await this.bannedUsersRepository.save(bannedUser);

      //Удаляем информацию из обычных коллекций
      if (posts) {
        //если найден, то ищем посты
        const result1 = await this.postsRepository.deletePostsByUserId(userId);
        if (!result1) throw new Error('Deletion failed');
      }
      if (comments) {
        const result2 = await this.commentsRepository.deleteCommentsByUserId(
          userId,
        );
        if (!result2) throw new Error('Deletion failed');
      }
      if (postsLikesInfo) {
        const result3 =
          await this.likesInfoRepository.deleteLikesInfoPostsByUserId(userId);
        if (!result3) throw new Error('Deletion failed');

        //уменьшаем количество лайков/дизлайков для постов
        for (const likeInfo of postsLikesInfo) {
          if (
            posts &&
            posts.findIndex(
              (post) => post.userId === likeInfo.userId.toString(),
            ) > -1
          )
            continue; //если это пост данного юзера (которого банят), то не изменяем

          const result =
            await this.likesInfoRepository.decrementNumberOfLikesOfPost(
              likeInfo.postId,
              likeInfo.statusLike,
            );
          if (!result)
            throw new Error('Decrementing number of likes/dislikes failed');
        }
      }
      if (commentsLikesInfo) {
        const result4 =
          await this.likesInfoRepository.deleteLikesInfoCommentsByUserId(
            userId,
          );
        if (!result4) throw new Error('Deletion failed');

        //уменьшаем количество лайков/дизлайков для комментариев
        for (const likeInfo of commentsLikesInfo) {
          if (
            comments &&
            comments.findIndex(
              (comment) =>
                comment.commentatorInfo.userId === likeInfo.userId.toString(),
            ) > -1
          )
            continue; //если это коммент данного юзера (которого банят), то не изменяем

          const result =
            await this.likesInfoRepository.decrementNumberOfLikesOfComment(
              likeInfo.commentId,
              likeInfo.statusLike,
            );
          if (!result)
            throw new Error('Decrementing number of likes/dislikes failed');
        }
      }
      //обновляем инфо о юзере
      user.updateBanInfo(banInfo, user);
      await this.usersRepository.save(user);

      return;
    }

    //Если юзера разбанят:

    const bannedUserInfo =
      await this.bannedUsersQueryRepository.getBannedUserById(userId);
    if (!bannedUserInfo) throw new Error('Banned user info is not found');

    //переносим всю информацию в обычные коллекции:
    if (bannedUserInfo.posts) {
      await this.postsRepository.createPosts(bannedUserInfo.posts);
    }

    if (bannedUserInfo.comments) {
      await this.commentsRepository.createComments(bannedUserInfo.comments);
    }

    if (bannedUserInfo.postsLikesInfo) {
      await this.likesInfoRepository.createPostsLikesInfo(
        bannedUserInfo.postsLikesInfo,
      );

      //увеличиваем количество лайков/дизлайков для постов
      for (const likeInfo of bannedUserInfo.postsLikesInfo) {
        if (
          bannedUserInfo.posts &&
          bannedUserInfo.posts.findIndex(
            (post) => post.userId === likeInfo.userId.toString(),
          ) > -1
        )
          continue; //если это пост данного юзера (которого банят), то не изменяем

        const result =
          await this.likesInfoRepository.incrementNumberOfLikesOfPost(
            likeInfo.postId,
            likeInfo.statusLike,
          );
        if (!result)
          throw new Error('Decrementing number of likes/dislikes failed');
      }
    }

    if (bannedUserInfo.commentsLikesInfo) {
      await this.likesInfoRepository.createCommentsLikesInfo(
        bannedUserInfo.commentsLikesInfo,
      );

      //увеличиваем количество лайков/дизлайков для комментариев
      for (const likeInfo of bannedUserInfo.commentsLikesInfo) {
        if (
          bannedUserInfo.comments &&
          bannedUserInfo.comments.findIndex(
            (comment) =>
              comment.commentatorInfo.userId === likeInfo.userId.toString(),
          ) > -1
        )
          continue; //если это коммент данного юзера (которого банят), то не изменяем

        //todo PromiseAll?
        const result =
          await this.likesInfoRepository.incrementNumberOfLikesOfComment(
            likeInfo.commentId,
            likeInfo.statusLike,
          );
        if (!result)
          throw new Error('Decrementing number of likes/dislikes failed');
      }
    }

    //удаляем инфо юзера из забаненных
    const result = await this.bannedUsersRepository.deleteBannedUserById(
      userId,
    );
    if (!result) throw new Error('Deletion failed');

    //меняем инфо о бане юзера
    user.updateBanInfo(banInfo, user);
    await this.usersRepository.save(user);

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
