import {ObjectId} from "mongodb";
import {UserDBType} from "../types/types";
import {UserModel} from "../db/shemasModelsMongoose/users-shema-model";

export const usersRepository = {

    async createUser(bodyUser: UserDBType): Promise<void> {

        await UserModel.create(bodyUser);
        return;
    },

    async deleteSingleUser(id: string): Promise<boolean> {

        const result = await UserModel.deleteOne({_id: new ObjectId(id)} );
        return result.deletedCount > 0;
    },

    async updateConfirmation(id: ObjectId): Promise<void> {

        await UserModel.updateOne({_id: id}, {$set: {'emailConfirmation.isConfirmed': true}});
        return;
    },

    async updateCodeConfirmation(_id: ObjectId, newCode: string, newDate: Date): Promise<boolean> {

        const result = await UserModel.updateOne(
            {_id},
            {$set: {'emailConfirmation.confirmationCode': newCode, 'emailConfirmation.expirationDate': newDate} })
        return result.modifiedCount > 0;
    },

    async updateCodePasswordRecovery(_id: ObjectId, newCode: string, newDate: Date): Promise<boolean> {

        const result = await UserModel.updateOne(
            {_id},
            {$set: {'passwordRecovery.confirmationCode': newCode, 'passwordRecovery.expirationDate': newDate}})

        return result.modifiedCount > 0;
    },

    async updatePassword(newPasswordHash: string, _id: ObjectId): Promise<boolean> {

        const result = await UserModel.updateOne(
            {_id},
            {$set: {passwordHash: newPasswordHash}}
        )
        return result.modifiedCount > 0
    }
}