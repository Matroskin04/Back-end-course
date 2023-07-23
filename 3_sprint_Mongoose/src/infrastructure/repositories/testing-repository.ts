import {BlogModel} from "../../db/shemasModelsMongoose/blogs-schema-model";
import {PostModel} from "../../db/shemasModelsMongoose/posts-schema-model";
import {UserModel} from "../../db/shemasModelsMongoose/users-schema-model";
import {CommentModel} from "../../db/shemasModelsMongoose/comments-schema-model";
import {DeviceModel} from "../../db/shemasModelsMongoose/devices-schema-model";
import {LikesInfoModel} from "../../db/shemasModelsMongoose/likes-info-schema-model";
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