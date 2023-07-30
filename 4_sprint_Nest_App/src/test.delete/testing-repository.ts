import { Blog } from '../blogs/domain/blogs-schema-model';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Post } from '@nestjs/common';
import { PostModelType } from '../posts/domain/posts-db-types';
import { BlogModelType } from '../blogs/domain/blogs.db.types';
import { UserModelType } from '../users/domain/users-db-types';
import { CommentModelType } from '../comments/domain/comments-db-types';
import { User } from '../users/domain/users-schema-model';

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
  ) {}
  async deleteAllData(): Promise<void> {
    return Promise.all([
      this.PostModel.deleteMany({}),
      this.BlogModel.deleteMany({}),
      this.UserModel.deleteMany({}),
      this.CommentModel.deleteMany({}),
      // DeviceModel.deleteMany({}),
      // CommentsLikesInfoModel.deleteMany({}),
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
