import { BlogDocument } from '../../blogs/domain/blogs-schema-model';
import { PostModel } from '../../posts/domain/posts-schema-model';
// import { UserModel } from '../../domain/users-schema-model';
// import { CommentModel } from '../../domain/comments-schema-model';
// import { DeviceModel } from '../../domain/devices-schema-model';
// import { CommentsLikesInfoModel } from '../../domain/likes-info-schema-model';

export class TestingRepository {
  async deleteAllData(): Promise<void> {
    return Promise.all([
      PostModel.deleteMany({}),
      BlogModel.deleteMany({}),
      // UserModel.deleteMany({}),
      // CommentModel.deleteMany({}),
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
