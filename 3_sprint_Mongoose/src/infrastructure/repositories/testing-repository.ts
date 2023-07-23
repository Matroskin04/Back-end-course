import {BlogModel} from "../../domain/blogs-schema-model";
import {PostModel} from "../../domain/posts-schema-model";
import {UserModel} from "../../domain/users-schema-model";
import {CommentModel} from "../../domain/comments-schema-model";
import {DeviceModel} from "../../domain/devices-schema-model";
import {LikesInfoModel} from "../../domain/likes-info-schema-model";
import { injectable } from "inversify";


@injectable()
export class TestingRepository {

    async deleteAllData(): Promise<void> {

        return Promise.all([
            PostModel.deleteMany({}),
            BlogModel.deleteMany({}),
            UserModel.deleteMany({}),
            CommentModel.deleteMany({}),
            DeviceModel.deleteMany({}),
            LikesInfoModel.deleteMany({})
        ])
            .then(value => {
                console.log('OK');

            }, reason => {
                console.log(reason)
            });
    }
}