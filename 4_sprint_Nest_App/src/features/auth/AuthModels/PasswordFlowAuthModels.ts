import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class PasswordRecoveryAuthModel {
  @IsEmail({}, { message: 'Incorrect Email' })
  @Matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, {
    message: 'Incorrect Email',
  })
  email: string;
}

export class NewPasswordAuthModel {
  @IsString({ message: 'It should be a string' })
  @Length(6, 20)
  newPassword: string;

  @IsString({ message: 'It should be a string' })
  recoveryCode: string;
}
