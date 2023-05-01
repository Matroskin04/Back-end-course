import {MongoClient} from 'mongodb'
import dotenv from 'dotenv'
import {BlogType} from "./repositories/repositories-types/blogs-types-repositories";
import {PostType} from "./repositories/repositories-types/posts-types-repositories";
import {UserType} from "./repositories/repositories-types/users-types-repositories";
import {CommentType} from "./repositories/repositories-types/comments-types-repositories";

dotenv.config()

const mongoUri = process.env.MONGO_URL


if (!mongoUri) {
    throw new Error('URL isn\'t found')
}
export const client = new MongoClient(mongoUri);
const db = client.db()
export const blogsCollection = db.collection<BlogType>('blogs'); // todo тип указывается "просто так"?
export const postsCollection = db.collection<PostType>('posts');
export const usersCollection = db.collection<UserType>('users');
export const commentsCollection = db.collection<CommentType>('comments');

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