import {MongoClient} from 'mongodb'
import dotenv from 'dotenv'
import {blogType} from "./repositories/types-blogs-repositories";
import {postType} from "./repositories/types-posts-repositories";
import {userType} from "./repositories/types-users-repositories";

dotenv.config()

const mongoUri = process.env.MONGO_URL


if (!mongoUri) {
    throw new Error('URL isn\'t found')
}
export const client = new MongoClient(mongoUri);
const db = client.db()
export const blogsCollection = db.collection<blogType>('blogs'); // todo если поменять где будет ругаться
export const postsCollection = db.collection<postType>('posts')
export const usersCollection = db.collection<userType>('users')

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