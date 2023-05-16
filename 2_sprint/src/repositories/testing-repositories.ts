import {blogsCollection, commentsCollection, postsCollection, refreshTokensCollection, usersCollection} from "../db";

export const testingRepositories = {

    async deleteAllData(): Promise<void> {
        try {
            await postsCollection.deleteMany({});
            await blogsCollection.deleteMany({});
            await usersCollection.deleteMany({});
            await commentsCollection.deleteMany({});
            await refreshTokensCollection.deleteMany({});

            return;
        } catch (err) {
            throw new Error(`Error: ${err}`)
        }
    }
}