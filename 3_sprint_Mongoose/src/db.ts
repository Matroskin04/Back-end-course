import {MongoClient} from 'mongodb'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import {
    BlogDBType,
    PostDBType,
} from "./types/types";

dotenv.config()

const dbName = 'home_works'
export const mongoURL = process.env.MONGO_URL || `mongodb://0.0.0.0:27017/${dbName}`


if (!mongoURL) {
    throw new Error('URL isn\'t found')
}
export const client = new MongoClient(mongoURL);
const db = client.db();

export const blogsCollection = db.collection<BlogDBType>('blogs');
export const postsCollection = db.collection<PostDBType>('posts');
// export const usersCollection = db.collection<UserDBType>('users');
// export const commentsCollection = db.collection<CommentDBType>('comments');
// export const infoRequestCollection = db.collection<InfoRequestDBType>('infoRequests');
// export const devicesCollection = db.collection<DeviceDBType>('devices');

export async function runDb() {

    try {
        await client.connect();
        await client.db().command({ ping: 1});
        await mongoose.connect(mongoURL)
        console.log("Connected successfully to mongo server");

    } catch {
        console.log("Invalid connection");
        await client.close();
        await mongoose.disconnect()
    }
}