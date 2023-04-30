import {usersCollection} from "../db";
import {UserType} from "./repositories-types/users-types-repositories";
import {ObjectId} from "mongodb";

export const usersRepositories = {

    async createUser(bodyUser: UserType): Promise<void> {

        await usersCollection.insertOne(bodyUser);
        return;
    },

    async deleteSingleUser(id: string): Promise<boolean> {

        const result = await usersCollection.deleteOne({_id: new ObjectId(id)} );
        return result.deletedCount > 0;
    }
}