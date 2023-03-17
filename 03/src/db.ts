import {MongoClient} from 'mongodb'
import dotenv from 'dotenv'
import {blogType} from "./repositories/types-blogs-repositories";

dotenv.config()

const mongoUri = process.env.mongoURI || 'mongodb://0.0.0.0:27017';
console.log(process.env.MONGO_URL)

const client = new MongoClient(mongoUri);
const db = client.db('YouTube')
export const blogsCollection = db.collection<blogType>('blogs');


export async function runDb() {
    try {
        await client.connect();

        await client.db("YouTube").command({ ping: 1});
        console.log("Connected successfully to mongo server");

    } catch {
        console.log("Invalid connection");
        await client.close();
    }
}