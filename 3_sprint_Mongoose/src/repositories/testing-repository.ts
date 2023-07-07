import {BlogModel} from "../db/shemasModelsMongoose/blogs-schema-model";
import {PostModel} from "../db/shemasModelsMongoose/posts-schema-model";
import {UserModel} from "../db/shemasModelsMongoose/users-schema-model";
import {CommentModel} from "../db/shemasModelsMongoose/comments-schema-model";
import {DeviceModel} from "../db/shemasModelsMongoose/devices-schema-model";


export class TestingRepository {

    async deleteAllData(): Promise<void> {

        return Promise.all([
            PostModel.deleteMany({}),
            BlogModel.deleteMany({}),
            UserModel.deleteMany({}),
            CommentModel.deleteMany({}),
            DeviceModel.deleteMany({})])
            .then(value => {
                console.log('OK');

            }, reason => {
                console.log(reason)
            });
    }
}