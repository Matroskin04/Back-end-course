import {usersCollection} from "../db";
import {userType} from "./types-users-repositories";
import {ObjectId} from "mongodb";

export const usersRepositories = {

    async createUser(bodyUser: userType): Promise<void> {

        await usersCollection.insertOne(bodyUser);
        return;
    },

    async deleteSingleUser(id: string): Promise<boolean> {

        const result = await usersCollection.deleteOne({_id: new ObjectId(id)} );
        return result.deletedCount > 0;
    }
}