import {MongoClient} from 'mongodb'
import dotenv from 'dotenv'
import {blogType} from "./repositories/types-blogs-repositories";
import {postType} from "./repositories/types-posts-repositories";

dotenv.config()

const mongoUri = process.env.mongoURI || 'mongodb+srv://Egor:Kubik262602@cluster0.dqcw9ff.mongodb.net/Website_for_programmers?retryWrites=true&w=majority';
console.log(process.env.MONGO_URL)

const client = new MongoClient(mongoUri);
const db = client.db()
export const blogsCollection = db.collection<blogType>('blogs');
export const postsCollection = db.collection<postType>('posts')

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