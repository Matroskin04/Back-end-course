import {blogsCollection, postsCollection} from "../db";

export const testingRepositories = {

    async deleteAllPosts() {
        await postsCollection.deleteMany({});
        await blogsCollection.deleteMany({});

        return true;
    }
}