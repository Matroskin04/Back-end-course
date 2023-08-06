import { Blog } from '../../../features/blogs/domain/blogs-schema-model';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { PostModelType } from '../../../features/posts/domain/posts-db-types';
import { BlogModelType } from '../../../features/blogs/domain/blogs.db.types';
import { UserModelType } from '../../../features/users/domain/users-db-types';
import { CommentModelType } from '../../../features/comments/domain/comments-db-types';
import { User } from '../../../features/users/domain/users-schema-model';
import { Post } from '../../../features/posts/domain/posts-schema-model';
import { Comment } from '../../../features/comments/domain/comments-schema-model';
import {
  CommentLikesInfo,
  PostLikesInfo,
} from '../likes.info/domain/likes-info-schema-model';
import {
  CommentLikesInfoModelType,
  PostLikesInfoModelType,
} from '../likes.info/domain/likes-info-db-types';

@Injectable()
export class TestingRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
    @InjectModel(User.name)
    private UserModel: UserModelType,
    @InjectModel(Comment.name)
    private CommentModel: CommentModelType,
    @InjectModel(CommentLikesInfo.name)
    private CommentLikesInfoModel: CommentLikesInfoModelType,
    @InjectModel(PostLikesInfo.name)
    private PostLikesInfoModel: PostLikesInfoModelType,
  ) {}
  async deleteAllData(): Promise<void> {
    return Promise.all([
      this.PostModel.deleteMany({}),
      this.BlogModel.deleteMany({}),
      this.UserModel.deleteMany({}),
      this.CommentModel.deleteMany({}),
      // DeviceModel.deleteMany({}),
      this.CommentLikesInfoModel.deleteMany({}),
      this.PostLikesInfoModel.deleteMany({}),
    ]).then(
      (value) => {
        console.log('OK');
      },
      (reason) => {
        console.log(reason);
      },
    );
  }
}
