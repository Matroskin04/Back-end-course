import {MongoClient} from 'mongodb'
import dotenv from 'dotenv'
import {BlogTypeWith_Id} from "./repositories/repositories-types/blogs-types-repositories";
import {PostTypeWith_Id} from "./repositories/repositories-types/posts-types-repositories";
import {UserTypeWith_Id} from "./repositories/repositories-types/users-types-repositories";
import {CommentTypeWith_Id} from "./repositories/repositories-types/comments-types-repositories";

dotenv.config()

const mongoUri = process.env.MONGO_URL


if (!mongoUri) {
    throw new Error('URL isn\'t found')
}
export const client = new MongoClient(mongoUri);
const db = client.db()
export const blogsCollection = db.collection<BlogTypeWith_Id>('blogs'); // todo тип указывается "просто так"?
export const postsCollection = db.collection<PostTypeWith_Id>('posts');
export const usersCollection = db.collection<UserTypeWith_Id>('users');
export const commentsCollection = db.collection<CommentTypeWith_Id>('comments');

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