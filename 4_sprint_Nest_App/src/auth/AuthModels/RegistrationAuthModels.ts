import { IsEmail, IsString, Matches } from 'class-validator';

export type RegistrationAuthModels = {
  login: string;
  email: string;
  password: string;
};

export class ConfirmationCodeAuthModel {
  @IsString({ message: 'It should be a string' })
  code: string;
}

export class EmailResendingAuthModel {
  @IsEmail({}, { message: 'Incorrect Email' })
  @Matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}
