import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import {
  BanInfoType,
  UserDocument,
  UserDTOType,
  UserModelType,
} from './users.db.types';
import { UserViewType } from '../infrastructure/query.repository/users.types.query.repository';
import {
  BanInfo,
  BanInfoSchema,
  EmailConfirmation,
  EmailConfirmationSchema,
  PasswordRecovery,
  PasswordRecoverySchema,
} from './users.subschemas';
@Schema()
export class User {
  _id: ObjectId;

  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true, default: new Date().toISOString() })
  createdAt: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ type: EmailConfirmationSchema, default: {} })
  emailConfirmation: EmailConfirmation;

  @Prop({ type: PasswordRecoverySchema, default: {} })
  passwordRecovery: PasswordRecovery;

  @Prop({ type: BanInfoSchema, default: {} })
  banInfo: BanInfo;

  modifyIntoViewModel(): UserViewType {
    return {
      id: this._id.toString(),
      login: this.login,
      email: this.email,
      createdAt: this.createdAt,
      banInfo: {
        isBanned: this.banInfo.isBanned,
        banDate: this.banInfo.banDate,
        banReason: this.banInfo.banReason,
      },
    };
  }

  updateBanInfo(banInfo: BanInfoType, user: UserDocument): void {
    user.banInfo.isBanned = banInfo.isBanned;
    user.banInfo.banReason = banInfo.banReason;
    user.banInfo.banDate = new Date().toISOString();
    return;
  }

  static createInstance(
    userDTO: UserDTOType,
    UserModel: UserModelType,
  ): UserDocument {
    return new UserModel(userDTO);
  }
}
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.statics = {
  createInstance: User.createInstance,
};

UserSchema.methods = {
  modifyIntoViewModel: User.prototype.modifyIntoViewModel,
  updateBanInfo: User.prototype.updateBanInfo,
};
