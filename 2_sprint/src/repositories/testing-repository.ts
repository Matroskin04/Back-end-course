import {
    blogsCollection,
    commentsCollection,
    infoRequestCollection,
    postsCollection,
    refreshTokensCollection,
    usersCollection
} from "../db";

export const testingRepository = {

    async deleteAllData(): Promise<void> {
        try {
            await postsCollection.deleteMany({});
            await blogsCollection.deleteMany({});
            await usersCollection.deleteMany({});
            await commentsCollection.deleteMany({});
            await refreshTokensCollection.deleteMany({});
            await infoRequestCollection.deleteMany({});

            return;
        } catch (err) {
            throw new Error(`Error: ${err}`)
        }
    }
}