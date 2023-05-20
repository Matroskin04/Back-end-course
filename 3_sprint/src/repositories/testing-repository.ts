import {
    blogsCollection,
    commentsCollection, devicesCollection,
    infoRequestCollection,
    postsCollection,
    usersCollection
} from "../db";

export const testingRepository = {

    async deleteAllData(): Promise<void> {
        try {
            await postsCollection.deleteMany({});
            await blogsCollection.deleteMany({});
            await usersCollection.deleteMany({});
            await commentsCollection.deleteMany({});
            await infoRequestCollection.deleteMany({});
            await devicesCollection.deleteMany({});

            return;
        } catch (err) {
            throw new Error(`Error: ${err}`)
        }
    }
}