import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { UserDocument, UserDTOType, UserModelType } from './users-db-types';
import { v4 as uuidv4 } from 'uuid';
import { UserViewType } from '../infrastructure/query.repository/users-types-query-repository';

@Schema()
export class EmailConfirmation {
  @Prop({ required: true, default: uuidv4() })
  confirmationCode: string;

  @Prop({ type: Date, required: true, default: new Date() })
  expirationDate: Date;

  @Prop({ type: Boolean, required: true, default: true })
  isConfirmed: boolean;
}
export const EmailConfirmationSchema =
  SchemaFactory.createForClass(EmailConfirmation);

@Schema()
export class PasswordRecovery {
  @Prop({ required: true, default: uuidv4() })
  confirmationCode: string;

  @Prop({ type: Date, required: true, default: new Date() })
  expirationDate: Date;
}
export const PasswordRecoverySchema =
  SchemaFactory.createForClass(PasswordRecovery);

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

  @Prop({ type: EmailConfirmationSchema, required: true })
  emailConfirmation: EmailConfirmation;

  @Prop({ type: PasswordRecoverySchema, required: true })
  passwordRecovery: PasswordRecovery;

  modifyIntoViewModel(): UserViewType {
    return {
      id: this._id.toString(),
      login: this.login,
      email: this.email,
      createdAt: this.createdAt,
    };
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
};
