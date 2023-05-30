import {MongoClient} from 'mongodb'
import dotenv from 'dotenv'
import {
    BlogDBType,
    CommentDBType,
    DeviceDBType,
    InfoRequestDBType,
    PostDBType,
    UserDBType
} from "./types/types";

dotenv.config()

const mongoUri = process.env.MONGO_URL


if (!mongoUri) {
    throw new Error('URL isn\'t found')
}
export const client = new MongoClient(mongoUri);
const db = client.db()
export const blogsCollection = db.collection<BlogDBType>('blogs');
export const postsCollection = db.collection<PostDBType>('posts');
export const usersCollection = db.collection<UserDBType>('users');
export const commentsCollection = db.collection<CommentDBType>('comments');
export const infoRequestCollection = db.collection<InfoRequestDBType>('infoRequests');
export const devicesCollection = db.collection<DeviceDBType>('devices');

export async function runDb() {

    try {
        await client.connect();
        await client.db().command({ ping: 1});
        console.log("Connected successfully to mongo server");

    } catch {
        console.log("Invalid connection");
        await client.close();
    }
}