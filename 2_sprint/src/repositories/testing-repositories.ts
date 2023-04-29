import {blogsCollection, commentsCollection, postsCollection, usersCollection} from "../db";

export const testingRepositories = {

    async deleteAllPosts(): Promise<void> {
        try {
            await postsCollection.deleteMany({});
            await blogsCollection.deleteMany({});
            await usersCollection.deleteMany({});
            await commentsCollection.deleteMany({});

            return;
        } catch (err) {
            throw new Error(`Error: ${err}`)
        }
    }
}