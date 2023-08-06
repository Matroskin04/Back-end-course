import { Blog } from '../../blogs/domain/blogs.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { PostModelType } from '../../posts/domain/posts.db.types';
import { BlogModelType } from '../../blogs/domain/blogs.db.types';
import { UserModelType } from '../../users/domain/users.db.types';
import { CommentModelType } from '../../comments/domain/comments.db.types';
import { User } from '../../users/domain/users.entity';
import { Post } from '../../posts/domain/posts.entity';
import { Comment } from '../../comments/domain/comments.entity';
import {
  CommentLikesInfo,
  PostLikesInfo,
} from '../../likes-info/domain/likes-info.entity';
import {
  CommentLikesInfoModelType,
  PostLikesInfoModelType,
} from '../../likes-info/domain/likes-info.db.types';

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
