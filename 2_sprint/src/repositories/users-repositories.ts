import {usersCollection} from "../db";
import {UserDBType} from "./repositories-types/users-types-repositories";
import {ObjectId} from "mongodb";

export const usersRepositories = {

    async createUser(bodyUser: UserDBType): Promise<void> {

        await usersCollection.insertOne(bodyUser);
        return;
    },

    async deleteSingleUser(id: string): Promise<boolean> {

        const result = await usersCollection.deleteOne({_id: new ObjectId(id)} );
        return result.deletedCount > 0;
    },

    async updateConfirmation(id: ObjectId): Promise<void> {

        await usersCollection.updateOne({_id: id}, {$set: {'emailConfirmation.isConfirmed': true}}); // todo Имеет ли смысл делать доп проверку (_id is checked)
        return;
    },

    async updateCodeConfirmation(_id: ObjectId, newCode: string): Promise<void> {

        await usersCollection.updateOne({_id}, {$set: {'emailConfirmation.confirmationCode': newCode}})
        return;
    }
}