import {BlogModel} from "../db/shemasModelsMongoose/blogs-shema-model";
import {PostModel} from "../db/shemasModelsMongoose/posts-shema-model";
import {UserModel} from "../db/shemasModelsMongoose/users-shema-model";
import {CommentModel} from "../db/shemasModelsMongoose/comments-shema-model";
import {DeviceModel} from "../db/shemasModelsMongoose/devices-shema-model";

export const testingRepository = {

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