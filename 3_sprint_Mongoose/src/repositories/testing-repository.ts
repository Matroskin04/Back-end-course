import {BlogModel} from "../shemasModelsMongoose/blogs-shema-model";
import {PostModel} from "../shemasModelsMongoose/posts-shema-model";
import {UserModel} from "../shemasModelsMongoose/users-shema-model";
import {CommentModel} from "../shemasModelsMongoose/comments-shema-model";
import {InfoRequestModel} from "../shemasModelsMongoose/info-requests-shema-model";
import {DeviceModel} from "../shemasModelsMongoose/devices-shema-model";

export const testingRepository = {

    async deleteAllData(): Promise<void> {
        try {
            await PostModel.deleteMany({});
            await BlogModel.deleteMany({});
            await UserModel.deleteMany({});
            await CommentModel.deleteMany({});
            await InfoRequestModel.deleteMany({});
            await DeviceModel.deleteMany({});
            return;

        } catch (err) {
            throw new Error(`Error: ${err}`)
        }
    }
}