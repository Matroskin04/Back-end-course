import { injectable } from "inversify";
import {ObjectId} from "mongodb";
import {UserModel} from "../../domain/users-schema-model";
import {UserDBType} from "../../types/db-types";


@injectable()
export class UsersRepository  {

    async createUser(bodyUser: UserDBType): Promise<void> {

        const userInstance = new UserModel(bodyUser);
        await userInstance.save();

        return;
    }

    async deleteSingleUser(id: string): Promise<boolean> {

        const result = await UserModel.deleteOne({_id: new ObjectId(id)} );
        return result.deletedCount === 1;
    }

    async updateConfirmation(id: ObjectId): Promise<boolean> {

        const result = await UserModel.updateOne({_id: id}, {$set: {'emailConfirmation.isConfirmed': true}});
        return result.modifiedCount === 1;
    }

    async updateCodeConfirmation(_id: ObjectId, newCode: string, newDate: Date): Promise<boolean> {

        const result = await UserModel.updateOne(
            {_id},
            {$set: {'emailConfirmation.confirmationCode': newCode, 'emailConfirmation.expirationDate': newDate} })
        return result.modifiedCount === 1;
    }

    async updateCodePasswordRecovery(_id: ObjectId, newCode: string, newDate: Date): Promise<boolean> {

        const result = await UserModel.updateOne(
            {_id},
            {$set: {'passwordRecovery.confirmationCode': newCode, 'passwordRecovery.expirationDate': newDate}})

        return result.modifiedCount === 1;
    }

    async updatePassword(newPasswordHash: string, _id: ObjectId): Promise<boolean> {

        const result = await UserModel.updateOne(
            {_id},
            {$set: {passwordHash: newPasswordHash}}
        )
        return result.modifiedCount === 1;
    }
}
